import { z } from 'zod';

export const pricingSchema = z.object({
  basePrice: z.coerce.number().positive({ message: "Base price must be greater than zero." }),
  demand: z.coerce.number().min(0, { message: "Demand cannot be negative." }),
  daysUntilEvent: z.coerce.number().int().min(0, { message: "Days must be a non-negative integer." }),
});

export const sumSchema = z.object({
  num1: z.coerce.number({invalid_type_error: "Must be a valid number"}),
  num2: z.coerce.number({invalid_type_error: "Must be a valid number"}),
});
