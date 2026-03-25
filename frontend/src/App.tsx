import { Layout } from './shared/components/Layout'
import { PlayerModeToggle } from './features/player/components/PlayerModeToggle'
import { NumberGrid } from './features/player/components/NumberGrid'
import { StatsSummary } from './features/stats/components/StatsSummary'
import { WinsBreakdown } from './features/stats/components/WinsBreakdown'
import { DrawRow } from './features/draw/components/DrawRow'
import { SpeedSlider } from './features/simulation/components/SpeedSlider'
import { SimulationButton } from './features/simulation/components/SimulationButton'
import { useSimulationStore } from './features/simulation/store/simulationStore'
import { usePlayerStore } from './features/player/store/playerStore'
import { useStatsStore } from './features/stats/store/statsStore'

export default function App() {
  const { mode } = usePlayerStore()
  const status = useSimulationStore((s) => s.status)
  const yearsElapsed = useStatsStore((s) => s.stats.yearsElapsed)

  return (
    <Layout>
      <div className="relative bg-white w-full max-w-6xl sm:px-[78px] px-8 py-12 flex flex-col gap-5 self-start text-lottery-dark shadow-card rounded-card">
        <h2 className="text-[40px] font-bold">Result</h2>

        {/* Stats */}
        <StatsSummary />

        {/* Wins grid */}
        <WinsBreakdown />

        {/* Draw numbers */}
        <DrawRow />

        {/* Fixed number picker */}
        {mode === 'fixed' && (
          <div className="flex flex-col gap-2">
            <NumberGrid />
            <p className="text-xs text-gray-400">Select exactly 5 numbers (1–90)</p>
          </div>
        )}

        {/* Absolute top-right button */}
        <div className="absolute top-5 right-6">
          <SimulationButton />
        </div>

        {/* Controls */}
        <PlayerModeToggle />
        <SpeedSlider />

        {/* Jackpot banner */}
        {status === 'jackpot' && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-5 py-3 text-center">
            <p className="text-yellow-700 font-bold">
              🎉 Jackpot! You won after{' '}
              <span className="text-xl font-extrabold">{yearsElapsed}</span>
              {' '}year{yearsElapsed !== 1 ? 's' : ''}!
            </p>
          </div>
        )}

        {status === 'max_draws_reached' && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-center">
            <p className="text-gray-600 font-semibold">
              Simulation ended after 500 years — no jackpot this time.
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}
