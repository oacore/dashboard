// TODO temp show — remove when these features are generally available
export const LIMITED_FEATURE_FRESH_DATA_PROVIDER_IDS = [6, 14, 17, 27, 32, 33, 42, 48, 51, 53, 86, 88, 109, 119, 121, 139, 140, 4836, 13623, 14685, 14703, 21117, 22008] as const;
export const LIMITED_FEATURE_FAIR_DATA_PROVIDER_IDS = [42, 86, 88] as const;

const hasLimitedAccess = (
  dataProviderId: number | null | undefined,
  allowedIds: readonly number[],
): boolean => dataProviderId != null && allowedIds.includes(dataProviderId);

export const canAccessFreshFeature = (dataProviderId?: number | null): boolean =>
  hasLimitedAccess(dataProviderId, LIMITED_FEATURE_FRESH_DATA_PROVIDER_IDS);

export const canAccessFairFeature = (dataProviderId?: number | null): boolean =>
  hasLimitedAccess(dataProviderId, LIMITED_FEATURE_FAIR_DATA_PROVIDER_IDS);
