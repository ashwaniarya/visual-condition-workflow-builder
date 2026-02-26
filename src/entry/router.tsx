import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import WorkflowScreen from '@/presentation/screens/WorkflowScreen'
import DesignSystemScreen from '@/presentation/screens/DesignSystemScreen'
import UITestPlaygroundScreen from '@/presentation/screens/UITestPlaygroundScreen'

const router = createBrowserRouter([
  { path: '/', element: <WorkflowScreen /> },
  { path: '/designsystem', element: <DesignSystemScreen /> },
  { path: '/_playground', element: <UITestPlaygroundScreen /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
