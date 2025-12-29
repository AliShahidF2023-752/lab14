import { TicketPricingForm } from '@/components/ticket-pricing-form';
import { SumFunctionForm } from '@/components/sum-function-form';
import { Logo } from '@/components/icons';

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-sans antialiased">
      <div className="container mx-auto flex flex-col items-center justify-center p-4 py-8 sm:p-8 md:py-16">
        <header className="mb-10 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-3">
            <Logo className="h-10 w-10 text-primary" />
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Serverless Duo
            </h1>
          </div>
          <p className="max-w-2xl text-lg text-muted-foreground">
            An elegant interface for DigitalOcean's serverless functions. Perform
            dynamic ticket pricing and simple sum calculations with ease.
          </p>
        </header>

        <div className="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
          <TicketPricingForm />
          <SumFunctionForm />
        </div>
      </div>
    </main>
  );
}
