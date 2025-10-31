import { useToast as useSonnerToast } from "@/components/ui/sonner";

export const useToast = () => {
  const { toast: sonnerToast } = useSonnerToast();

  const toast = ({ title, description, variant }: { title: string; description?: string; variant?: "default" | "destructive" }) => {
    if (variant === "destructive") {
      sonnerToast.error(title, { description });
    } else {
      sonnerToast.success(title, { description });
    }
  };

  return { toast };
};


