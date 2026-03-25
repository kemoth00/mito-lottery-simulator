import { usePlayerStore } from '../store/playerStore'
import { useSimulationStore } from '../../simulation/store/simulationStore'

export function PlayerModeToggle() {
  const { mode, setMode } = usePlayerStore()
  const status = useSimulationStore((s) => s.status)
  const disabled = status === 'running'
  const checked = mode === 'random'

  return (
    <label className={`flex items-center gap-4 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <span>
        Play with random numbers:
      </span>

      {/* Hidden native checkbox */}
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => setMode(e.target.checked ? 'random' : 'fixed')}
        className="sr-only"
      />

      {/* Custom squircle checkbox */}
      <span
        className="inline-flex items-center justify-center sm:w-[32px] sm:h-[32px] w-[20px] h-[20px] rounded-[5px] border border-lottery-navy bg-white shrink-0 shadow-md"
      >
        {checked && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 12.5L9.5 18L20 7" stroke="#1a1f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </label>
  )
}
