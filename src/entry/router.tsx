import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WorkflowScreen from "@/presentation/screens/WorkflowScreen";
import SuspenseFallbackSkeleton from "@/presentation/components/SuspenseFallbackSkeleton";

const DesignSystemScreen = lazy(
  () => import("@/presentation/screens/DesignSystemScreen")
);
const UITestPlaygroundScreen = lazy(
  () => import("@/presentation/screens/UITestPlaygroundScreen")
);

const router = createBrowserRouter([
  { path: "/", element: <WorkflowScreen /> },
  {
    path: "/designsystem",
    element: (
      <Suspense fallback={<SuspenseFallbackSkeleton variant="canvas" />}>
        <DesignSystemScreen />
      </Suspense>
    ),
  },
  {
    path: "/_playground",
    element: (
      <Suspense fallback={<SuspenseFallbackSkeleton variant="canvas" />}>
        <UITestPlaygroundScreen />
      </Suspense>
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
