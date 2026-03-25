import { beforeEach, describe, it, expect } from 'vitest'
import { useSimulationStore } from './simulationStore'
import { DEFAULT_SIMULATION_SPEED } from '../../../shared/constants'

beforeEach(() => {
  useSimulationStore.getState().reset()
})

describe('simulationStore — initial state', () => {
  it('starts with idle status', () => {
    expect(useSimulationStore.getState().status).toBe('idle')
  })

  it('starts with no session id', () => {
    expect(useSimulationStore.getState().sessionId).toBeNull()
  })

  it('starts at the default speed', () => {
    expect(useSimulationStore.getState().speed).toBe(DEFAULT_SIMULATION_SPEED)
  })
})

describe('simulationStore — setStatus', () => {
  it('transitions to running', () => {
    useSimulationStore.getState().setStatus('running')
    expect(useSimulationStore.getState().status).toBe('running')
  })

  it('transitions to jackpot', () => {
    useSimulationStore.getState().setStatus('jackpot')
    expect(useSimulationStore.getState().status).toBe('jackpot')
  })

  it('transitions to max_draws_reached', () => {
    useSimulationStore.getState().setStatus('max_draws_reached')
    expect(useSimulationStore.getState().status).toBe('max_draws_reached')
  })

  it('transitions to stopped', () => {
    useSimulationStore.getState().setStatus('stopped')
    expect(useSimulationStore.getState().status).toBe('stopped')
  })
})

describe('simulationStore — setSessionId', () => {
  it('stores the given session id', () => {
    useSimulationStore.getState().setSessionId('abc-123')
    expect(useSimulationStore.getState().sessionId).toBe('abc-123')
  })
})

describe('simulationStore — setSpeed', () => {
  it('stores the given speed in ms', () => {
    useSimulationStore.getState().setSpeed(10)
    expect(useSimulationStore.getState().speed).toBe(10)
  })

  it('accepts the maximum speed value', () => {
    useSimulationStore.getState().setSpeed(1000)
    expect(useSimulationStore.getState().speed).toBe(1000)
  })
})

describe('simulationStore — reset', () => {
  it('resets status to idle', () => {
    useSimulationStore.getState().setStatus('running')
    useSimulationStore.getState().reset()
    expect(useSimulationStore.getState().status).toBe('idle')
  })

  it('clears the session id', () => {
    useSimulationStore.getState().setSessionId('abc-123')
    useSimulationStore.getState().reset()
    expect(useSimulationStore.getState().sessionId).toBeNull()
  })

  it('preserves the current speed (speed is not reset)', () => {
    useSimulationStore.getState().setSpeed(10)
    useSimulationStore.getState().reset()
    expect(useSimulationStore.getState().speed).toBe(10)
  })
})
