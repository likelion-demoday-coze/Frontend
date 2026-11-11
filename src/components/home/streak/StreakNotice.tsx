//학습 전/완료/복구안내 표시(일주일 스트릭 아래의 문구)

import type { StreakView } from '../../../types/streak';
import CheckIcon from '../../../assets/signup/check.svg?react';

interface StreakNoticeProps {
  view: StreakView;
  currentDays: number;
  // 복구 신청 후의 학습 기한
  deadlineLabel?: string;
}

const StreakNotice = ({
  view,
  currentDays,
  deadlineLabel,
}: StreakNoticeProps) => {
  //복구 관련 사항
  const isRecovery =
    view === 'broken' || view === 'restorePending' || view === 'restarted';

  // 오늘 학습 완료
  const isCompleted = view === 'completed';

  // 상태에서 계산할 수 있는 문구
  let title = '';
  let description = '';

  switch (view) {
    //학습 중일때 -> 아직 오늘의 학습을 안함
    case 'learning':
      title =
        currentDays === 0
          ? '오늘 정규장을 마치면 1일부터 다시 시작해요'
          : '오늘 자정까지 정규장을 마치면 연속학습이 이어져요';
      break;

    case 'broken':
      title = '어제 학습을 쉬어서 연속학습이 끊겼어요';

      description = '오늘 23:59까지 복구할 수 있어요';
      break;

    case 'restorePending':
      title = '아직 연속학습을 복구할 수 있어요';

      description = `복구하면 ${currentDays + 1}일로 이어져요 · ${deadlineLabel ?? '오늘 23:59'}까지`;
      break;
    //학습 완료
    case 'completed':
      title = '오늘의 학습 완료';
      break;

    case 'restarted':
      title = '아직 연속학습을 복구할 수 있어요';
      description = `복구하면 ${currentDays + 1}일로 이어져요 · ${deadlineLabel ?? '오늘 23:59'}까지`;
      break;

    //기한 지남/새로 시작 전
    case 'expired':
      title = '오늘 정규장을 마치면 1일부터 다시 시작해요';
      break;
  }

  return (
    <div className="mx-auto flex min-h-10 w-fit max-w-full flex-col items-start justify-center text-left text-[11px] leading-5 font-semibold">
      <p
        className={`flex items-center gap-1 ${
          isRecovery ? 'text-red-55' : 'text-gray-60'
        }`}
      >
        {/* 완료 상태에서만 체크 아이콘 사용*/}
        {isCompleted && (
          <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-green-65">
            <CheckIcon aria-hidden className="size-3 text-white" />
          </span>
        )}
        {title}
      </p>

      {description && <p className="mt-0.5 text-gray-60">{description}</p>}
    </div>
  );
};

export default StreakNotice;
