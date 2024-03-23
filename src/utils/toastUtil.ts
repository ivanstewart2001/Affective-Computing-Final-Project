import { Toast, ToasterToast } from "@/components/ui/use-toast";

export type ToastType = ({ ...props }: Toast) => {
  id: string;
  dismiss: () => void;
  update: (props: ToasterToast) => void;
};

interface toastUtilProps {
  timeoutMs: number;
  toast: ToastType;
  title: string;
  variant: "default" | "destructive" | null | undefined;
  description: string;
  func?: () => void;
}

export default function toastUtil({
  title,
  timeoutMs,
  toast,
  variant,
  description,
  func,
}: toastUtilProps) {
  const Toast = toast({
    variant,
    title,
    description,
  });

  setTimeout(() => {
    Toast.dismiss();

    if (func) {
      func();
    }
  }, timeoutMs);
}
