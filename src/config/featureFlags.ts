/**
 * Feature flags for development and experimentation
 * 
 * These flags control experimental features and development-only behaviors.
 * Set to false for production builds.
 */

export const featureFlags = {
  /**
   * When enabled, all modules are unlocked regardless of progress.
   * Useful for development and testing.
   */
  UNLOCK_ALL_MODULES: true,

  /**
   * Enable debug logging for spectral analysis
   */
  DEBUG_SPECTRAL_ANALYSIS: false,

  /**
   * Show performance metrics in the UI
   */
  SHOW_PERFORMANCE_METRICS: false,
} as const;

// Type for feature flag keys
export type FeatureFlagKey = keyof typeof featureFlags;

// Helper function to check if a feature is enabled
export function isFeatureEnabled(flag: FeatureFlagKey): boolean {
  return featureFlags[flag];
}

// Helper function to get all enabled features (useful for debugging)
export function getEnabledFeatures(): FeatureFlagKey[] {
  return Object.entries(featureFlags)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key as FeatureFlagKey);
}