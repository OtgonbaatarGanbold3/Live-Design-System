export interface FeatureFlags {
  guidedMode: boolean;
  constraintBlocking: boolean;
  feelingPresets: boolean;
  liveStatePreview: boolean;
  advancedExporters: boolean;
  versioning: boolean;
  qualityScoring: boolean;
  analyticsDashboard: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  guidedMode: true,
  constraintBlocking: true,
  feelingPresets: true,
  liveStatePreview: true,
  advancedExporters: true,
  versioning: true,
  qualityScoring: true,
  analyticsDashboard: true,
};

export function getFeatureFlags(): FeatureFlags {
  return DEFAULT_FLAGS;
}
