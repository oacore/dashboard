// TODO temp show — remove when this feature is generally available
export const LIMITED_FEATURE_FAIR_DATA_PROVIDER_IDS = [42, 86, 88] as const;

const hasLimitedAccess = (
  dataProviderId: number | null | undefined,
  allowedIds: readonly number[],
): boolean => dataProviderId != null && allowedIds.includes(dataProviderId);

export const canAccessFairFeature = (dataProviderId?: number | null): boolean =>
  hasLimitedAccess(dataProviderId, LIMITED_FEATURE_FAIR_DATA_PROVIDER_IDS);
