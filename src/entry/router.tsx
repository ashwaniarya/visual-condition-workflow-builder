import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WorkflowScreen from "@/presentation/screens/WorkflowScreen";
import SuspenseFallbackSkeleton from "@/presentation/components/SuspenseFallbackSkeleton";
import ErrorFallback from "@/presentation/components/ErrorFallback";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

const DesignSystemScreen = lazy(
  () => import("@/presentation/screens/DesignSystemScreen"),
);
const UITestPlaygroundScreen = lazy(
  () => import("@/presentation/screens/UITestPlaygroundScreen"),
);

const router = createBrowserRouter([
  {
    path: "/designsystem",
    element: (
      <ErrorBoundary
        fallback={<ErrorFallback variant="fullscreen" onRetry={() => {}} />}
      >
        <Suspense fallback={<SuspenseFallbackSkeleton variant="canvas" />}>
          <DesignSystemScreen />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/_playground",
    element: (
      <ErrorBoundary
        fallback={<ErrorFallback variant="fullscreen" onRetry={() => {}} />}
      >
        <Suspense fallback={<SuspenseFallbackSkeleton variant="canvas" />}>
          <UITestPlaygroundScreen />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  { path: "/", element: <WorkflowScreen /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
