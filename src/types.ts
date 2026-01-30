export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR';

export type Quote = {
  quoteId: string;
  sourceCurrency: Currency;
  destinationCurrency: Currency;
  sourceAmount: number;
  rate: number;
  fee: number;
  totalPayable: number;
  expiresAt: string; // ISO Timestamp
};

export type TransactionStatus = 'PROCESSING' | 'SENT' | 'SETTLED' | 'FAILED';

export type Transaction = {
  transactionId: string;
  status: TransactionStatus;
  lastUpdated: string;
};
