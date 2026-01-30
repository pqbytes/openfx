import { useQuery } from '@tanstack/react-query';
import { mockGetTransactionStatus } from '../../services/api';
import type { TransactionStatus } from '../../types';

export const usePolling = (transactionId: string | undefined) => {
  const {
    data: transaction,
    error,
    isLoading
  } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => mockGetTransactionStatus(transactionId!),
    enabled: !!transactionId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Stop polling if SETTLED or FAILED
      if (status === 'SETTLED' || status === 'FAILED') {
        return false;
      }
      return 2000; // Poll every 2s
    },
    refetchIntervalInBackground: true // Keep polling if tab is backgrounded? Maybe not needed but safer.
  });

  return {
    status: transaction?.status as TransactionStatus | undefined,
    transaction,
    error,
    isLoading
  };
};
