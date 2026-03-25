import { useSimulationStore } from '../store/simulationStore'
import { MIN_SIMULATION_SPEED, MAX_SIMULATION_SPEED } from '../../../shared/constants'

function speedToSlider(ms: number): number {
  return Math.round(((MAX_SIMULATION_SPEED - ms) / (MAX_SIMULATION_SPEED - MIN_SIMULATION_SPEED)) * 100)
}

function sliderToSpeed(value: number): number {
  return Math.round(MAX_SIMULATION_SPEED - (value / 100) * (MAX_SIMULATION_SPEED - MIN_SIMULATION_SPEED))
}

export function SpeedSlider() {
  const { speed, setSpeed } = useSimulationStore()
  const sliderValue = speedToSlider(speed)

  return (
    <div className="flex flex-col gap-2">
      <span>Speed</span>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={sliderValue}
        onChange={(e) => setSpeed(sliderToSpeed(Number(e.target.value)))}
        className="lottery-slider w-full"
        style={{ '--fill': `${sliderValue}%` } as React.CSSProperties}
      />
    </div>
  )
}
