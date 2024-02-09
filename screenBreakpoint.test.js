import { describe, test, expect, vi, toBe, beforeEach } from "vitest";
import { initBreakpointComputation } from "./screenBreakpoint.js";
import { windowBreakpointChangeListener } from "./index.js";

vi.mock("./index.js", () => ({
  windowBreakpointChangeListener: vi.fn(),
}));

describe("initBreakpointComputation", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.innerWidth = 800;

    initBreakpointComputation();
  });

  test("should set the correct breakpoint and call listener", () => {
    expect(windowBreakpointChangeListener).toHaveBeenCalledTimes(1);
    expect(windowBreakpointChangeListener).toHaveBeenCalledWith("tablet");

    window.innerWidth = 1023;

    initBreakpointComputation();
    expect(windowBreakpointChangeListener).toHaveBeenCalledTimes(2);

    expect(windowBreakpointChangeListener).toHaveBeenCalledWith("laptop");
    window.innerWidth = 2000;
    initBreakpointComputation();
    expect(windowBreakpointChangeListener).toHaveBeenCalledTimes(3);
    expect(windowBreakpointChangeListener).toHaveBeenCalledWith("laptop-2xl");

    window.innerWidth = 100;
    initBreakpointComputation();
    expect(windowBreakpointChangeListener).toHaveBeenCalledTimes(4);
    expect(windowBreakpointChangeListener).toHaveBeenCalledWith("tablet-xs");
  });

  test("should not call listener if breakpoint remains the same", () => {
    expect(windowBreakpointChangeListener).toHaveBeenCalledTimes(1);
    expect(windowBreakpointChangeListener).toHaveBeenCalledWith("tablet");

    expect(windowBreakpointChangeListener).toHaveBeenCalledTimes(1);

    initBreakpointComputation();
    initBreakpointComputation();
    initBreakpointComputation();

    expect(windowBreakpointChangeListener).toHaveBeenCalledTimes(1); // No additional calls
  });
});
