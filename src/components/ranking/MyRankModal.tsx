import { useEffect, useId, useRef } from 'react';
import MyRankPanel from './MyRankPanel';
import type { MyRankPanelProps } from './MyRankPanel';

type MyRankModalProps = Omit<MyRankPanelProps, 'titleId' | 'onClose'> & {
  onClose: () => void;
};

const MyRankModal = ({
  onClose,
  onAction,
  ...panelProps
}: MyRankModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-103 overflow-y-auto rounded-2xl border-0 bg-white p-0 backdrop:bg-black/30"
    >
      <MyRankPanel
        {...panelProps}
        titleId={titleId}
        onClose={onClose}
        onAction={
          onAction
            ? () => {
                onClose();
                onAction();
              }
            : undefined
        }
      />
    </dialog>
  );
};

export default MyRankModal;
