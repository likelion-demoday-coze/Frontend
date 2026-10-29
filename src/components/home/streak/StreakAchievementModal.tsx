import { useEffect, useId, useRef } from 'react';
import type { StreakDayData } from '../../../types/streak';
import { STREAK_EFFECT_STEPS } from '../../../utils/streakAchievement';
import type { StreakAchievement } from '../../../utils/streakAchievement';
import catImage from '../../../assets/character/basic_pose_cat.svg';
import bronze from '../../../assets/home/streak/1st_bronze.svg';
import silver from '../../../assets/home/streak/2nd_Silver.svg';
import gold from '../../../assets/home/streak/3th_Gold.svg';
import treasure from '../../../assets/home/streak/4th_treasure.svg';
import question from '../../../assets/streak/question_mark.svg';
import StreakWeek from './StreakWeek';

const EFFECT_IMAGES: Record<number, string> = {
  3: bronze,
  7: silver,
  14: gold,
  21: treasure,
};

interface StreakAchievementModalProps {
  achievement: StreakAchievement;
  onClose: () => void;
}

const StreakAchievementModal = ({
  achievement,
  onClose,
}: StreakAchievementModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { kind, streak, newEffect } = achievement;
  const nextEffect = STREAK_EFFECT_STEPS.find(
    (effect) => effect.days > streak.currentStreak
  );
  const previousEffect = [...STREAK_EFFECT_STEPS]
    .reverse()
    .find((effect) => effect.days <= streak.currentStreak);
  const from = previousEffect?.days ?? 0;
  const progress = nextEffect
    ? Math.min(
        100,
        Math.max(
          0,
          ((streak.currentStreak - from) / (nextEffect.days - from)) * 100
        )
      )
    : 100;
  const days: StreakDayData[] = streak.days.map((day) => ({
    id: day.date,
    label: ['일', '월', '화', '수', '목', '금', '토'][
      new Date(`${day.date}T00:00:00Z`).getUTCDay()
    ],
    status: day.today
      ? day.status === 'COMPLETED'
        ? 'todayCompleted'
        : 'todayIncomplete'
      : !day.future && day.status === 'COMPLETED'
        ? 'completed'
        : 'incomplete',
  }));

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    dialog?.showModal();
    const overflow = document.body.style.overflow;
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
      className="relative m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-90 overflow-y-auto rounded-2xl border-0 bg-white px-6 py-5 backdrop:bg-black/30"
    >
      {newEffect && (
        <span className="absolute top-5 left-4 rounded-lg border border-blue-60 px-2 py-2 text-[14px] font-semibold text-blue-60">
          새 효과 획득
        </span>
      )}
      <div className="flex flex-col items-center text-center">
        <div className="size-32 shrink-0 overflow-hidden rounded-full">
          <img src={catImage} alt="" className="size-full object-cover" />
        </div>
        <p className="relative -mt-0.5 rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-white">
          {kind === 'effect'
            ? '반짝반짝 빛난다 냥!'
            : kind === 'restarted'
              ? '다시 시작이다 냥!'
              : '내일도 와라 냥!'}
        </p>
        <p className="mt-4 text-4xl font-bold text-yellow-45">
          {streak.currentStreak}일
        </p>
        <h2 id={titleId} className="mt-1 text-sm font-bold text-black">
          {kind === 'restarted'
            ? '연속 학습을 다시 시작했어요'
            : '연속 학습 달성!'}
        </h2>
        <p className="mt-1 text-[11px] leading-5 text-gray-60">
          {kind === 'restarted'
            ? '오늘부터 다시 쌓아가요.'
            : '오늘도 정규장을 끝까지 풀었어요.'}
        </p>
      </div>
      <div className="mx-auto mt-4 w-full max-w-56 [&_ul]:gap-1">
        <StreakWeek days={days} />
      </div>
      {newEffect ? (
        <div className="mt-5 flex items-center gap-4 rounded-2xl border border-blue-15 px-4 py-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-yellow-45 bg-white p-0.5">
            <img
              src={EFFECT_IMAGES[newEffect.days]}
              alt=""
              className="size-full object-contain"
            />
          </span>
          <div className="text-xs leading-5">
            <p className="font-semibold text-black">
              <span className="text-blue-60">NEW!</span> {newEffect.name}
            </p>
            <p className="text-gray-60">홈과 모드 선택 화면에서 보여요</p>
          </div>
        </div>
      ) : nextEffect ? (
        <div className="mt-5 rounded-2xl border border-blue-15 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-gray-60">
              <strong className="font-semibold text-blue-60">
                다음 효과까지 {nextEffect.days - streak.currentStreak}일
              </strong>{' '}
              남았어요
            </p>
            <span className="relative flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-yellow-45 bg-white p-0.5">
              <img
                src={
                  nextEffect.days === 21
                    ? question
                    : EFFECT_IMAGES[nextEffect.days]
                }
                alt={nextEffect.days === 21 ? '시크릿 효과' : nextEffect.name}
                className="size-full object-contain"
              />
              <span
                aria-hidden="true"
                className="absolute top-full left-1/2 -translate-x-1/2 border-x-[7px] border-t-[7px] border-x-transparent border-t-yellow-45"
              />
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="다음 효과까지 학습 진행률"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            className="relative mt-5 mb-1 h-px rounded-full bg-gray-20"
          >
            <div
              className="h-full bg-yellow-45"
              style={{ width: `${progress}%` }}
            />
            <span
              aria-hidden="true"
              className="absolute top-1/2 right-0 size-1.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-20"
            />
            <span
              aria-hidden="true"
              className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-45"
              style={{ left: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="mt-5 rounded-2xl border border-blue-15 px-4 py-5 text-center text-xs text-blue-60">
          모든 이펙트를 달성했어요!
        </p>
      )}
      <button
        type="button"
        onClick={onClose}
        autoFocus
        className="mx-auto mt-4 block h-12 w-35 cursor-pointer rounded-lg bg-blue-60 text-sm font-semibold text-white hover:brightness-95"
      >
        확인
      </button>
    </dialog>
  );
};

export default StreakAchievementModal;
