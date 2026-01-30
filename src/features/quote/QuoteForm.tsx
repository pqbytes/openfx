import type { Currency } from '../../types';

interface QuoteFormProps {
  amount: number;
  sourceCurrency: Currency;
  destinationCurrency: Currency;
  setAmount: (val: number) => void;
  setSourceCurrency: (val: Currency) => void;
  setDestinationCurrency: (val: Currency) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP', 'INR'];

export function QuoteForm({
  amount,
  sourceCurrency,
  destinationCurrency,
  setAmount,
  setSourceCurrency,
  setDestinationCurrency,
  onSubmit,
  isLoading
}: QuoteFormProps) {
  return (
    <div className="card">
      <div className="form-group">
        <label>You Send</label>
        <div className="input-row">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="100"
            disabled={isLoading}
          />
          <select 
            value={sourceCurrency} 
            onChange={(e) => setSourceCurrency(e.target.value as Currency)}
            disabled={isLoading}
          >
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Recipient Gets</label>
        <div className="input-row">
          <select 
            value={destinationCurrency} 
            onChange={(e) => setDestinationCurrency(e.target.value as Currency)}
            disabled={isLoading}
          >
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <button 
        className="btn btn-primary" 
        onClick={onSubmit} 
        disabled={isLoading}
      >
        {isLoading ? 'Getting Quote...' : 'Get Quote'}
      </button>
    </div>
  );
}
