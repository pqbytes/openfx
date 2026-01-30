export type ErrorCode = 
  | 'ERR_NETWORK'
  | 'ERR_QUOTE_FETCH'
  | 'ERR_PAYMENT_FAILED'
  | 'ERR_INVALID_QUOTE'
  | 'ERR_UNKNOWN';

export class AppError extends Error {
  code: ErrorCode;

  constructor(code: ErrorCode, message?: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
  }
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  ERR_NETWORK: 'We are having trouble connecting to our servers. Please check your internet connection.',
  ERR_QUOTE_FETCH: 'We could not get a quote for you at this moment. Please try again.',
  ERR_PAYMENT_FAILED: 'Your payment could not be processed. Please try again or contact support.',
  ERR_INVALID_QUOTE: 'The quote information seems invalid or has expired. Please get a new quote.',
  ERR_UNKNOWN: 'Something went wrong. Please try again later.'
};

export const getUserFriendlyErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return ERROR_MESSAGES[error.code] || ERROR_MESSAGES.ERR_UNKNOWN;
  }
  
  if (error instanceof Error) {
    return error.message; 
  }

  return ERROR_MESSAGES.ERR_UNKNOWN;
};
