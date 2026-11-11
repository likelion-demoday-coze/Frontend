import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RankRow from '../../../components/ranking/rank/RankRow';
import { getTimeAttackRanking } from '../../../api/ranking';
import { ROUTES, toRanking } from '../../../constants/routes';
import useAuthstore from '../../../stores/useAuthStore';
import type { TimeAttackRankingEntry } from '../../../types/ranking';

const PAGE_SIZE = 20;
const MAX_PAGES = 5;
const AROUND = 2;

interface RankingWindow {
  rows: TimeAttackRankingEntry[];
  hasMine: boolean;
}

//내 순위가 들어 있는 페이지를 찾아서 내 주변 5명을 잘라냄
const loadRankingWindow = async (
  memberId: number | undefined
): Promise<RankingWindow> => {
  const first = await getTimeAttackRanking(0, PAGE_SIZE);
  const my = first.myRanking;
  if (!my || memberId === undefined) {
    return { rows: first.rankings.slice(0, AROUND * 2 + 1), hasMine: false };
  }

  const startPage = Math.max(
    0,
    Math.floor((my.rankingPosition - 1 - AROUND) / PAGE_SIZE)
  );
  const entries: TimeAttackRankingEntry[] = [];
  let page = startPage;
  let response = startPage === 0 ? first : null;
  for (let count = 0; count < MAX_PAGES; count += 1) {
    response ??= await getTimeAttackRanking(page, PAGE_SIZE);
    entries.push(...response.rankings);
    const myIndex = entries.findIndex((entry) => entry.memberId === memberId);
    if (
      !response.page.hasNext ||
      (myIndex >= 0 && entries.length - myIndex > AROUND * 2)
    )
      break;
    page += 1;
    response = null;
  }

  const myIndex = entries.findIndex((entry) => entry.memberId === memberId);
  if (myIndex < 0) {
    return { rows: first.rankings.slice(0, AROUND * 2 + 1), hasMine: false };
  }
  //1~2위나 꼴찌 근처여도 항상 5명이 보이도록 반대쪽으로 채움
  const visible = AROUND * 2 + 1;
  const from = Math.max(
    0,
    Math.min(myIndex - AROUND, entries.length - visible)
  );
  return { rows: entries.slice(from, from + visible), hasMine: true };
};

//시간외거래 총정리 다음에 보여주는 현재 랭킹 확인 화면
const TimeAttackRankingPage = () => {
  const navigate = useNavigate();
  const memberId = useAuthstore((state) => state.member?.memberId);
  const [ranking, setRanking] = useState<RankingWindow | null>(null);
  const [isError, setIsError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    loadRankingWindow(memberId)
      .then((result) => {
        if (!ignore) setRanking(result);
      })
      .catch((error) => {
        console.error('시간외거래 랭킹 조회 실패', error);
        if (!ignore) setIsError(true);
      });
    return () => {
      ignore = true;
    };
  }, [memberId, reloadKey]);

  const retry = () => {
    setIsError(false);
    setRanking(null);
    setReloadKey((prev) => prev + 1);
  };

  const renderList = () => {
    if (isError) {
      return (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-base text-gray-60">
            랭킹을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
          </p>
          <button
            type="button"
            onClick={retry}
            className="cursor-pointer rounded-full border border-blue-60 px-4 py-1.5 text-sm font-semibold text-blue-60"
          >
            다시 시도
          </button>
        </div>
      );
    }
    if (!ranking) {
      return (
        <p className="py-10 text-center text-base text-gray-60">
          불러오는 중...
        </p>
      );
    }
    if (ranking.rows.length === 0) {
      return (
        <p className="py-10 text-center text-base text-gray-60">
          아직 오늘의 시간외거래 기록이 없어요.
        </p>
      );
    }
    return (
      <>
        <ul className="flex flex-col">
          {ranking.rows.map((row) => (
            <RankRow
              key={row.memberId}
              rank={row.rankingPosition}
              nickname={row.nickname}
              score={row.correctCount}
              isMe={ranking.hasMine && row.memberId === memberId}
            />
          ))}
        </ul>
        {!ranking.hasMine && (
          <p className="mt-4 text-center text-sm text-gray-40">
            내 기록이 랭킹에 반영되는 중이에요. 잠시 후 랭킹 페이지에서 확인해
            주세요.
          </p>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-1 flex-col items-center gap-10 bg-white px-4 py-8 lg:gap-16 lg:py-10">
      <div className="flex w-full max-w-240 flex-col gap-10 lg:gap-16">
        <div className="flex flex-col gap-1 lg:gap-2">
          <h1 className="text-xl font-semibold lg:text-[28px]">
            현재 랭킹을 확인해보세요.
          </h1>
          <p className="text-sm text-gray-60 lg:text-lg">
            조금만 더 분발하면 순위를 뒤집을 수 있어요!
          </p>
        </div>
        <div className="mx-auto w-full max-w-121.5">{renderList()}</div>
      </div>

      {/*TODO: 공통 Button 컴포넌트가 생기면 교체*/}
      <div className="mt-auto flex w-full gap-3 lg:mt-0 lg:w-auto lg:gap-12">
        <button
          type="button"
          onClick={() => navigate(toRanking('afterhours'))}
          className="h-14 flex-1 cursor-pointer rounded-xl border border-gray-10 bg-white text-lg font-semibold text-gray-40 lg:h-16 lg:w-42 lg:flex-none"
        >
          랭킹보기
        </button>
        <button
          type="button"
          onClick={() => navigate(ROUTES.HOME)}
          className="h-14 flex-1 cursor-pointer rounded-xl bg-blue-60 text-lg font-semibold text-white lg:h-16 lg:w-42 lg:flex-none"
        >
          홈으로
        </button>
      </div>
    </div>
  );
};

export default TimeAttackRankingPage;
