import Navigation from '@/components/ui/Navigation'
import ResponsiveLayout from '@/components/layout/ResponsiveLayout'
import Footer from '@/components/ui/Footer'
import AOSInit from '@/components/animations/AOSInit'

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <AOSInit />
      <Navigation />
      <ResponsiveLayout />
      {/* Footer only for desktop - mobile has its own footer in ResponsiveLayout */}
      <div className="hidden md:block">
        <Footer />
      </div>
    </main>
  )
}
