import { useQuery } from "@tanstack/react-query";
import { ITransaction, IEarningSummary } from "../_types/finance-type";

export const useGetEarningSummary = () => {
  return useQuery({
    queryKey: ["earning-summary"],
    queryFn: async () => {
      return {
        balance: 0,
        totalEarned: 0,
        thisMonth: 0,
        pendingClearance: 0,
      } as IEarningSummary;
    }
  });
};

export const useGetTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      return [] as ITransaction[];
    }
  });
};
