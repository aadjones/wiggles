import { describe, it, expect } from "vitest";
import { calculateSineValue } from "./math";

describe("calculateSineValue", () => {
  it("calculates basic sine wave correctly", () => {
    const params = { amplitude: 1, frequency: 1, phase: 0 };

    // sin(0) = 0
    expect(calculateSineValue(0, params)).toBeCloseTo(0);

    // sin(π/2) ≈ 1
    expect(calculateSineValue(Math.PI / 2, params)).toBeCloseTo(1);

    // sin(π) ≈ 0
    expect(calculateSineValue(Math.PI, params)).toBeCloseTo(0);
  });

  it("handles phase shifts correctly", () => {
    const params = { amplitude: 1, frequency: 1, phase: 90 }; // 90 degree phase shift

    // With 90° phase shift, sin(0 + π/2) = sin(π/2) = 1
    expect(calculateSineValue(0, params)).toBeCloseTo(1);

    // sin(π/2 + π/2) = sin(π) = 0
    expect(calculateSineValue(Math.PI / 2, params)).toBeCloseTo(0);
  });

  it("scales amplitude correctly", () => {
    const params = { amplitude: 2, frequency: 1, phase: 0 };

    // 2 * sin(π/2) = 2 * 1 = 2
    expect(calculateSineValue(Math.PI / 2, params)).toBeCloseTo(2);
  });
});
