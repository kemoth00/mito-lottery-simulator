import { useSimulationStore } from '../store/simulationStore'
import { usePlayerStore } from '../../player/store/playerStore'
import { useSimulation } from '../hooks/useSimulation'

export function SimulationButton() {
  const status = useSimulationStore((s) => s.status)
  const { mode, selectedNumbers } = usePlayerStore()
  const { startSimulation, stopSimulation, restartSimulation } = useSimulation()

  const isFixedAndIncomplete = mode === 'fixed' && selectedNumbers.length < 5
  const isTerminal = ['jackpot', 'max_draws_reached', 'stopped'].includes(status)

  async function handleClick() {
    if (status === 'idle') {
      await startSimulation()
    } else if (status === 'running') {
      await stopSimulation()
    } else if (isTerminal) {
      await restartSimulation()
    }
  }

  const label =
    status === 'idle'
      ? 'Start'
      : status === 'running'
        ? 'Stop'
        : 'Start again'

  const colours =
    status === 'running'
      ? 'bg-red-500 hover:bg-red-400 text-white'
      : isTerminal
        ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        : isFixedAndIncomplete
          ? 'bg-teal-200 text-teal-400 cursor-not-allowed'
          : 'bg-teal-500 hover:bg-teal-400 text-white'

  const isDisabled = status === 'idle' && isFixedAndIncomplete

  return (
    <button
      onClick={() => void handleClick()}
      disabled={isDisabled}
      className={`px-10 py-2.5 rounded-lg font-semibold transition-colors ${colours}`}
    >
      {label}
    </button>
  )
}
