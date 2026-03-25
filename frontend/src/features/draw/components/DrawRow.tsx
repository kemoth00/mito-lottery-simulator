import { useDrawStore } from '../store/drawStore'
import { useSimulationStore } from '../../simulation/store/simulationStore'
import { usePlayerStore } from '../../player/store/playerStore'
import { Ball } from '../../../shared/components/Ball'

function DashBall() {
  return (
    <span className="inline-flex items-center justify-center sm:w-[34px] sm:h-[38px] w-[22px] h-[24px] sm:rounded-[10px] rounded-[5px] sm:border-2 border border-lottery-teal bg-white sm:text-base text-sm font-bold select-none shadow-md">
      —
    </span>
  )
}

function BallRow({
  numbers,
  matchedSet,
  isJackpot,
  label,
  padTo = 0,
}: {
  numbers: number[]
  matchedSet: Set<number>
  isJackpot: boolean
  label: string
  padTo?: number
}) {
  const dashCount = Math.max(0, padTo - numbers.length)
  return (
    <div className="flex items-center gap-3">
      <span className="w-36 shrink-0">{label}</span>
      <div className="flex gap-1.5 flex-wrap">
        {numbers.length === 0 && dashCount === 0 ? (
          Array.from({ length: 5 }).map((_, i) => <DashBall key={i} />)
        ) : (
          <>
            {numbers.map((n) => {
              const variant = isJackpot
                ? 'jackpot'
                : matchedSet.has(n)
                  ? 'matched'
                  : 'normal'
              return <Ball key={n} number={n} variant={variant} />
            })}
            {Array.from({ length: dashCount }).map((_, i) => (
              <DashBall key={`dash-${i}`} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export function DrawRow() {
  const { currentDraw = [], currentPlayerNumbers = [] } = useDrawStore()
  const status = useSimulationStore((s) => s.status)
  const { mode, selectedNumbers } = usePlayerStore()
  const isJackpot = status === 'jackpot'

  // In idle+fixed mode, preview selected numbers immediately
  const displayPlayerNumbers = mode === 'fixed' ? selectedNumbers : currentPlayerNumbers

  const matchedSet = new Set(
    currentDraw.filter((n) => displayPlayerNumbers.includes(n)),
  )

  return (
    <div className="flex flex-col gap-5">
      <BallRow
        label="Winning numbers:"
        numbers={currentDraw}
        matchedSet={matchedSet}
        isJackpot={isJackpot}
      />
      <BallRow
        label="Your numbers:"
        numbers={displayPlayerNumbers}
        matchedSet={matchedSet}
        isJackpot={isJackpot}
        padTo={status === 'idle' && mode === 'fixed' ? 5 : 0}
      />
    </div>
  )
}
