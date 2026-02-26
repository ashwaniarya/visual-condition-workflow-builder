import {
  lazy,
  useRef,
  useState,
  useEffect,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { DEFERRED_IMPORT } from "@/shared/constants/layout";

type LazyComponent<T extends ComponentType<unknown>> = LazyExoticComponent<T>;

/**
 * Delays a dynamic import() until the browser is idle (via requestIdleCallback),
 * with a hard timeout fallback for browsers that don't support it (Safari < 16.4).
 *
 * Returns the lazy component reference — safe to render inside <Suspense>.
 */
export function useDeferredLazyImport<T extends ComponentType<unknown>>(
  importFactory: () => Promise<{ default: T }>
): LazyComponent<T> {
  const factoryRef = useRef(importFactory);
  const [LazyComponent] = useState<LazyComponent<T>>(() => {
    let resolveModulePromise!: (module: { default: T }) => void;

    const modulePromise = new Promise<{ default: T }>((resolveModule) => {
      resolveModulePromise = resolveModule;
    });

    if (typeof window !== "undefined") {
      const startImport = () => factoryRef.current().then(resolveModulePromise);

      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(startImport, {
          timeout: DEFERRED_IMPORT.idleTimeoutMs,
        });
      } else {
        setTimeout(startImport, DEFERRED_IMPORT.fallbackDelayMs);
      }
    }

    return lazy(() => modulePromise);
  });

  useEffect(() => {
    factoryRef.current = importFactory;
  }, [importFactory]);

  return LazyComponent;
}
