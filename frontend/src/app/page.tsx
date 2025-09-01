import Navigation from '@/components/ui/Navigation'
import ResponsiveLayout from '@/components/layout/ResponsiveLayout'
import AOSInit from '@/components/animations/AOSInit'

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <AOSInit />
      <Navigation />
      <ResponsiveLayout />
    </main>
  )
}
