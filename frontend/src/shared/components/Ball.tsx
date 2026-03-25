import type { BallProps } from '../interfaces'

export function Ball({ number, variant = 'normal' }: BallProps) {
  const base =
    'inline-flex items-center justify-center sm:w-[34px] sm:h-[38px] w-[22px] h-[24px] sm:rounded-[10px] rounded-[5px] font-bold select-none sm:border-2 border sm:text-base text-sm shadow-md'

  const styles: Record<NonNullable<BallProps['variant']>, string> = {
    normal: 'bg-white text-[#1a1f5e] border-lottery-teal',
    matched: 'bg-teal-100 text-[#1a1f5e] border-lottery-teal',
    jackpot: 'bg-yellow-100 border-yellow-400 text-yellow-800',
  }

  return (
    <span className={`${base} ${styles[variant]}`}>
      {number}
    </span>
  )
}
