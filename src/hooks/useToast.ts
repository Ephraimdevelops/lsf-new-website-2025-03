import { useToast as useToastUI } from "@/components/ui/use-toast";

export const useToast = () => {
  const { toast } = useToastUI();
  return { toast };
};
