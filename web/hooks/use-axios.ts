import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

interface AxiosState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export const api = axios.create({ baseURL: 'http://localhost:3000' });

export function useAxios<T = unknown>() {
  const [state, setState] = useState<AxiosState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  const request = useCallback(
    async (config: AxiosRequestConfig): Promise<AxiosResponse<T> | null> => {
      setState({ data: null, error: null, loading: true });

      try {
        const response: AxiosResponse<T> = await api.request<T>(config);
        setState({ data: response.data, error: null, loading: false });
        return response;
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const errorMessage =
          axiosError.response?.data?.message ||
          axiosError.message ||
          'Erro desconhecido';

        setState({ data: null, error: errorMessage, loading: false });
        return null;
      }
    },
    []
  );

  return {
    ...state,
    request,
  };
}
