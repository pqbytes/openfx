import type { Quote } from '../../types';
import { CountdownTimer } from './CountdownTimer';

interface QuoteSummaryProps {
  quote: Quote;
  timeRemaining: number;
  onContinue: () => void;
  isExpired: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function QuoteSummary({
  quote,
  timeRemaining,
  onContinue,
  isExpired,
  onRefresh,
  isRefreshing
}: QuoteSummaryProps) {
  return (
    <div className={`card quote-summary ${isExpired ? 'expired' : ''}`}>
      <h3>Exchange Rate</h3>
      <div className="rate-display">
        1 {quote.sourceCurrency} = {quote.rate} {quote.destinationCurrency}
      </div>
      
      <div className="details-grid">
        <div className="detail-row">
          <span>Fee</span>
          <span>{quote.fee} {quote.sourceCurrency}</span>
        </div>
        <div className="detail-row">
          <span>Total to Pay</span>
          <span>{quote.totalPayable} {quote.sourceCurrency}</span>
        </div>
        <div className="detail-row">
          <span>Recipient Gets</span>
          <span>{quote.sourceAmount * quote.rate} {quote.destinationCurrency}</span>
        </div>
      </div>

      {!isExpired ? (
        <CountdownTimer seconds={timeRemaining} />
      ) : (
        <div className="expired-message">{isRefreshing ? 'Getting fresh rate...' : 'Quote Expired'}</div>
      )}

      {isExpired ? (
        <button className="btn btn-secondary" onClick={onRefresh} disabled={isRefreshing}>
          {isRefreshing ? 'Refreshing...' : 'Refresh Rate'}
        </button>
      ) : (
        <button className="btn btn-primary" onClick={onContinue}>
          Continue to Payment
        </button>
      )}
    </div>
  );
}
