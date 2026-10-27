import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

interface PaymentModalFrameProps {
  titleId: string;
  children: ReactNode;
  onClose?: () => void;
  isBusy?: boolean;
}

const PaymentModalFrame = ({
  titleId,
  children,
  onClose,
  isBusy = false,
}: PaymentModalFrameProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-busy={isBusy}
      onCancel={(event) => {
        event.preventDefault();
        if (!isBusy) onClose?.();
      }}
      className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-105 overflow-y-auto rounded-3xl border-0 bg-white p-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden backdrop:bg-black/30 sm:p-8"
    >
      {children}
    </dialog>
  );
};

export interface PaymentModalAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const PaymentModalActions = ({
  secondary,
  primary,
}: {
  secondary: PaymentModalAction;
  primary: PaymentModalAction;
}) => (
  <div className="mt-7 flex gap-3">
    <button
      type="button"
      onClick={secondary.onClick}
      disabled={secondary.disabled}
      className="min-h-14 min-w-0 flex-1 cursor-pointer rounded-xl border border-gray-20 px-3 py-3 text-sm font-semibold text-gray-40 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
    >
      {secondary.label}
    </button>
    <button
      type="button"
      onClick={primary.onClick}
      disabled={primary.disabled}
      className="min-h-14 min-w-0 flex-1 cursor-pointer rounded-xl bg-blue-60 px-3 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
    >
      {primary.label}
    </button>
  </div>
);

export default PaymentModalFrame;
