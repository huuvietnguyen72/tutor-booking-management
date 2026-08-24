export interface ITransaction {
  id: number;
  bookingId?: number;
  amount: number;
  paymentMethod?: string;
  transactionId?: string;
  type: "PAYMENT" | "WITHDRAWAL";
  status: "pending" | "completed" | "failed";
  description?: string;
  createdAt: string;
}

export interface IEarningSummary {
  balance: number;
  totalEarned: number;
  thisMonth: number;
  pendingClearance: number;
}
