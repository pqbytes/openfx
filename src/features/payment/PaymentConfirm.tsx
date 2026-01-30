import type { Quote } from '../../types';
import { CountdownTimer } from '../quote/CountdownTimer';
import { getUserFriendlyErrorMessage } from '../../services/errors';

interface PaymentConfirmProps {
  quote: Quote;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  error: Error | null;
  timeRemaining: number;
  isExpired: boolean;
}

export function PaymentConfirm({ 
  quote, 
  onConfirm, 
  onCancel, 
  isSubmitting, 
  error,
  timeRemaining,
  isExpired 
}: PaymentConfirmProps) {
  return (
    <div className="card payment-confirm">
      <h2>Review Payment</h2>
      
      <div className="summary-row">
        <span>You send</span>
        <strong>{quote.sourceAmount} {quote.sourceCurrency}</strong>
      </div>
      
      <div className="summary-row">
        <span>Recipient gets</span>
        <strong>{quote.sourceAmount * quote.rate} {quote.destinationCurrency}</strong>
      </div>
      
      <div className="summary-row">
        <span>Total Payable (inc. fees)</span>
        <strong>{quote.totalPayable} {quote.sourceCurrency}</strong>
      </div>

      <div className="summary-timer">
        {!isExpired ? (
           <CountdownTimer seconds={timeRemaining} />
        ) : (
           <div className="expired-message">Quote Expired</div>
        )}
      </div>

      {error && (
        <div className="error-message payment-error" role="alert">
          Payment Failed: {getUserFriendlyErrorMessage(error)}
        </div>
      )}

      <div className="actions">
        <button 
          className="btn btn-secondary" 
          onClick={onCancel} 
          disabled={isSubmitting}
        >
          {isExpired ? 'Back to Quote' : 'Cancel'}
        </button>
        <button 
          className="btn btn-primary" 
          onClick={onConfirm} 
          disabled={isSubmitting || isExpired}
        >
          {isSubmitting ? 'Processing Payment...' : 'Confirm & Pay'}
        </button>
      </div>
    </div>
  );
}
