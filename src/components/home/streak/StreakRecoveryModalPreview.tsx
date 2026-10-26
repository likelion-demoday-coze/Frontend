import { useEffect, useId, useRef, useState } from 'react';
import { getFishBalance } from '../../../api/fish';
import { getOwnedItems, getStoreItems } from '../../../api/store';
import { getMyCharacter } from '../../../api/character';
import { getStreakPenaltyNotification, getStreakRecovery } from '../../../api/streak';
import { useSearchParams } from 'react-router-dom';
import bigHandCat from '../../../assets/character/basic_2.svg';
import nobleCat from '../../../assets/character/basic_3.svg';
import basicCat from '../../../assets/character/basic_1.svg';
import { getMockStreak } from '../../../mocks/streakMock';
import StreakRecoveryModal from './StreakRecoveryModal';

// 수치만 실제 API에서 조회. 알림 확인, 구매, 복구 요청은 보내지 않음.
const loadPreview = async () => {
  const [fishBalance, owned, items, character, notification, recovery] = await Promise.all([
    getFishBalance(), getOwnedItems(), getStoreItems(), getMyCharacter(), getStreakPenaltyNotification(), getStreakRecovery(),
  ]);
  const item = items.find((item) => item.itemCode === 'STREAK_RECOVERY');
  if (!item) throw new Error('상점 조회 응답에 itemCode가 STREAK_RECOVERY인 상품이 없습니다. 서버의 상품 등록 정보를 확인해 주세요.');
  return {
    fishBalance,
    ownedTickets: owned.find((item) => item.itemCode === 'STREAK_RECOVERY')?.quantity ?? 0,
    ticketPrice: item.fishPrice,
    // 하락 기록이 없으면 현재 주가를 그대로 표시하며 하락 수치를 만들지 않음
    stockBefore: notification?.stockBeforePenalty ?? character.currentStock,
    stockAfter: notification?.stockAfterPenalty ?? character.currentStock,
    deadlineLabel: recovery?.expiresAt
      ? `${new Date(recovery.expiresAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}까지` : '-',
  };
};

const stage = (stock: number) => stock >= 10000 ? { image: nobleCat, name: '귀족냥', threshold: 10000 }
  : stock >= 1000 ? { image: bigHandCat, name: '큰손냥', threshold: 1000 }
    : { image: basicCat, name: '초보냥', threshold: 0 };
// API 실패도 페이지 뒤에 묻히지 않도록 팝업 안에서 안내
const PreviewStatusModal = ({ error, onClose, onRetry }: {
  error: string;
  onClose: () => void;
  onRetry: () => void;
}) => {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { dialog?.close(); document.body.style.overflow = overflow; };
  }, []);
  return <dialog ref={ref} aria-labelledby={titleId}
    onCancel={(event) => { event.preventDefault(); onClose(); }}
    className="m-auto w-[calc(100%-32px)] max-w-96 rounded-2xl border-0 bg-white p-6 backdrop:bg-black/30">
    <h2 id={titleId} className="text-base font-bold">복구 팝업 프리뷰</h2>
    <p role={error ? 'alert' : 'status'} className="mt-3 text-sm leading-6 text-gray-60">
      {error || '실제 주가·FISH·보유 복구권 정보를 불러오는 중이에요.'}
    </p>
    <div className="mt-5 flex gap-3">
      <button type="button" onClick={onClose} className="h-11 flex-1 cursor-pointer rounded-xl border border-gray-20 text-sm">닫기</button>
      {error && <button type="button" onClick={onRetry} className="h-11 flex-1 cursor-pointer rounded-xl bg-blue-60 text-sm font-semibold text-white">다시 조회</button>}
    </div>
  </dialog>;
};

const StreakRecoveryModalPreview = () => {
  const [params, setParams] = useSearchParams();
  const scenario = params.get('recoveryModal');
  const enabled = import.meta.env.DEV && !!scenario && ['ticket', 'fish', 'insufficient', 'expired', 'pass'].includes(scenario);
  const [data, setData] = useState<Awaited<ReturnType<typeof loadPreview>> | null>(null);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    loadPreview().then((result) => { if (active) setData(result); })
      .catch((error: unknown) => { if (active) setError(error instanceof Error ? error.message : '미리보기 정보를 불러오지 못했어요.'); });
    return () => { active = false; };
  }, [enabled, retryCount]);

  const close = () => {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      next.delete('recoveryModal');
      next.delete('stageDrop');
      return next;
    }, { replace: true });
  };

  if (!enabled) return null;
  if (error || !data) return <PreviewStatusModal
    error={error}
    onClose={close}
    onRetry={() => { setError(''); setData(null); setRetryCount((count) => count + 1); }}
  />;
  const before = stage(data.stockBefore);
  const after = stage(data.stockAfter);

  return <StreakRecoveryModal
    data={{
      days: getMockStreak(scenario === 'expired' ? 'expired' : 'broken').days,
      expired: scenario === 'expired',
      hasPass: scenario === 'pass',
      ...data,
      stageDrop: params.get('stageDrop') === '1' && before.threshold > after.threshold ? {
        beforeImage: before.image,
        beforeName: before.name,
        afterImage: after.image,
        afterName: after.name,
        description: `주가가 ${before.threshold.toLocaleString()} 아래로 떨어졌어요.`,
      } : undefined,
    }}
    onClose={close}
    onRestore={() => alert('복구 신청 화면 예시입니다. 실제 복구권과 FISH는 사용되지 않습니다.')}
    onShop={() => alert('상점 이동 버튼 예시입니다.')}
    onQuiz={() => alert('퀴즈 이동 버튼 예시입니다.')}
  />;
};

export default StreakRecoveryModalPreview;
