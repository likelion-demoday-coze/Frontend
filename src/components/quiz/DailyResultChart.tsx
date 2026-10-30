import CorrectIcon from '../../assets/quiz/correct.svg?react';

interface DailyResultChartProps {
  startStock: number;
  points: { stock: number; percent: number; correct: boolean }[];
  correctCount: number;
}

const TICK_COUNT = 4;

//정규장 마감 화면의 문제별 주가 그래프
const DailyResultChart = ({
  startStock,
  points,
  correctCount,
}: DailyResultChartProps) => {
  const values = [startStock, ...points.map((point) => point.stock)];
  const low = Math.floor(Math.min(...values));
  const high = Math.max(Math.ceil(Math.max(...values) * 1.02), low + 10);
  const ticks = Array.from({ length: TICK_COUNT }, (_, i) =>
    Math.round(high - ((high - low) / (TICK_COUNT - 1)) * i)
  );
  const toX = (index: number) => (index / points.length) * 100;
  const toY = (value: number) => ((high - value) / (high - low)) * 100;

  const coords = values.map((value, index) => ({
    x: toX(index),
    y: toY(value),
  }));
  const line = coords.map(({ x, y }) => `${x},${y}`).join(' ');
  const total = points.length;

  return (
    <div className="flex w-full gap-3 lg:gap-5">
      <ul className="flex shrink-0 flex-col justify-between py-1 text-right text-xs font-medium text-gray-60">
        {ticks.map((tick) => (
          <li key={tick}>{tick}</li>
        ))}
      </ul>

      <div className="relative h-44 flex-1 lg:h-52">
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full overflow-visible"
        >
          {ticks.map((tick) => (
            <line
              key={tick}
              x1={0}
              x2={100}
              y1={toY(tick)}
              y2={toY(tick)}
              className="stroke-gray-10"
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <polygon points={`0,100 ${line} 100,100`} className="fill-blue-05" />
          <polyline
            points={line}
            fill="none"
            className="stroke-blue-60"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {coords.map(({ x, y }, index) => {
          const point = points[index - 1];
          const isWrong = point && !point.correct;
          return (
            <span
              key={index}
              style={{ left: `${x}%`, top: `${y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${isWrong ? 'size-2.5 border-2 border-blue-60 bg-white' : 'size-2 bg-blue-60'}`}
            />
          );
        })}

        {points.map((point, index) => {
          const { x, y } = coords[index + 1];
          return (
            <span
              key={index}
              style={{ left: `${x}%`, top: `${y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-[calc(100%+10px)] whitespace-nowrap ${
                point.correct
                  ? 'rounded-xl bg-blue-60 px-2 py-1 text-xs font-bold text-white lg:px-3 lg:py-2 lg:text-sm'
                  : 'text-sm font-bold text-gray-60 lg:text-base'
              }`}
            >
              {point.correct ? `▲ ${point.percent.toFixed(1)}%` : '방어'}
            </span>
          );
        })}

        <span className="absolute top-0 left-2 hidden h-9 items-center gap-2 lg:flex rounded-lg border border-blue-60 bg-blue-05 px-3 text-base font-medium text-blue-60 lg:h-11 lg:text-xl">
          <CorrectIcon aria-hidden="true" className="size-4 text-green-65" />
          {correctCount}/{total}
          <span className="sr-only">문제 정답</span>
        </span>
      </div>
    </div>
  );
};

export default DailyResultChart;
