import { useStatsStore } from '../store/statsStore'
import { useSimulationStore } from '../../simulation/store/simulationStore'
import { formatSpaced } from '../../../shared/utils/formatters'

const WIN_CATEGORIES = [
  { key: '2' as const, label: '2 matches' },
  { key: '3' as const, label: '3 matches' },
  { key: '4' as const, label: '4 matches' },
  { key: '5' as const, label: '5 matches' },
] as const

function getCellBorderClasses(i: number, total: number): string {
  const col2 = i % 2
  const row2 = Math.floor(i / 2)
  const numRows2 = Math.ceil(total / 2)
  const hasBaseRight = col2 < 1
  const hasBaseBottom = row2 < numRows2 - 1
  const needsXlRight = !hasBaseRight && i < total - 1
  const classes: string[] = ['border-lottery-cream']
  if (hasBaseRight) classes.push('border-r')
  if (hasBaseBottom) {
    classes.push('border-b')
    classes.push('xl:border-b-0')
  }
  if (needsXlRight) classes.push('xl:border-r')
  return classes.join(' ')
}

export function WinsBreakdown() {
  const wins = useStatsStore((s) => s.stats.wins)
  const status = useSimulationStore((s) => s.status)
  const isJackpot = status === 'jackpot'

  return (
    <div className="rounded-[10px] overflow-hidden border border-lottery-cream xl:w-3/4 shadow-md">
      <div className="grid grid-cols-2 xl:grid-cols-4">
        {WIN_CATEGORIES.map(({ key, label }, i) => {
          const isHighlighted = key === '5' && isJackpot
          return (
            <div
              key={key}
              className={[
                'px-4 py-3 flex flex-col gap-0.5 items-center justify-center',
                isHighlighted ? 'bg-yellow-50' : 'bg-white',
                getCellBorderClasses(i, WIN_CATEGORIES.length),
              ].join(' ')}
            >
              <span className="text-sm font-bold">{label}</span>
              <span
                className={`text-xl font-bold tabular-nums ${
                  isHighlighted ? 'text-yellow-600' : ''
                }`}
              >
                {formatSpaced(wins[key])}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
