import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import WorkflowScreen from '@/screens/WorkflowScreen'
import DesignSystemScreen from '@/screens/DesignSystemScreen'

const router = createBrowserRouter([
  { path: '/', element: <WorkflowScreen /> },
  { path: '/designsystem', element: <DesignSystemScreen /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
