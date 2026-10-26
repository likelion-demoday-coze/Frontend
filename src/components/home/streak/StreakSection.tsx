import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { getStreakRecovery, requestStreakRecovery } from '../../../api/streak';
import type { StreakRecovery } from '../../../api/streak';
import { ROUTES } from '../../../constants/routes';
import type { StreakData, StreakDayStatus } from '../../../types/streak';
import { useStreakContext } from '../../../hooks/useMyStreak';
import StreakCard from './StreakCard';
import SectionTitle from '../../common/SectionTitle';

const EFFECT_STEPS = [
  { id: 'effect-3', requiredDays: 3, name: '동전' },
  { id: 'effect-7', requiredDays: 7, name: '은화' },
  { id: 'effect-14', requiredDays: 14, name: '금화' },
  { id: 'effect-21', requiredDays: 21, name: '시크릿' },
];

const StreakSection = () => {
  const navigate = useNavigate();
  const { streak, isError } = useStreakContext();
  const [recovery, setRecovery] = useState<StreakRecovery | null>(null);
  const [recoveryError, setRecoveryError] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);
  const restoreLock = useRef(false);

  useEffect(() => {
    let active = true;
    getStreakRecovery().then((result) => {
      if (active) setRecovery(result);
    }).catch(() => {
      if (active) setRecoveryError('복구 상태를 불러오지 못했어요.');
    });
    return () => { active = false; };
  }, []);

  const handleRestore = async () => {
    if (!recovery?.requestable || restoreLock.current) return;
    restoreLock.current = true;
    setIsRestoring(true);
    setRecoveryError('');
    try {
      const result = await requestStreakRecovery(recovery.eventId);
      setRecovery(result);
      // 상단 스트릭을 포함한 서버 최신 기록을 다시 조회
      window.location.reload();
    } catch (error) {
      setRecoveryError(isAxiosError(error)
        ? error.response?.data?.message ?? '복구 신청에 실패했어요.'
        : error instanceof Error ? error.message : '복구 신청에 실패했어요.');
    } finally {
      restoreLock.current = false;
      setIsRestoring(false);
    }
  };
  const currentDays = streak?.currentStreak ?? 0;
  const nextStep = EFFECT_STEPS.find((step) => step.requiredDays > currentDays);
  const previousStep = [...EFFECT_STEPS].reverse().find(
    (step) => step.requiredDays <= currentDays
  );
  const data: StreakData = {
    view: recovery?.status === 'PENDING' ? 'restorePending'
      : recovery?.status === 'AVAILABLE' && recovery.requestable
        ? streak?.learnedToday ? 'restarted' : 'broken'
        : recovery?.status === 'EXPIRED' && !streak?.learnedToday ? 'expired'
        : streak?.learnedToday ? 'completed' : 'learning',
    currentDays,
    bestDays: streak?.highestStreak ?? null,
    // 서버의 날짜별 기록을 기존 요일 아이콘 데이터로 변환
    days: (streak?.days ?? []).map((day) => {
      let status: StreakDayStatus = 'incomplete';
      if (day.today) {
        status = day.status === 'COMPLETED' ? 'todayCompleted' : 'todayIncomplete';
      } else if (day.date === recovery?.missedDate && recovery.status === 'RECOVERED') {
        status = 'restored';
      } else if (day.date === recovery?.missedDate && (recovery.status === 'AVAILABLE' || recovery.status === 'PENDING')) {
        status = 'pending';
      } else if (!day.future && day.status === 'COMPLETED') {
        status = 'completed';
      }

      return {
        id: day.date,
        label: ['일', '월', '화', '수', '목', '금', '토'][
          new Date(`${day.date}T00:00:00Z`).getUTCDay()
        ],
        status,
      };
    }),
    effects: EFFECT_STEPS.map((step) => ({
      ...step,
      status: step.requiredDays <= currentDays
        ? 'active'
        : step.id === nextStep?.id ? 'upcoming' : 'locked',
    })),
    progress: {
      from: previousStep?.requiredDays ?? 0,
      to: nextStep?.requiredDays ?? 21,
      current: currentDays,
      nextName: nextStep?.name ?? '',
    },
    remainingDays: nextStep ? nextStep.requiredDays - currentDays : 0,
  };

  return (
    <section className="w-full">
      <SectionTitle title="연속학습" />
      {streak ? (
        <StreakCard
          data={data}
          onRestore={handleRestore}
          isRestoring={isRestoring}
          deadlineLabel={recovery?.expiresAt
            ? new Date(recovery.expiresAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
            : undefined}
          onStartQuiz={() => navigate(ROUTES.QUIZ)}
        />
      ) : (
        <p className="mt-4 text-sm text-gray-60">
          {isError ? '연속학습 정보를 불러오지 못했어요.' : '불러오는 중...'}
        </p>
      )}
      {recoveryError && <p role="alert" className="mt-2 text-xs text-red-55">{recoveryError}</p>}
    </section>
  );
};

export default StreakSection;
