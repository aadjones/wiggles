import { describe, it, expect } from "vitest";
import { featureFlags, isFeatureEnabled, getEnabledFeatures } from "./featureFlags";

describe("Feature Flags", () => {
  describe("isFeatureEnabled", () => {
    it("returns correct boolean for valid feature flags", () => {
      const result = isFeatureEnabled("UNLOCK_ALL_MODULES");
      expect(typeof result).toBe("boolean");
    });

    it("reflects the actual flag values", () => {
      // Test that the helper function matches the object
      Object.entries(featureFlags).forEach(([key, value]) => {
        expect(isFeatureEnabled(key as keyof typeof featureFlags)).toBe(value);
      });
    });
  });

  describe("getEnabledFeatures", () => {
    it("returns only enabled features", () => {
      const enabled = getEnabledFeatures();
      
      enabled.forEach(flagKey => {
        expect(featureFlags[flagKey]).toBe(true);
      });
    });

    it("returns array of valid flag keys", () => {
      const enabled = getEnabledFeatures();
      const validKeys = Object.keys(featureFlags);
      
      enabled.forEach(flagKey => {
        expect(validKeys).toContain(flagKey);
      });
    });

    it("excludes disabled features", () => {
      const enabled = getEnabledFeatures();
      const disabled = Object.entries(featureFlags)
        .filter(([, value]) => !value)
        .map(([key]) => key);
      
      disabled.forEach(disabledKey => {
        expect(enabled).not.toContain(disabledKey);
      });
    });
  });

  describe("flag structure validation", () => {
    it("has boolean values for all flags", () => {
      Object.values(featureFlags).forEach(value => {
        expect(typeof value).toBe("boolean");
      });
    });

    it("has descriptive flag names", () => {
      Object.keys(featureFlags).forEach(key => {
        expect(key.length).toBeGreaterThan(3);
        expect(key).toMatch(/^[A-Z_]+$/); // All caps with underscores
      });
    });
  });
});