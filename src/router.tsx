import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import WorkflowScreen from '@/screens/WorkflowScreen'
import DesignSystemScreen from '@/screens/DesignSystemScreen'
import UITestPlaygroundScreen from '@/screens/UITestPlaygroundScreen'

const router = createBrowserRouter([
  { path: '/', element: <WorkflowScreen /> },
  { path: '/designsystem', element: <DesignSystemScreen /> },
  { path: '/_playground', element: <UITestPlaygroundScreen /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
