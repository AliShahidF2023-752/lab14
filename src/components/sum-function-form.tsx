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
import { calculateSum } from '@/app/actions';
import { sumSchema } from '@/lib/schemas';
import type { SumResult } from '@/lib/types';

export function SumFunctionForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<SumResult['body'] | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof sumSchema>>({
    resolver: zodResolver(sumSchema),
    defaultValues: {
      num1: 25,
      num2: 75,
    },
  });

  function onSubmit(values: z.infer<typeof sumSchema>) {
    setResult(null);
    startTransition(async () => {
      const response = await calculateSum(values);
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
        <CardTitle className="font-headline">Simple Sum Function</CardTitle>
        <CardDescription>
          A basic serverless function that adds two numbers together.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col">
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="num1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number 1</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 25" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="num2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number 2</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 75" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="mt-auto flex-col items-stretch gap-4 pt-6">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              {isPending ? 'Calculating...' : 'Calculate Sum'}
            </Button>
            {result && (
              <div className="w-full rounded-lg border bg-card-foreground/5 p-4 text-sm">
                <p className="text-center text-muted-foreground">{result.operation}</p>
                <div className="my-3 h-px bg-border" />
                <div className="flex items-baseline justify-between">
                  <p className="text-muted-foreground">Sum:</p>
                  <p className="text-right text-2xl font-bold text-primary">{result.sum}</p>
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
