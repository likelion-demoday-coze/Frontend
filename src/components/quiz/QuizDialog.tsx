import { useEffect, useId } from 'react';
import type { ReactNode } from 'react';

interface DialogAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface QuizDialogProps {
  icon: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
  secondary?: DialogAction;
  primary: DialogAction;
  onClose: () => void;
}

//퀴즈 시작·이어 풀기 팝업 공통 틀
const QuizDialog = ({
  icon,
  title,
  description,
  children,
  secondary,
  primary,
  onClose,
}: QuizDialogProps) => {
  const titleId = useId();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-108 flex-col items-center gap-9 rounded-[20px] bg-white p-6"
      >
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col items-center gap-4">
            <img src={icon} alt="" className="size-20" />
            <div className="flex flex-col items-center gap-1 text-center">
              <h2
                id={titleId}
                className="text-lg font-medium break-keep text-black lg:text-xl"
              >
                {title}
              </h2>
              <p className="text-sm font-medium break-keep whitespace-pre-line text-gray-60 lg:text-base">
                {description}
              </p>
            </div>
          </div>
          {children}
        </div>

        <div className="flex w-full gap-3 lg:w-auto">
          {/*TODO: 공통 Button 컴포넌트가 생기면 교체*/}
          {secondary && (
            <button
              type="button"
              onClick={secondary.onClick}
              className="h-14 flex-1 cursor-pointer rounded-xl border border-gray-10 bg-white text-lg font-semibold text-gray-40 lg:h-16 lg:w-42 lg:flex-none"
            >
              {secondary.label}
            </button>
          )}
          <button
            type="button"
            onClick={primary.onClick}
            disabled={primary.disabled}
            autoFocus
            className="h-14 flex-1 cursor-pointer rounded-xl bg-blue-60 text-lg font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-10 disabled:text-gray-60 lg:h-16 lg:w-42 lg:flex-none"
          >
            {primary.label}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizDialog;
