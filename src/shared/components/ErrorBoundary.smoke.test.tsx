// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function CrashComponent(): JSX.Element {
  throw new Error("Smoke crash");
}

describe("ErrorBoundary smoke tests", () => {
  it("renders fallback when child throws", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<div data-testid="error-fallback">Fallback rendered</div>}>
        <CrashComponent />
      </ErrorBoundary>
    );

    const fallbackElement = screen.getByTestId("error-fallback");
    expect(fallbackElement).not.toBeNull();
    expect(fallbackElement.textContent).toContain("Fallback rendered");
  });

  it("renders children when no error is thrown", () => {
    render(
      <ErrorBoundary fallback={<div data-testid="error-fallback">Fallback rendered</div>}>
        <div data-testid="healthy-child">Healthy child rendered</div>
      </ErrorBoundary>
    );

    const healthyChildElement = screen.getByTestId("healthy-child");
    expect(healthyChildElement).not.toBeNull();
    expect(healthyChildElement.textContent).toContain("Healthy child rendered");
    expect(screen.queryByTestId("error-fallback")).toBeNull();
  });
});
