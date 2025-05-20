
import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

interface ApiHookOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: any) => void;
}

export function useApi<T, P = any>(
  apiMethod: (params: P) => Promise<T>,
  options: ApiHookOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const execute = useCallback(
    async (params: P) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiMethod(params);
        setData(result);
        
        if (options.successMessage) {
          toast({
            title: "Success",
            description: options.successMessage,
          });
        }
        
        if (options.onSuccess) {
          options.onSuccess(result);
        }
        
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        
        toast({
          title: "Error",
          description: options.errorMessage || error.message,
          variant: "destructive",
        });
        
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [apiMethod, options.successMessage, options.errorMessage, options.onSuccess, toast]
  );

  return { execute, data, isLoading, error, setData };
}
