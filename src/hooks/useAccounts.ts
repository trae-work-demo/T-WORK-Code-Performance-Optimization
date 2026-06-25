import { useEffect, useState } from 'react';
import { fetchAccounts } from '../data/api';
import type { CustomerAccount } from '../types';

export function useAccounts() {
  const [accounts, setAccounts] = useState<CustomerAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    fetchAccounts()
      .then((result) => {
        if (!cancelled) {
          setAccounts(result);
          setError(null);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { accounts, isLoading, error };
}
