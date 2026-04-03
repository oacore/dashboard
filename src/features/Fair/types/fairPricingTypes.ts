export type FairPricingPriceType = 'low' | 'middle' | 'high' | 'sustaining';

export type FairPricingPrice = {
  type: FairPricingPriceType;
  original?: number;
  discounted?: number;
  free?: boolean;
};

export type FairPricingHeader = {
  name: string;
  type?: FairPricingPriceType;
};

export type FairPricingSubRow = {
  title: string;
  caption: string;
  prices: FairPricingPrice[];
};

export type FairPricingTable = {
  title: string;
  headers: FairPricingHeader[];
  certification: {
    subRows: FairPricingSubRow[];
  };
};
