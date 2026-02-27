import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorFallbackVariant = "fullscreen" | "panel" | "inline";

const DEFAULT_FALLBACK_CLASSNAME: Record<ErrorFallbackVariant, string> = {
  fullscreen: "min-h-screen w-full p-6",
  panel: "h-full w-full p-4",
  inline: "h-full w-full p-4",
};

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackVariant?: ErrorFallbackVariant;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  private readonly resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className={DEFAULT_FALLBACK_CLASSNAME[this.props.fallbackVariant ?? "inline"]}
          role="alert"
        >
          <button type="button" onClick={this.resetErrorBoundary}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
