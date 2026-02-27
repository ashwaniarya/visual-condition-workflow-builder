import { AppRouter } from '@/entry/router'
import ErrorBoundary from '@/shared/components/ErrorBoundary'
import ErrorFallback from '@/presentation/components/ErrorFallback'

function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback variant="fullscreen" onRetry={() => {}} />}>
      <AppRouter />
    </ErrorBoundary>
  )
}

export default App
