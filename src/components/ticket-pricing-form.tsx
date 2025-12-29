'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { calculateTicketPrice } from '@/app/actions';
import { pricingSchema } from '@/lib/schemas';
import type { PricingResult } from '@/lib/types';
import { cn } from '@/lib/utils';

export function TicketPricingForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<PricingResult['body'] | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof pricingSchema>>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      basePrice: 100,
      demand: 1.5,
      daysUntilEvent: 15,
    },
  });

  function onSubmit(values: z.infer<typeof pricingSchema>) {
    setResult(null);
    startTransition(async () => {
      const response = await calculateTicketPrice(values);
      if (response.error) {
        toast({
          variant: 'destructive',
          title: 'Calculation Failed',
          description: response.error,
        });
      } else if (response.data) {
        setResult(response.data);
      }
    });
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">Dynamic Ticket Pricing</CardTitle>
        <CardDescription>
          Calculates ticket prices based on demand and time sensitivity.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col">
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="demand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Demand Multiplier</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" placeholder="e.g., 1.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="daysUntilEvent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Days Until Event</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 15" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="mt-auto flex-col items-stretch gap-4 pt-6">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              {isPending ? 'Calculating...' : 'Calculate Price'}
            </Button>
            {result && (
              <div className="w-full rounded-lg border bg-card-foreground/5 p-4 text-sm">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <p className="text-muted-foreground">Base Price:</p>
                  <p className="text-right font-medium">${result.basePrice.toFixed(2)}</p>
                  <p className="text-muted-foreground">Price Change:</p>
                  <p className={cn(
                      "text-right font-medium",
                      result.priceIncrease.startsWith('-') ? "text-destructive" : "text-foreground"
                    )}>
                      {!result.priceIncrease.startsWith('-') && '+'}{result.priceIncrease}
                  </p>
                </div>
                <div className="my-3 h-px bg-border" />
                <div className="flex items-baseline justify-between">
                  <p className="text-muted-foreground">Final Price:</p>
                  <p className="text-right text-2xl font-bold text-primary">${result.finalPrice}</p>
                </div>
                <Accordion type="single" collapsible className="mt-2 w-full">
                  <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger className="py-1 text-xs text-muted-foreground hover:no-underline">
                      Show Raw Output
                    </AccordionTrigger>
                    <AccordionContent>
                      <pre className="mt-2 w-full overflow-x-auto rounded-md bg-secondary p-3 text-xs text-secondary-foreground">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
