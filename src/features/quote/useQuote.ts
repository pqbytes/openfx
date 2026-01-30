import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockCreateQuote } from '../../services/api';
import type { Currency } from '../../types';

export type QuoteStatus = 'IDLE' | 'FETCHING' | 'ACTIVE' | 'EXPIRED' | 'REFRESHING' | 'ERROR';

export const useQuote = () => {
  // Local state for form inputs (could be passed in, but keeping it here for simplicity of the hook)
  const [amount, setAmount] = useState<number>(1000);
  const [sourceCurrency, setSourceCurrency] = useState<Currency>('USD');
  const [destinationCurrency, setDestinationCurrency] = useState<Currency>('EUR');

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  // React Query for fetching the quote
  const { 
    data: quote, 
    error, 
    isLoading, 
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['quote', amount, sourceCurrency, destinationCurrency],
    queryFn: () => mockCreateQuote(amount, sourceCurrency, destinationCurrency),
    enabled: false, // Manual trigger only
    retry: 0, // Let the UI handle retries or errors manually for this flow
    staleTime: Infinity, // handled by our custom timer logic interaction
  });

  // Derived FSM Status
  let status: QuoteStatus = 'IDLE';

  if (isLoading && isFetching) status = 'FETCHING';
  else if (error) status = 'ERROR';
  else if (quote) {
    if (isFetching) status = 'REFRESHING';
    else {
       const expiresAt = new Date(quote.expiresAt).getTime();
       if (Date.now() >= expiresAt) status = 'EXPIRED';
       else status = 'ACTIVE';
    }
  }

  // Timer Logic
  useEffect(() => {
    if (status === 'ACTIVE' && quote?.expiresAt) {
      const expiresAt = new Date(quote.expiresAt).getTime();
      
      const updateTimer = () => {
        const now = Date.now();
        const diff = Math.max(0, Math.ceil((expiresAt - now) / 1000));
        setTimeRemaining(diff);
      };

      updateTimer(); // Initial call
      timerRef.current = window.setInterval(updateTimer, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else {
      setTimeRemaining(0);
    }
  }, [status, quote?.expiresAt]);

  const getQuote = () => {
    refetch();
  };

  const refreshQuote = () => {
    refetch();
  };

  return {
    quote,
    status,
    timeRemaining,
    error,
    formState: {
      amount,
      sourceCurrency,
      destinationCurrency,
      setAmount,
      setSourceCurrency,
      setDestinationCurrency
    },
    getQuote,
    refreshQuote
  };
};
