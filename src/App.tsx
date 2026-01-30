import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQuote } from './features/quote/useQuote';
import { usePayment } from './features/payment/usePayment';
import { usePolling } from './features/tracking/usePolling';
import { QuoteForm } from './features/quote/QuoteForm';
import { QuoteSummary } from './features/quote/QuoteSummary';
import { PaymentConfirm } from './features/payment/PaymentConfirm';
import { StatusTracker } from './features/tracking/StatusTracker';
import { getUserFriendlyErrorMessage } from './services/errors';
import './App.css';

const queryClient = new QueryClient();

function OpenFXApp() {
  const [view, setView] = useState<'QUOTE' | 'PAYMENT' | 'TRACKING'>('QUOTE');

  // Quote Feature
  const { 
    quote, 
    status: quoteStatus, 
    timeRemaining, 
    error: quoteError, 
    formState, 
    getQuote, 
    refreshQuote 
  } = useQuote();

  // Payment Feature
  const { 
    submitPayment, 
    isSubmitting, 
    transactionId, 
    error: paymentError,
    reset: resetPayment 
  } = usePayment();

  // Tracking Feature
  const { 
    transaction, 
    isLoading: isTrackingLoading 
  } = usePolling(transactionId);

  const handleContinueToPayment = () => {
    setView('PAYMENT');
  };

  const handleConfirmPayment = () => {
    if (quote) {
      submitPayment(quote.quoteId, {
        onSuccess: () => {
          setView('TRACKING');
        }
      });
    }
  };

  const handleCancelPayment = () => {
    setView('QUOTE');
  };

  const handleRestart = () => {
    resetPayment();
    setView('QUOTE');
    // Optional: reset form or keep it
  };

  return (
    <div className="app-container">
      <header>
        <h1>OpenFX</h1>
      </header>
      
      <main>
        {view === 'QUOTE' && (
          <div className="quote-flow">
            <QuoteForm
              amount={formState.amount}
              sourceCurrency={formState.sourceCurrency}
              destinationCurrency={formState.destinationCurrency}
              setAmount={formState.setAmount}
              setSourceCurrency={formState.setSourceCurrency}
              setDestinationCurrency={formState.setDestinationCurrency}
              onSubmit={getQuote}
              isLoading={quoteStatus === 'FETCHING' || quoteStatus === 'REFRESHING'}
            />

            {quoteError && (
              <div className="error-message">
                Error fetching quote: {getUserFriendlyErrorMessage(quoteError)}
              </div>
            )}

            {quote && (quoteStatus === 'ACTIVE' || quoteStatus === 'EXPIRED' || quoteStatus === 'REFRESHING') && (
              <QuoteSummary
                quote={quote}
                timeRemaining={timeRemaining}
                onContinue={handleContinueToPayment}
                isExpired={quoteStatus === 'EXPIRED' || quoteStatus === 'REFRESHING'}
                onRefresh={refreshQuote}
                isRefreshing={quoteStatus === 'REFRESHING'}
              />
            )}
          </div>
        )}

        {view === 'PAYMENT' && quote && (
          <PaymentConfirm
            quote={quote}
            onConfirm={handleConfirmPayment}
            onCancel={handleCancelPayment}
            isSubmitting={isSubmitting}
            error={paymentError}
            timeRemaining={timeRemaining}
            isExpired={quoteStatus === 'EXPIRED' || quoteStatus === 'REFRESHING'}
          />
        )}

        {view === 'TRACKING' && (
          <StatusTracker
            transaction={transaction}
            isLoading={isTrackingLoading}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OpenFXApp />
    </QueryClientProvider>
  );
}
