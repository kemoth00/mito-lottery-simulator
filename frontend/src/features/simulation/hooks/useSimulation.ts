import { useRef, useEffect, useCallback } from 'react'
import { useSimulationStore } from '../store/simulationStore'
import { usePlayerStore } from '../../player/store/playerStore'
import { useStatsStore } from '../../stats/store/statsStore'
import { useDrawStore } from '../../draw/store/drawStore'
import {
  createSession,
  tickSession,
  stopSession,
} from '../../../shared/api/simulationApi'

export function useSimulation() {
  const { status, sessionId, speed, setStatus, setSessionId, reset: resetSimulation } =
    useSimulationStore()
  const { reset: resetPlayer } = usePlayerStore()
  const { setStats, reset: resetStats } = useStatsStore()
  const { setDraw, reset: resetDraw } = useDrawStore()

  const isTickInFlight = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const speedRef = useRef(speed)

  // Keep speedRef in sync without restarting the interval
  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  const stopInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const runTick = useCallback(
    async (currentSessionId: string) => {
      if (isTickInFlight.current) return
      isTickInFlight.current = true
      try {
        const result = await tickSession(currentSessionId)

        setDraw(result.draw, result.playerNumbers, result.matchCount)
        setStats(result.stats)

        const terminalStatus = ['jackpot', 'max_draws_reached', 'stopped'] as const
        if (terminalStatus.includes(result.status as (typeof terminalStatus)[number])) {
          setStatus(result.status)
          stopInterval()
        }
      } catch {
        // On error stop gracefully
        setStatus('stopped')
        stopInterval()
      } finally {
        isTickInFlight.current = false
      }
    },
    [setDraw, setStats, setStatus, stopInterval],
  )

  const startSimulation = useCallback(async () => {
    const { mode, selectedNumbers } = usePlayerStore.getState()
    const playerNumbers = mode === 'fixed' ? selectedNumbers : []
    const res = await createSession(mode, playerNumbers)
    const id = res.sessionId

    setSessionId(id)
    setStatus('running')

    stopInterval()
    intervalRef.current = setInterval(() => {
      void runTick(id)
    }, speedRef.current)
  }, [setSessionId, setStatus, stopInterval, runTick])

  const stopSimulation = useCallback(async () => {
    stopInterval()
    if (sessionId) {
      try {
        await stopSession(sessionId)
      } catch {
        /* best effort */
      }
    }
    setStatus('stopped')
  }, [sessionId, setStatus, stopInterval])

  const resetAll = useCallback(() => {
    stopInterval()
    resetSimulation()
    resetPlayer()
    resetStats()
    resetDraw()
  }, [stopInterval, resetSimulation, resetPlayer, resetStats, resetDraw])

  const restartSimulation = useCallback(async () => {
    const { mode: prevMode, selectedNumbers: prevNumbers } = usePlayerStore.getState()
    resetAll()
    if (prevMode === 'fixed') {
      const { setMode, toggleNumber } = usePlayerStore.getState()
      setMode('fixed')
      prevNumbers.forEach((n) => toggleNumber(n))
    }
    await startSimulation()
  }, [resetAll, startSimulation])

  // Restart interval when speed changes while running
  useEffect(() => {
    if (status !== 'running' || sessionId === null) return
    stopInterval()
    const id = sessionId
    intervalRef.current = setInterval(() => {
      void runTick(id)
    }, speed)
    return stopInterval
  }, [speed, status, sessionId, runTick, stopInterval])

  // Cleanup on unmount
  useEffect(() => {
    return stopInterval
  }, [stopInterval])

  return { startSimulation, stopSimulation, resetAll, restartSimulation }
}
