import type { Transaction } from '../../types';

interface StatusTrackerProps {
  transaction: Transaction | undefined;
  isLoading: boolean;
  onRestart: () => void;
}

export function StatusTracker({ transaction, isLoading, onRestart }: StatusTrackerProps) {
  if (isLoading && !transaction) {
    return <div className="card">Loading transaction status...</div>;
  }

  if (!transaction) {
    return <div className="card">Transaction not found.</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SETTLED': return 'status-success';
      case 'FAILED': return 'status-error';
      case 'SENT': return 'status-sent';
      default: return 'status-processing';
    }
  };

  const isTerminal = transaction.status === 'SETTLED' || transaction.status === 'FAILED';

  return (
    <div className="card status-tracker" role="region" aria-label="Transaction Status">
      <h2>Transaction Status</h2>
      
      <div className={`status-badge ${getStatusColor(transaction.status)}`} role="status" aria-live="polite">
        {transaction.status}
      </div>

      <div className="status-details">
        <p>Transaction ID: {transaction.transactionId}</p>
        <p>Last Updated: {new Date(transaction.lastUpdated).toLocaleTimeString()}</p>
      </div>

      {isTerminal && (
        <button className="btn btn-primary" onClick={onRestart}>
          Make Another Transfer
        </button>
      )}
    </div>
  );
}
