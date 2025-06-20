
import { useState } from 'react';
import { toast } from 'sonner';

interface UseFormSubmissionOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export const useFormSubmission = (options: UseFormSubmissionOptions = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    onSuccess,
    onError,
    successMessage = 'Form submitted successfully!',
    errorMessage = 'Failed to submit form. Please try again.',
  } = options;

  const submitForm = async (formData: any, endpoint?: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // For now, simulate form submission
      // In a real app, this would make an API call
      console.log('Form submission:', { formData, endpoint });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success
      toast.success(successMessage);
      onSuccess?.(formData);
      
      return { success: true, data: formData };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : errorMessage;
      setError(errorMsg);
      toast.error(errorMsg);
      onError?.(err instanceof Error ? err : new Error(errorMsg));
      
      return { success: false, error: errorMsg };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitForm,
    isSubmitting,
    error,
    clearError: () => setError(null),
  };
};
