import { beforeEach, describe, expect, it, vi } from "vitest";
import { debounce } from "@/shared/utils/debounce";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("does not invoke callback immediately", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 200);

    debounced("a");

    expect(callback).not.toHaveBeenCalled();
  });

  it("invokes callback after delay", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 200);

    debounced("a", "b");
    vi.advanceTimersByTime(199);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("a", "b");
  });

  it("only invokes callback once for rapid calls", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 300);

    debounced("first");
    vi.advanceTimersByTime(100);
    debounced("second");
    vi.advanceTimersByTime(100);
    debounced("third");
    vi.advanceTimersByTime(299);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("third");
  });

  it("cancels pending callback", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 100);

    debounced("value");
    debounced.cancel();
    vi.advanceTimersByTime(100);

    expect(callback).not.toHaveBeenCalled();
  });

  it("supports different delay values", () => {
    const callback = vi.fn();
    const fastDebounced = debounce(callback, 10);
    const slowDebounced = debounce(callback, 1000);

    fastDebounced("fast");
    vi.advanceTimersByTime(10);
    expect(callback).toHaveBeenNthCalledWith(1, "fast");

    slowDebounced("slow");
    vi.advanceTimersByTime(999);
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenNthCalledWith(2, "slow");
  });
});
