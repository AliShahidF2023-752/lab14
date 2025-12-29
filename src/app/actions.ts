'use server';

import { pricingSchema, sumSchema } from '@/lib/schemas';
import type { z } from 'zod';
import type { PricingResult, ApiError, SumResult } from '@/lib/types';

export async function calculateTicketPrice(
  values: z.infer<typeof pricingSchema>
): Promise<{ data?: PricingResult['body']; error?: string }> {
  try {
    // Validate input
    const validated = pricingSchema.parse(values);

    // Call your DigitalOcean function
    const response = await fetch(
      'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-efde7da4-9cf7-4aad-9f2f-8d5afd503964/default/dynamic-ticket-pricing',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          basePrice: validated.basePrice,
          demand: validated.demand,
          daysUntilEvent: validated.daysUntilEvent,
        }),
        cache: 'no-store',
      }
    );

    const data: PricingResult | ApiError = await response.json();

    // Check if it's an error response
    if (data.statusCode !== 200) {
      const errorData = data as ApiError;
      return {
        error: errorData.body.error || 'Calculation failed',
      };
    }

    // Return successful data
    const successData = data as PricingResult;
    return {
      data: successData.body,
    };
  } catch (error) {
    console.error('Calculation error:', error);
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

export async function calculateSum(
  values: z.infer<typeof sumSchema>
): Promise<{ data?: SumResult['body']; error?: string }> {
  try {
    const validated = sumSchema.parse(values);
    const response = await fetch(
      'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-efde7da4-9cf7-4aad-9f2f-8d5afd503964/default/sum-function',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          num1: validated.num1,
          num2: validated.num2,
        }),
        cache: 'no-store',
      }
    );

    const data: SumResult | ApiError = await response.json();

    if (data.statusCode !== 200) {
      const errorData = data as ApiError;
      return {
        error: errorData.body.error || 'Calculation failed',
      };
    }

    const successData = data as SumResult;
    return { data: successData.body };
  } catch (error) {
    console.error('Calculation error:', error);
    if (error instanceof z.ZodError) {
      return { error: error.errors.map((e) => e.message).join(', ') };
    }
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}
