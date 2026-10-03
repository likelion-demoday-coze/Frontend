import { useState } from 'react';
import StockLineChart from './StockLineChart';
import type { StockHistory, StockPeriod } from '../../../types/stock';

const PERIODS = [
  { key: 'DAY', label: '1일' },
  { key: 'WEEK', label: '1주' },
  { key: 'ALL', label: '전체 기간' },
] as const;
// 서버가 준 시각(ISO 문자열)을 화면에 보일 글씨로 바꾸는 함수
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
      <div className="flex flex-col gap-4 px-5 py-5 xl:flex-row xl:items-center xl:justify-between xl:px-10.5 xl:py-6.5">
        <div className="flex flex-wrap items-center gap-3 xl:gap-7.5">
          <span className="text-[16px] font-bold text-gray-60">현재 주가</span>
          <span className="text-[28px] font-bold text-blue-60">
            {history ? history.currentStock.toFixed(2) : '-'}
          </span>
          {history && (
            <span
              className={`text-[16px] font-bold ${isUp ? 'text-blue-60' : 'text-red-55'}`}
            >
              {isUp ? '▲' : '▼'} {Math.abs(rate).toFixed(2)}%
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {PERIODS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`flex items-center rounded-full border px-4 py-2 ${
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
