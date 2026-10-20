/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { getTransactions } from "../services/transactionService";
import { useAuth } from "./AuthContext";

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data || []);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated) {
      fetchTransactions();
    } else {
      queueMicrotask(() => {
        setTransactions([]);
        setLoading(false);
      });
    }
  }, [isAuthenticated, authLoading, fetchTransactions]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        setTransactions,
        loading,
        fetchTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error(
      "useTransactions must be used inside TransactionProvider"
    );
  }

  return context;
}