// TODO temp show — remove when these features are generally available
export const LIMITED_FEATURE_DATA_PROVIDER_IDS = [6, 14, 17, 27, 32, 33, 42, 48, 51, 53, 86, 88, 109, 119, 121, 139, 140, 4836, 13623, 14685, 14703, 21117, 22008] as const;

export const canAccessLimitedFeature = (dataProviderId?: number | null): boolean =>
  dataProviderId != null &&
  (LIMITED_FEATURE_DATA_PROVIDER_IDS as readonly number[]).includes(dataProviderId);
