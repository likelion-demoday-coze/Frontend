import { useEffect, useId, useRef } from 'react';
import catImage from '../../../assets/character/basic_pose_cat.svg';

interface OpenChatModalProps {
  openChatUrl?: string;
  onClose: () => void;
  onHideForThreeDays: () => void;
  isSubmitting?: boolean;
  errorMessage?: string;
}

const OpenChatModal = ({
  openChatUrl = 'https://open.kakao.com/o/giNIFlWi',
  onClose,
  onHideForThreeDays,
  isSubmitting = false,
  errorMessage = '',
}: OpenChatModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        if (!isSubmitting) onClose();
      }}
      aria-busy={isSubmitting}
      className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-103 overflow-y-auto rounded-3xl border-0 bg-white px-6 pt-6 pb-5 backdrop:bg-black/30 sm:px-8"
    >
      <div className="flex flex-col items-center text-center">
        <div className="size-32 shrink-0 overflow-hidden rounded-full bg-[#FFF4E5] sm:size-34">
          <img
            src={catImage}
            alt=""
            className="size-full origin-bottom scale-110 object-cover"
          />
        </div>
        <p className="relative -mt-2 rounded-full bg-blue-50 px-3 py-2 text-sm font-semibold text-white sm:text-base">
          소식을 알려준다 냥
        </p>
        <h2
          id={titleId}
          className="mt-6 text-[19px] leading-snug font-bold break-keep text-black sm:text-xl"
        >
          COZ:E 오픈채팅방이 열렸어요!
        </h2>
        <p
          id={descriptionId}
          className="mt-2 text-sm leading-6 break-keep text-gray-60"
        >
          급등주 순위와 이벤트 소식을 가장
          <br />
          먼저 받아보라냥
        </p>
        <ul className="mt-5 space-y-1.5 text-left text-sm leading-6 text-gray-60">
          {[
            '급등주 대결 중간 순위 공지',
            '이벤트 · 기프티콘 당첨 소식',
            '오늘의 퀴즈 리마인드',
          ].map((item) => (
            <li key={item} className="flex items-start gap-1.5">
              <span aria-hidden="true" className="shrink-0">
                🐾
              </span>
              <span className="break-keep">{item}</span>
            </li>
          ))}
        </ul>
        <a
          href={openChatUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex min-h-15 w-full items-center justify-center gap-3 rounded-xl bg-[#FEE500] px-3 py-3 text-base font-bold text-black hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-60 sm:text-lg"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 28 24"
            className="size-6 shrink-0 fill-current"
          >
            <path d="M16 1c6 0 11 4 11 9 0 3-2 6-5 7l1 5-5-4h-2C10 18 5 14 5 10s5-9 11-9Z" />
            <path
              d="M11 6C5 6 1 9 1 13c0 3 1 5 4 6l-1 4 5-3h2c5 0 9-3 9-7s-4-7-9-7Z"
              stroke="#FEE500"
              strokeWidth="1.5"
            />
          </svg>
          오픈채팅방 참여하기
        </a>
        <p className="mt-2 text-xs leading-5 text-gray-40">
          익명 프로필로 참여할 수 있어요
        </p>
      </div>
      {errorMessage && (
        <p role="alert" className="mt-4 text-center text-sm text-red-55">
          {errorMessage}
        </p>
      )}
      <div className="mt-7 flex items-center border-t border-gray-20 pt-4 text-sm text-gray-40">
        <button
          type="button"
          onClick={onHideForThreeDays}
          disabled={isSubmitting}
          className="min-h-10 min-w-0 flex-1 cursor-pointer px-1 hover:text-gray-60 disabled:cursor-wait disabled:opacity-50"
        >
          {isSubmitting ? '저장 중...' : '3일 동안 보지 않기'}
        </button>
        <span aria-hidden="true" className="h-5 w-px shrink-0 bg-gray-20" />
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="min-h-10 min-w-0 flex-1 cursor-pointer px-1 hover:text-gray-60 disabled:cursor-wait disabled:opacity-50"
        >
          닫기
        </button>
      </div>
    </dialog>
  );
};

export default OpenChatModal;
