//학습 전/완료/복구안내 표시(일주일 스트릭 아래의 문구)

import type { StreakView } from '../../../types/streak';
import CheckIcon from '../../../assets/signup/check.svg?react';

interface StreakNoticeProps {
  view: StreakView;
  // 복구 신청 후의 학습 기한
  deadlineLabel?: string;
}

const StreakNotice = ({ view, deadlineLabel }: StreakNoticeProps) => {
  //복구 관련 사항
  const isRecovery =
    view === 'broken' ||
    view === 'recoveryUnavailable' ||
    view === 'restorePending' ||
    view === 'restarted';

  // 오늘 학습 완료
  const isCompleted = view === 'completed';

  const borderClass = isCompleted
    ? 'border-green-65'
    : isRecovery
      ? 'border-blue-30'
      : 'border-yellow-45';

  // 상태에서 계산할 수 있는 문구
  let title = '';
  let description = '';

  switch (view) {
    //학습 중일때 -> 아직 오늘의 학습을 안함
    case 'learning':
      title = '오늘 자정까지 정규장을 마치면 연속학습이 이어져요';
      break;

    case 'broken':
      title = '어제 학습을 쉬어서 연속학습이 끊겼어요';

      description = '오늘 23:59까지 복구하기로 연속학습을 이어갈 수 있어요';
      break;

    case 'recoveryUnavailable':
      title = '지금은 연속학습 복구를 신청할 수 없어요';
      description =
        '상점에서 복구권 보유 수량과 구매에 필요한 FISH를 확인해 주세요';
      break;

    case 'restorePending':
      title = '아직 연속 학습을 복구할 수 있어요.';

      // TODO 수정 필요
      description = deadlineLabel
        ? `${deadlineLabel}까지 정규장을 완료해 주세요`
        : '복구 신청 후 오늘 정규장 학습을 완료해 주세요';
      break;
    //학습 완료
    case 'completed':
      title = '오늘의 학습 완료!';
      break;

    case 'restarted':
      title = '아직 이전 연속학습을 복구할 수 있어요';
      // TODO 수정 필요
      description = '복구하기를 누르면 이전 기록과 이어져요';
      break;

    //기한 지남/새로 시작 전
    case 'expired':
      title = '오늘 정규장을 마치면 1일부터 다시 시작해요';
      break;
  }

  return (
    <div
      className={`flex min-h-10 flex-col items-center justify-center rounded-lg border px-2 py-2 text-center text-[12px] leading-4 ${borderClass}`}
    >
      <p
        className={`flex items-center justify-center gap-1 ${
          isRecovery ? 'text-red-55' : 'text-gray-60'
        }`}
      >
        {/* 완료 상태에서만 체크 아이콘 사용*/}
        {isCompleted && (
          <CheckIcon aria-hidden className={`h-4 w-4 text-green-65`} />
        )}
        {title}
      </p>

      {description && <p className="mt-0.5 text-gray-60">{description}</p>}
    </div>
  );
};

export default StreakNotice;
