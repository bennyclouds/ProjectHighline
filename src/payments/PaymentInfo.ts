// src/payments/PaymentInfo.ts

export interface PaymentInfo {
  method: "CARD" | "CASH" | "ACCOUNT" | "VOUCHER";
  amount: number;
  currency?: string;

  transactionId?: string;     // for card/account payments
  authorizationCode?: string; // optional auth code
  last4?: string;             // optional masked card info

  billingName?: string;
  billingEmail?: string;
  billingPhone?: string;

  notes?: string;
}
