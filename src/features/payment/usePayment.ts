import { useMutation } from '@tanstack/react-query';
import { mockSubmitPayment } from '../../services/api';

export const usePayment = () => {
  const {
    mutate: submitPayment,
    isPending: isSubmitting,
    data,
    error,
    reset
  } = useMutation({
    mutationFn: mockSubmitPayment,
  });

  return {
    submitPayment,
    isSubmitting,
    transactionId: data?.transactionId,
    error,
    reset
  };
};
