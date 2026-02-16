import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

interface UseApiOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError) => void;
}

export function useApi<T = any>(options: UseApiOptions<T> = {}) {
  const [data, setData] = useState<T | undefined>(options.initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const callApi = useCallback(async (
    config: AxiosRequestConfig,
    callbacks?: {
      onSuccess?: (data: T) => void;
      onError?: (error: AxiosError) => void;
    }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios(config);
      const responseData = response.data.data || response.data;
      setData(responseData);
      
      // Call callbacks
      callbacks?.onSuccess?.(responseData);
      options.onSuccess?.(responseData);
      
      return { success: true, data: responseData };
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError);
      
      // Call error callbacks
      callbacks?.onError?.(axiosError);
      options.onError?.(axiosError);
      
      return { success: false, error: axiosError };
    } finally {
      setLoading(false);
    }
  }, [options.onSuccess, options.onError]);

  const reset = useCallback(() => {
    setData(options.initialData);
    setError(null);
    setLoading(false);
  }, [options.initialData]);

  return {
    data,
    loading,
    error,
    callApi,
    reset,
    setData,
  };
}