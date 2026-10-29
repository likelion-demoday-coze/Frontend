import { useEffect, useState } from 'react';
import StockLineChart from './StockLineChart';
import { getStockGraph } from '../../../api/stock';
import type { StockHistory, StockPeriod } from '../../../types/stock';
import bell from '../../../assets/icons/big_bell.svg';

const PERIODS = [
  { key: 'DAY', label: '1일' },
  { key: 'WEEK', label: '1주' },
  { key: 'ALL', label: '전체 기간' },
] as const;

const formatLabel = (iso: string, period: StockPeriod) => {
  const d = new Date(iso);
  return period === 'DAY'
    ? d.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : d
        .toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })
        .replace(/\s/g, ''); // 'ko-KR' 형식에 들어가는 공백 제거
};

const StockChartCard = () => {
  const [period, setPeriod] = useState<StockPeriod>('WEEK'); //기본값은 1주
  //받아온 데이터
  const [history, setHistory] = useState<StockHistory | null>(null);
  //화면상태(불러오는 중/실패/성공)
  const [status, setStatus] = useState<'loading' | 'error' | 'done'>('loading');

  useEffect(() => {
    let ignore = false; //탭을 너무 빠르게 바꿨을 때 늦게 온 옛 응답 무시

    getStockGraph(period)
      .then((res) => {
        if (ignore) return;
        setHistory(res);
        setStatus('done');
      })
      .catch(() => {
        if (!ignore) setStatus('error');
      });
    return () => {
      ignore = true;
    };
  }, [period]);

  const handlePeriodChange = (nextPeriod: StockPeriod) => {
    if (nextPeriod === period) return;

    setStatus('loading');
    setPeriod(nextPeriod);
  };

  //증감율 계산
  const rate = history?.changeRate ?? 0;
  const isUp = rate >= 0; // boolean

  //차트에 보내줄 points를 컴포넌트의 타입 형식에 맞기 전송
  const chartData =
    history?.points.map((p) => ({
      label: p.timestamp,
      value: p.stockValue,
    })) ?? [];

  //점이 2개 이상일 때만 그릴수 있음을 안내
  const canDraw = status === 'done' && chartData.length >= 2;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-blue-15 bg-white p-3">
      <div className="@container flex flex-wrap items-center justify-between gap-3 px-1 py-4 sm:px-3 sm:py-5 xl:px-6 xl:py-6">
        <div className="flex max-w-full flex-nowrap items-center gap-[min(10px,1.5cqi)] whitespace-nowrap">
          <span className="shrink-0 text-[min(16px,4.5cqi)] font-semibold text-gray-60">
            현재 주가
          </span>
          <span className="shrink-0 text-[min(28px,8cqi)] font-bold tabular-nums text-blue-50">
            {history ? history.currentStock.toFixed(2) : '-'}
          </span>
          <img src={bell} alt="" className="size-[min(44px,12cqi)] shrink-0" />
          {history && (
            <span
              className={`shrink-0 text-[min(16px,4.5cqi)] font-bold tabular-nums ${isUp ? 'text-red-55' : 'text-blue-50'}`}
            >
              {isUp ? '▲' : '▼'} {Math.abs(rate).toFixed(2)}%
            </span>
          )}
        </div>

        <div className="flex max-w-full shrink-0 flex-wrap gap-1.5">
          {PERIODS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              aria-pressed={period === key}
              onClick={() => handlePeriodChange(key)}
              className={`flex shrink-0 items-center whitespace-nowrap rounded-full border px-3.5 py-2 ${
                period === key
                  ? 'border-blue-60 font-bold text-blue-60'
                  : 'border-gray-20 text-gray-60'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-65 flex-1 px-2 pb-2">
        {status === 'loading' && (
          <p className="flex h-full items-center justify-center text-sm text-gray-60">
            불러오는 중...
          </p>
        )}
        {status === 'error' && (
          <p className="flex h-full items-center justify-center text-sm text-gray-60">
            주가 정보를 불러오지 못했어요.
          </p>
        )}
        {status === 'done' && !canDraw && (
          <p className="flex h-full items-center justify-center text-sm text-gray-60">
            아직 그래프를 그릴 데이터가 부족해요.
          </p>
        )}
        {canDraw && history && (
          <StockLineChart
            data={chartData}
            startLabel={formatLabel(history.from, period)}
            endLabel="현재"
            guides={[history.currentStock, history.startStock]}
          />
        )}
      </div>
    </div>
  );
};

export default StockChartCard;
