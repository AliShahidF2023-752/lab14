'use server';

import type { z } from 'zod';
import type { ApiError, PricingResult, SumResult } from '@/lib/types';
import { pricingSchema, sumSchema } from '@/lib/schemas';

const PRICING_URL = 'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-efde7da4-9cf7-4aad-9f2f-8d5afd503964/default/dynamic-ticket-pricing';
const SUM_URL = 'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-efde7da4-9cf7-4aad-9f2f-8d5afd503964/default/sum-function';

export async function calculateTicketPrice(
  values: z.infer<typeof pricingSchema>
): Promise<{ data?: PricingResult['body']; error?: string }> {
  try {
    const response = await fetch(PRICING_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    const result: PricingResult | ApiError = await response.json();

    if (result.statusCode !== 200) {
      const apiError = result as ApiError;
      if (apiError.body && apiError.body.error) {
        return { error: apiError.body.error };
      }
      return { error: 'An unknown error occurred.' };
    }

    return { data: (result as PricingResult).body };
  } catch (err) {
    return { error: 'Failed to connect to the pricing service. Please try again later.' };
  }
}

export async function calculateSum(
  values: z.infer<typeof sumSchema>
): Promise<{ data?: SumResult['body']; error?: string }> {
  try {
    const response = await fetch(SUM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    const result: SumResult | ApiError = await response.json();
    
    if (result.statusCode !== 200) {
      const apiError = result as ApiError;
      if (apiError.body && apiError.body.error) {
        return { error: apiError.body.error };
      }
      return { error: 'An unknown error occurred.' };
    }

    return { data: (result as SumResult).body };
  } catch (err) {
    return { error: 'Failed to connect to the sum service. Please try again later.' };
  }
}
