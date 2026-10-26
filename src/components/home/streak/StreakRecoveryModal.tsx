import { useEffect, useId, useRef } from 'react';
import returnCat from '../../../assets/character/return_cat.svg';
import type { StreakDayData } from '../../../types/streak';
import StreakWeek from './StreakWeek';

export interface StreakRecoveryModalData {
  days: StreakDayData[];
  expired: boolean;
  hasPass: boolean;
  ownedTickets: number;
  fishBalance: number;
  ticketPrice: number;
  stockBefore: number;
  stockAfter: number;
  deadlineLabel: string;
  recoveryStatus?: 'AVAILABLE' | 'PENDING' | 'RECOVERED' | 'EXPIRED';
  // 캐릭터 단계가 하락했을 때만 전달
  stageDrop?: {
    beforeImage: string;
    beforeName: string;
    afterImage: string;
    afterName: string;
    description: string;
  };
}

interface StreakRecoveryModalProps {
  data: StreakRecoveryModalData;
  onClose: () => void;
  onRestore: () => void;
  onShop: () => void;
  onQuiz: () => void;
  isSubmitting?: boolean;
  onShown?: () => void;
  errorMessage?: string;
}

const StreakRecoveryModal = ({ data, onClose, onRestore, onShop, onQuiz, isSubmitting = false, onShown, errorMessage }: StreakRecoveryModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const shownCallback = useRef(onShown);
  // 기한 만료 → 패스 → 복구권 → FISH 구매 가능 여부 순서로 분기
  const mode = data.recoveryStatus === 'RECOVERED' ? 'recovered'
    : data.recoveryStatus === 'PENDING' ? 'pending'
    : data.expired ? 'expired' : data.hasPass ? 'pass'
    : data.ownedTickets > 0 ? 'ticket'
    : data.fishBalance >= data.ticketPrice ? 'fish' : 'insufficient';
  const needsShop = mode === 'insufficient';
  const dropRate = data.stockBefore > 0
    ? ((data.stockAfter - data.stockBefore) / data.stockBefore) * 100 : 0;
  const quizAction = mode === 'expired' || mode === 'pending' || mode === 'recovered';
  const action = quizAction ? onQuiz : needsShop ? onShop : onRestore;

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    if (dialog?.open) shownCallback.current?.();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const rows = [
    { label: '주가', value: <><span className="text-gray-40">{data.stockBefore.toFixed(2)} → </span><span className="text-blue-60">{data.stockAfter.toFixed(2)} ({dropRate > 0 ? '+' : ''}{Number(dropRate.toFixed(1))}%)</span></> },
    { label: '이펙트', value: mode === 'recovered' ? '복구 완료' : mode === 'expired' ? '사라짐' : '일시정지' },
    ...(mode === 'ticket' ? [{ label: '보유 복구권', value: `${data.ownedTickets}개 → ${data.ownedTickets - 1}개` }] : []),
    ...(mode === 'fish' ? [{ label: 'FISH', value: <><span className="text-red-55">{data.ticketPrice} 사용</span> · 보유 {data.fishBalance} → {data.fishBalance - data.ticketPrice}</> }] : []),
    ...(mode === 'insufficient' ? [{ label: 'FISH', value: <span className="text-red-55">보유 {data.fishBalance} · {data.ticketPrice - data.fishBalance}개 부족</span> }] : []),
    ...(mode === 'pass' ? [{ label: '복구 비용', value: <span className="text-blue-60">PASS · 패스 이용 중 · 차감 없음</span> }] : []),
    { label: mode === 'expired' ? '다시 시작' : '복구 마감', value: <span className={mode === 'expired' ? 'text-blue-60' : 'text-red-55'}>{mode === 'expired' ? '오늘 정규장 완료 시 1일' : data.deadlineLabel}</span> },
  ];

  return (
    <dialog ref={dialogRef} aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); if (!isSubmitting) onClose(); }}
      className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-96 overflow-y-auto rounded-2xl border-0 bg-white p-5 backdrop:bg-black/30">
      <div className="flex flex-col items-center text-center">
        <img src={returnCat} alt="쉬고 있는 고양이" className="size-24 object-contain" />
        <p className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-white">{mode === 'expired' ? '오랜만이다 냥..' : '어제 쉬었다 냥..'}</p>
        <h2 id={titleId} className="mt-3 text-base font-bold">{mode === 'recovered' ? '연속 학습이 복구됐어요' : mode === 'pending' ? '연속 학습 복구 대기중이에요' : '연속 학습이 끊겼어요'}</h2>
        <p className="mt-2 text-xs leading-5 text-gray-60">
          {mode === 'recovered' ? '이전 하락 기록의 복구가 완료됐어요.'
            : mode === 'pending' ? '복구 신청이 완료됐어요. 기한 안에 정규장 학습을 완료해 주세요.'
            : mode === 'expired' ? <>복구 기한이 지나 이번에는 복구할 수 없어요.<br />오늘 정규장을 마치면 1일부터 다시 시작해요.</>
            : <>어제 학습을 쉬어서 주가가 {Math.abs(Number(dropRate.toFixed(1)))}% 떨어졌어요.<br />{needsShop ? `복구하려면 복구권이나 FISH ${data.ticketPrice}개가 필요해요.` : '오늘 안에 복구하면 모두 되돌릴 수 있어요.'}</>}
        </p>
      </div>
      <div className="mt-4"><StreakWeek days={data.days} /></div>
      {data.stageDrop && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-blue-15 p-3">
          <div className="flex shrink-0 items-center gap-1 text-center text-[10px] text-blue-60">
            <div><img src={data.stageDrop.beforeImage} alt="" className="size-10" />{data.stageDrop.beforeName}</div>
            <span>→</span>
            <div><img src={data.stageDrop.afterImage} alt="" className="size-10" />{data.stageDrop.afterName}</div>
          </div>
          <div className="text-[10px] leading-4 text-gray-60"><p className="font-semibold text-blue-60">진화 단계가 내려갔어요</p>{data.stageDrop.description}</div>
        </div>
      )}
      <dl className="mt-3 divide-y divide-gray-20 rounded-lg bg-gray-05 px-3">
        {rows.map((row) => <div key={row.label} className="flex justify-between gap-2 py-2 text-[11px]"><dt className="shrink-0 text-gray-60">{row.label}</dt><dd className="text-right font-medium">{row.value}</dd></div>)}
      </dl>
      <p className={`mt-3 rounded-lg border px-2 py-2 text-center text-[10px] leading-4 ${mode === 'expired' || needsShop ? 'border-yellow-45 text-red-55' : 'border-blue-60 text-blue-60'}`}>
        {mode === 'recovered' ? '오늘도 학습을 이어가 보세요.'
          : mode === 'pending' ? '기한 안에 정규장을 끝까지 풀어야 복구가 완료돼요.'
          : mode === 'expired' || needsShop ? '복구하지 않아도 오늘 정규장을 끝까지 풀면 1일부터 다시 시작해요.'
          : mode === 'pass' ? '오늘 정규장을 끝까지 풀어야 복구가 완료돼요.'
          : <>{mode === 'fish' && <>FISH {data.ticketPrice}개로 복구권을 교환해 바로 써요.<br /></>}복구권을 쓴 뒤 오늘 정규장을 끝까지 풀어야 복구가 완료돼요.</>}
      </p>
      {errorMessage && <p role="alert" className="mt-2 text-xs text-red-55">{errorMessage}</p>}
      <div className="mt-4 flex gap-3">
        <button type="button" onClick={onClose} disabled={isSubmitting} className="h-12 flex-1 cursor-pointer rounded-xl border border-gray-20 text-sm text-gray-40 disabled:cursor-not-allowed">{mode === 'expired' ? '닫기' : '다음에'}</button>
        <button type="button" onClick={action} disabled={isSubmitting} className="h-12 flex-1 cursor-pointer rounded-xl bg-blue-60 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? '처리 중...' : quizAction ? '퀴즈 풀러가기' : needsShop ? '상점가기' : '복구하기'}</button>
      </div>
    </dialog>
  );
};

export default StreakRecoveryModal;
