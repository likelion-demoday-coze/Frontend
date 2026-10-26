import { useEffect, useId, useRef } from 'react';
import recoveryTicket from '../../../assets/store/Recover_Ticket_Orange.svg';
import passImage from '../../../assets/store/Pass_Big.svg';

export interface RecoveryActionData {
  method: 'ticket' | 'fish' | 'pass';
  ownedBefore: number;
  ownedAfter: number | null;
  fishBefore: number;
  fishAfter: number | null;
  price: number;
  deadline: string | null;
}

interface StreakRecoveryActionModalProps {
  phase: 'loading' | 'confirm' | 'started' | 'completed' | 'error';
  data: RecoveryActionData | null;
  isSubmitting: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => void;
  onQuiz: () => void;
}

const StreakRecoveryActionModal = ({
  phase,
  data,
  isSubmitting,
  error,
  onClose,
  onConfirm,
  onQuiz,
}: StreakRecoveryActionModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const isPass = data?.method === 'pass';
  const isConfirm = phase === 'confirm';
  const isDone = phase === 'started' || phase === 'completed';
  const deadline = data?.deadline
    ? `${new Date(data.deadline).toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      })}까지`
    : '-';

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
    };
  }, []);

  const title =
    phase === 'loading'
      ? '복구 정보를 확인하고 있어요'
      : phase === 'error'
        ? '복구를 진행하지 못했어요'
        : isConfirm
          ? '지금 바로 복구할까요?'
          : phase === 'completed'
            ? '연속 학습을 복구했어요'
            : '복구를 시작했어요';
  const description = isConfirm
    ? isPass
      ? '오늘 정규장을 이미 마쳐서 패스로 무료 복구돼요.'
      : data?.method === 'fish'
        ? `오늘 정규장을 이미 마쳐서 FISH ${data.price.toLocaleString()}개로 바로 복구돼요.`
        : '오늘 정규장을 이미 마쳐서 복구권을 쓰면 바로 복구돼요.'
    : phase === 'started'
      ? isPass
        ? '패스 혜택으로 무료 복구를 시작했어요.'
        : data?.method === 'fish'
          ? `FISH ${data.price.toLocaleString()}개로 복구권을 교환해 사용했어요.`
          : '복구권 1개를 사용했어요.'
      : phase === 'completed'
        ? '이전 연속학습 기록으로 다시 이어졌어요.'
        : '';
  const actionLabel = isSubmitting
    ? '처리 중...'
    : phase === 'error'
      ? '다시 시도'
      : isConfirm
        ? isPass
          ? '무료로 복구하기'
          : data?.method === 'fish'
            ? 'FISH 사용하기'
            : '복구권 사용하기'
        : phase === 'completed'
          ? '확인'
          : '퀴즈 풀러가기';

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!isSubmitting) onClose();
      }}
      className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-90 overflow-y-auto rounded-2xl border-0 bg-white p-6 backdrop:bg-black/30"
    >
      <div className="flex flex-col items-center text-center">
        <img
          src={isPass ? passImage : recoveryTicket}
          alt=""
          className="size-24 object-contain"
        />
        <h2 id={titleId} className="mt-3 text-lg font-bold">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-xs leading-5 text-gray-60">{description}</p>
        )}
        {phase === 'started' && (
          <p className="text-xs leading-5 text-gray-60">
            오늘 정규장을 끝까지 풀면 복구가 완료돼요.
          </p>
        )}
      </div>
      {data && (
        <dl className="mt-4 divide-y divide-gray-20 rounded-lg bg-gray-05 px-3 text-xs">
          <div className="flex items-center justify-between gap-3 py-3">
            <dt className="text-gray-60">
              {isPass
                ? '복구 비용'
                : data.method === 'fish'
                  ? 'FISH'
                  : '보유 복구권'}
            </dt>
            <dd className="font-semibold text-gray-60">
              {isPass ? (
                <span className="flex items-center gap-3 text-blue-60">
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] text-white">
                    PASS
                  </span>
                  패스 이용 중 · 차감 없음
                </span>
              ) : data.method === 'fish' ? (
                `${data.fishBefore.toLocaleString()} → ${isConfirm ? (data.fishBefore - data.price).toLocaleString() : (data.fishAfter?.toLocaleString() ?? '-')}`
              ) : (
                `${data.ownedBefore}개 → ${isConfirm ? data.ownedBefore - 1 : (data.ownedAfter ?? '-')}개`
              )}
            </dd>
          </div>
          {phase === 'started' && (
            <div className="flex justify-between gap-3 py-3">
              <dt className="text-gray-60">복구 마감</dt>
              <dd className="font-semibold text-red-55">{deadline}</dd>
            </div>
          )}
        </dl>
      )}
      {((isConfirm && !isPass) || phase === 'started') && (
        <p
          className={`mt-3 rounded-lg border px-3 py-2 text-center text-[11px] ${isConfirm ? 'border-yellow-45 text-red-55' : 'border-blue-60 text-blue-60'}`}
        >
          {isConfirm
            ? '사용 후에는 되돌리거나 환불할 수 없어요.'
            : '오늘 정규장을 끝까지 풀어야 복구가 완료돼요.'}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-center text-xs text-red-55">
          {error}
        </p>
      )}
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="h-12 flex-1 cursor-pointer rounded-xl border border-gray-20 text-sm text-gray-40 disabled:cursor-not-allowed"
        >
          {isDone ? '확인' : '취소'}
        </button>
        {phase !== 'loading' && phase !== 'completed' && (
          <button
            type="button"
            onClick={isDone ? onQuiz : onConfirm}
            disabled={isSubmitting}
            className="h-12 flex-1 cursor-pointer rounded-xl bg-blue-60 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </dialog>
  );
};

export default StreakRecoveryActionModal;
