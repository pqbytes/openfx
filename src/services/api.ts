import type { Quote, Transaction, TransactionStatus } from '../types';
import { AppError } from './errors';

const delay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockCreateQuote = async (
  sourceAmount: number,
  sourceCurrency: 'USD' | 'EUR' | 'GBP' | 'INR',
  destinationCurrency: 'USD' | 'EUR' | 'GBP' | 'INR'
): Promise<Quote> => {
  await delay(800 + Math.random() * 1200); // 0.8s - 2s delay

  // 10% chance of random network error
  if (Math.random() < 0.1) {
    throw new AppError('ERR_QUOTE_FETCH', 'Network hiccup: Failed to fetch quote');
  }

  const rate = 1.25 + (Math.random() * 0.1 - 0.05); // Random rate ~1.25

  return {
    quoteId: crypto.randomUUID(),
    sourceCurrency,
    destinationCurrency,
    sourceAmount,
    rate: parseFloat(rate.toFixed(4)),
    fee: parseFloat((sourceAmount * 0.01).toFixed(2)),
    totalPayable: parseFloat((sourceAmount + sourceAmount * 0.01).toFixed(2)),
    expiresAt: new Date(Date.now() + 30 * 1000).toISOString(), // 30s expiry
  };
};

export const mockSubmitPayment = async (quoteId: string): Promise<{ transactionId: string }> => {
  await delay(1000); // 1s delay

  if (!quoteId) throw new AppError('ERR_INVALID_QUOTE', 'Invalid quote ID');

  // 10% chance of random payment failure
  if (Math.random() < 0.1) {
    throw new AppError('ERR_PAYMENT_FAILED', 'Payment service unavailable');
  }

  return { transactionId: crypto.randomUUID() };
};

export const mockGetTransactionStatus = async (transactionId: string): Promise<Transaction> => {
  await delay(500); // Fast polling response

  // using a simple in-memory store to simulate progression over time.
  
  return getMockTransactionState(transactionId);
};

// Simple in-memory store for mock transaction progression
const transactionStore: Record<string, { startTime: number; status: TransactionStatus }> = {};

const getMockTransactionState = (id: string): Transaction => {
  if (!transactionStore[id]) {
    transactionStore[id] = { startTime: Date.now(), status: 'PROCESSING' };
  }

  const tx = transactionStore[id];
  const elapsed = Date.now() - tx.startTime;

  // Progression logic
  if (tx.status === 'PROCESSING' && elapsed > 2000) {
    tx.status = 'SENT';
  }
  
  if (tx.status === 'SENT' && elapsed > 5000) {
    // 80% success, 20% fail
    tx.status = Math.random() > 0.2 ? 'SETTLED' : 'FAILED';
  }

  return {
    transactionId: id,
    status: tx.status,
    lastUpdated: new Date().toISOString(),
  };
};
