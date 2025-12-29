export type PricingResult = {
  body: {
    basePrice: number;
    demand: number;
    daysUntilEvent: number;
    demandMultiplier: string;
    timeMultiplier: string;
    finalPrice: string;
    priceIncrease: string;
  };
  statusCode: number;
};

export type SumResult = {
  body: {
    num1: number;
    num2: number;
    sum: number;
    operation: string;
  };
  statusCode: number;
};

export type ApiError = {
  body: {
    error: string;
    received?: any;
  };
  statusCode: number;
};
