import type {
  FairPricingPrice,
  FairPricingPriceType,
  FairPricingTable,
} from './fairPricingTypes';

/** CMS may send the table object directly or under `table` / `tableMembers`. */
export const parseFairPricingTable = (value: unknown): FairPricingTable | undefined => {
  if (!value || typeof value !== 'object') {
    return undefined;
  }
  const o = value as Record<string, unknown>;
  if (typeof o.title === 'string' && Array.isArray(o.headers)) {
    return value as FairPricingTable;
  }
  return undefined;
};

export const formatGbp = (value: number): string => `£${value.toLocaleString('en-GB')}`;

export const findPrice = (
  prices: FairPricingPrice[],
  type: FairPricingPriceType
): FairPricingPrice | undefined => prices.find((p) => p.type === type);
