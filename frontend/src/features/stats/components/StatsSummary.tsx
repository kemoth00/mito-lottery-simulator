import { useStatsStore } from '../store/statsStore'
import { useSimulationStore } from '../../simulation/store/simulationStore'
import { formatHuf, formatSpaced } from '../../../shared/utils/formatters'

export function StatsSummary() {
  const { tickets, yearsElapsed, totalCost } = useStatsStore((s) => s.stats)
  const status = useSimulationStore((s) => s.status)
  const isJackpot = status === 'jackpot'

  return (
    <div className="rounded-xl px-5 py-4 flex flex-col gap-1.5 text-white xl:w-1/2 bg-lottery-teal">
      <StatRow label="Number of tickets:" value={formatSpaced(tickets)} className="text-[16px]" />
      <StatRow
        label="Years spent:"
        value={String(yearsElapsed)}
        highlight={isJackpot}
      />
      <StatRow label="Cost of tickets:" value={formatHuf(totalCost)} />
    </div>
  )
}

function StatRow({
  label,
  value,
  highlight = false,
  className = '',
}: {
  label: string
  value: string
  highlight?: boolean
  className?: string
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={`text-white font-bold ${className}`}>{label}</span>
      <span className={`font-bold tabular-nums ${highlight ? 'text-yellow-300' : 'text-white'} ${className}`}>
        {value}
      </span>
    </div>
  )
}
