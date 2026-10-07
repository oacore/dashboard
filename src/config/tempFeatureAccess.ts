// TODO temp show — remove when these features are generally available
export const LIMITED_FEATURE_DATA_PROVIDER_IDS = [42, 86, 88] as const;

export const canAccessLimitedFeature = (dataProviderId?: number | null): boolean =>
  dataProviderId != null &&
  (LIMITED_FEATURE_DATA_PROVIDER_IDS as readonly number[]).includes(dataProviderId);
