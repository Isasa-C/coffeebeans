import { useEffect } from "react";
import { BeanForm } from "@/components/bean-form";

interface AddBeanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBeanModal({ isOpen, onClose }: AddBeanModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKey);

    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-bean-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(47,36,28,0.38)] px-4 py-8 sm:py-12"
      onClick={onClose}
    >
      <div className="relative w-full max-w-3xl" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close add bean modal"
          className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white/85 text-muted transition hover:text-accent"
        >
          ×
        </button>

        <div id="add-bean-modal-title">
          <BeanForm onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
}
