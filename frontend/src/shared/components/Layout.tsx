import type { LayoutProps } from '../interfaces'
import logo from '../assets/logo.svg'

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-lottery-bg">
      {/* Header */}
      <header className="px-5 flex items-center gap-3 shadow-sm bg-lottery-header">
        <img src={logo} alt="Logo" className="w-7 h-7" />
        <h1 className="text-[40px] font-bold text-white">
          Lottery Simulator
        </h1>
      </header>

      {/* Main content */}
      <main className="flex-1 flex justify-center px-4 py-8">
        {children}
      </main>
    </div>
  )
}
