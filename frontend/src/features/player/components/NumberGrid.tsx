import { usePlayerStore } from '../store/playerStore'
import { useSimulationStore } from '../../simulation/store/simulationStore'
import { MAX_PLAYER_NUMBERS, TOTAL_LOTTERY_NUMBERS } from '../../../shared/constants'

export function NumberGrid() {
  const { selectedNumbers, toggleNumber } = usePlayerStore()
  const status = useSimulationStore((s) => s.status)
  const isDisabled = status === 'running'

  return (
    <div className="grid grid-cols-10 gap-1 xl:w-1/2">
      {Array.from({ length: TOTAL_LOTTERY_NUMBERS }, (_, i) => i + 1).map((n) => {
        const isSelected = selectedNumbers.includes(n)
        const isMaxReached = selectedNumbers.length >= MAX_PLAYER_NUMBERS && !isSelected
        const cellDisabled = isDisabled || isMaxReached

        return (
          <button
            key={n}
            onClick={() => toggleNumber(n)}
            disabled={cellDisabled}
            aria-pressed={isSelected}
            aria-label={`Number ${n}`}
            className={[
              'h-9 w-full rounded text-sm font-semibold transition-colors border',
              isSelected
                ? 'bg-teal-500 border-teal-500 text-white'
                : cellDisabled
                  ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'bg-white border-gray-300 hover:border-teal-400 hover:text-teal-600',
            ].join(' ')}
          >
            {isSelected ? '✕' : n}
          </button>
        )
      })}
    </div>
  )
}
