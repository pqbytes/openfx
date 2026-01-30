# OpenFX Frontend Challenge

A simplified international money transfer flow built with React, TypeScript, and TanStack Query.

## How to run the app

1.  **Install dependencies**:
    ```bash
    bun install
    ```
2.  **Run logic**:
    ```bash
    bun run dev
    ```
3.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## Key Design Decisions

- **State Management**: Used **Finite State Machines (FSM)** concepts implicitly for the Quote status (`IDLE` -> `FETCHING` -> `ACTIVE` -> `EXPIRED`) and Transaction status (`PROCESSING` -> `SENT` -> `SETTLED`/`FAILED`). This ensures predictable UI states and avoids invalid transitions.
- **Async Data**: Leveraged **TanStack Query (React Query)** for all async operations.
  - Used `useQuery` for fetching quotes and polling transaction status.
  - Used `useMutation` for payment submission.
  - This handles loading, error, and caching states out of the box.
- **Separation of Concerns**:
  - `services/`: Pure API mock calls.
  - `features/`: Feature-specific logic (Hooks + UI Components).
  - `App.tsx`: orchestration layer that manages the high-level view transitions (`QUOTE` -> `PAYMENT` -> `TRACKING`).
- **Safety**:
  - Payment button is disabled during submission to prevent double-submit.
  - Quote "Continue" button is replaced by "Refresh" when the quote expires.
  - Polling automatically stops when the transaction reaches a terminal state (`SETTLED` or `FAILED`).
- **Error Handling Details**:
  - error messages are handled to be user-friendly for each specific error codes.
  - errors are thrown at random intervals to simulate network failures / payment falures

## Mock API Behavior

The application uses a simulated backend (`src/services/api.ts`) to mimic real-world network conditions:

### Quotes

- **Delay**: Random latency between 800ms and 2000ms.
- **Failures**: 10% chance of random network error to test error handling.
- **Rates**: Randomly generated exchange rate around ~1.25.

### Payments

- **Delay**: Fixed 1000ms latency.
- **Failures**: 10% chance of failure to simulate gateway issues.

### Transaction Status

- **Polling**: Fast 500ms response time for status checks.
- **Lifecycle**:
  - `PROCESSING` -> `SENT`: Transition happens after ~2 seconds.
  - `SENT` -> `SETTLED` / `FAILED`: Final state reached after ~5 seconds.
  - **Outcome**: 80% success rate (`SETTLED`), 20% failure rate (`FAILED`).

## Future Improvements

- **Testing**: Add unit tests for the hooks (`useQuote`, `usePayment`) using Vitest and React Testing Library to verify the state transitions.
- **Input Validation**: Add `zod` or similar for form validation (e.g., min/max amount limits).
- **Design System**: Replace CSS variables with a proper Tailwind setup or a component library for consistency if the app grows.
- **Internationalization**: Add i18n support for formatting currencies and text labels.
