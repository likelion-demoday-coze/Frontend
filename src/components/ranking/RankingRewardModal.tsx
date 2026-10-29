import { useEffect, useId, useRef, useState } from 'react';
import { getFishBalance } from '../../api/fish';
import type { RankingType } from '../../types/ranking';
import { formatRankingRewardDate } from '../../utils/date';
import firstRank from '../../assets/ranking/1st_rank.svg';
import secondRank from '../../assets/ranking/2nd_rank.svg';
import thirdRank from '../../assets/ranking/3rd_rank.svg';

interface RankingRewardModalProps {
  type: RankingType;
  rank: 1 | 2 | 3;
  grantedAmount: number;
  score: number;
  balanceBefore?: number;
  balanceAfter?: number;
  rankingDate?: string;
  isAcknowledging?: boolean;
  errorMessage?: string;
  onClose: () => void;
  onViewRanking: () => void;
}

const RANK_IMAGES = { 1: firstRank, 2: secondRank, 3: thirdRank };

const RankingRewardModal = ({
  type,
  rank,
  grantedAmount,
  score,
  balanceBefore,
  balanceAfter,
  rankingDate,
  isAcknowledging = false,
  errorMessage,
  onClose,
  onViewRanking,
}: RankingRewardModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [balance, setBalance] = useState<number | null>(null);
  const isRegular = type === 'regular';
  const rankingName = isRegular ? '정규장' : '시간외거래';
  const dateLabel = formatRankingRewardDate(rankingDate);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    let ignore = false;
    if (balanceBefore === undefined || balanceAfter === undefined)
      getFishBalance()
        .then((result) => {
          if (!ignore) setBalance(result);
        })
        .catch(() => {});
    return () => {
      ignore = true;
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [balanceBefore, balanceAfter]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!isAcknowledging) onClose();
      }}
      className="m-auto w-[calc(100%-32px)] max-h-[calc(100dvh-32px)] overflow-y-auto max-w-103 rounded-[20px] border-0 bg-white p-6 backdrop:bg-black/30"
    >
      <div className="relative flex flex-col items-center text-center">
        <span className="self-start rounded-lg border border-blue-60 px-3 py-2 text-sm font-bold text-blue-60">
          {dateLabel} 랭킹 보상
        </span>
        <img
          src={RANK_IMAGES[rank]}
          alt={`${rank}위`}
          className="mt-1 size-28 object-contain"
        />
        <p className="mt-2 rounded-full bg-blue-50 px-3 py-1.5 text-16px font-semibold text-white">
          {isRegular ? `${rank}등이다 냥!` : '손이 빠르다 냥!'}
        </p>
        <h2
          id={titleId}
          className="mt-5 text-lg font-bold break-keep text-black"
        >
          {dateLabel} {rankingName} 랭킹 {rank}위를 했어요
        </h2>
        <p className="mt-2 text-sm text-gray-60">
          {isRegular
            ? '꾸준한 정규장 학습 덕분이에요.'
            : `1분 동안 ${score}문제를 맞혔어요.`}
          <br />
          보상으로 생선 {grantedAmount}개를 드렸어요.
        </p>
        <dl className="mt-5 w-full divide-y divide-gray-20 rounded-lg bg-gray-05 px-4 text-sm">
          <div className="flex items-center justify-between gap-2 py-3">
            <dt className="flex items-center gap-1 text-gray-60">
              <img
                src={RANK_IMAGES[rank]}
                alt=""
                className="size-5 object-contain"
              />
              {isRegular ? '주가' : '시간외거래'} 랭킹 {rank}위
            </dt>
            <dd className="font-semibold text-blue-60">
              +{grantedAmount.toLocaleString()}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2 py-3">
            <dt className="text-gray-60">FISH</dt>
            <dd className="font-semibold text-blue-60">
              {balanceBefore !== undefined && balanceAfter !== undefined ? (
                <>
                  <span className="text-gray-60">
                    {balanceBefore.toLocaleString()} →{' '}
                  </span>
                  {balanceAfter.toLocaleString()}
                </>
              ) : balance !== null ? (
                <>
                  <span className="text-gray-60">
                    {balance.toLocaleString()} →{' '}
                  </span>
                  {(balance + grantedAmount).toLocaleString()}
                </>
              ) : (
                '-'
              )}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2 py-3">
            <dt className="text-gray-60">
              {isRegular ? '최종 주가' : '최고 기록'}
            </dt>
            <dd className="font-semibold text-blue-60">
              {isRegular
                ? score.toLocaleString('ko-KR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : `${score}문제 정답`}
            </dd>
          </div>
        </dl>
        {errorMessage && (
          <p role="alert" className="mt-3 text-sm text-red-55">
            {errorMessage}
          </p>
        )}
        <div className="mt-5 flex w-full gap-4 px-5">
          <button
            type="button"
            onClick={onViewRanking}
            disabled={isAcknowledging}
            className="h-14 flex-1 cursor-pointer rounded-xl border border-gray-10 bg-white font-semibold text-gray-40 disabled:cursor-wait disabled:opacity-60"
          >
            랭킹 보기
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isAcknowledging}
            className="h-14 flex-1 cursor-pointer rounded-xl bg-blue-60 font-semibold text-white disabled:cursor-wait disabled:opacity-60"
          >
            {isAcknowledging ? '확인 중…' : '확인'}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default RankingRewardModal;
