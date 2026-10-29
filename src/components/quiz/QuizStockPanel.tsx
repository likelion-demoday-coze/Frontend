import bellIcon from '../../assets/icons/big_bell.svg';

interface QuizStockPanelProps {
  points: number[];
  slots?: number;
  lastChange?: number | null;
  muted?: boolean;
  notice?: string;
  label?: string;
}

const BASE_RATIO = 0.15;

//문제풀이 주가 상태창 (시작가부터 문제마다 점을 찍고, 마지막 문제의 등락을 표시)
//muted: 주가에 반영되지 않는 풀이 (시간외거래, 학습만 하기)
const QuizStockPanel = ({
  points,
  slots = 6,
  lastChange = null,
  muted = false,
  notice,
  label = '현재 주가',
}: QuizStockPanelProps) => {
  const base = points[0];
  const current = points[points.length - 1];
  const top = Math.max(base * 1.25, Math.max(...points) * 1.05);
  const toX = (index: number) => (index / (slots - 1)) * 100;
  const toY = (value: number) =>
    100 -
    (BASE_RATIO + ((value - base) / (top - base)) * (1 - BASE_RATIO)) * 100;

  const coords = points.map((value, index) => ({
    x: toX(index),
    y: toY(value),
  }));
  const line = coords.map(({ x, y }) => `${x},${y}`).join(' ');
  const last = coords[coords.length - 1];
  const isUp = lastChange !== null && lastChange > 0;

  return (
    <div className="flex w-full flex-col items-center gap-3 rounded-[20px] border border-blue-15 bg-white px-6 pt-3 pb-2 lg:w-86.5">
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-7">
          <span className="text-base font-bold text-gray-50">{label}</span>
          <span className="flex items-end gap-1">
            <strong
              className={`text-[32px] leading-none font-bold ${muted ? 'text-gray-40' : 'text-blue-60'}`}
            >
              {current.toFixed(2)}
            </strong>
            <img src={bellIcon} alt="" className="size-10" />
          </span>
        </div>
        {muted ? (
          <p className="rounded-sm bg-gray-05 px-2 py-1 text-sm font-semibold text-gray-60">
            주가 반영 안 됨
          </p>
        ) : lastChange === null ? (
          <p className="flex h-6.25 items-center text-xs leading-4.5 font-medium text-gray-40">
            문제를 맞히면 주가가 올라요
          </p>
        ) : (
          <p
            className={`flex items-end gap-2 rounded-sm px-2 py-1 text-sm ${isUp ? 'bg-red-05' : 'bg-gray-05'}`}
          >
            <span className="font-medium text-gray-60">이번문제</span>
            <span
              className={`font-semibold ${isUp ? 'text-red-55' : 'text-gray-60'}`}
            >
              {isUp ? `▲ ${lastChange}%` : '방어 · 변동 없음'}
            </span>
          </p>
        )}
      </div>

      {notice && (
        <p className="w-full rounded-lg border border-blue-60 px-3 py-2 text-center text-xs leading-4.5 font-semibold text-gray-60">
          {notice}
        </p>
      )}

      <div className="relative h-21 w-full">
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full overflow-visible"
        >
          {Array.from({ length: slots }, (_, index) => (
            <line
              key={index}
              x1={toX(index)}
              x2={toX(index)}
              y1={0}
              y2={100}
              className="stroke-gray-10"
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <line
            x1={0}
            x2={100}
            y1={toY(base)}
            y2={toY(base)}
            className="stroke-gray-10"
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
          {coords.length > 1 && (
            <>
              {!muted && (
                <polygon
                  points={`0,${toY(base)} ${line} ${last.x},${toY(base)}`}
                  className="fill-blue-05"
                />
              )}
              <polyline
                points={line}
                fill="none"
                className={muted ? 'stroke-gray-30' : 'stroke-blue-60'}
                strokeWidth={2}
                strokeDasharray={muted ? '4 4' : undefined}
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}
        </svg>

        {coords.map(({ x, y }, index) => {
          const isLast = index === coords.length - 1 && index > 0;
          return (
            <span
              key={index}
              style={{ left: `${x}%`, top: `${y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${
                muted
                  ? isLast
                    ? 'size-2.5 bg-gray-40'
                    : 'size-1.5 bg-gray-40'
                  : index === 0
                    ? 'size-2.5 bg-blue-60'
                    : !isLast
                      ? 'size-1.5 bg-blue-60'
                      : isUp
                        ? 'size-2 bg-red-55 shadow-[0_0_0_4px_var(--color-red-05)]'
                        : 'size-3 border-2 border-blue-60 bg-white'
              }`}
            />
          );
        })}

        {!muted && coords.length > 1 && lastChange !== null && (
          <span
            style={{ left: `${last.x}%`, top: `${last.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-[calc(100%+8px)] text-xs font-semibold whitespace-nowrap ${isUp ? 'text-red-55' : 'text-gray-60'}`}
          >
            {isUp ? `+ ${lastChange}%` : '방어'}
          </span>
        )}
      </div>
      <span className="self-end text-xs leading-4.5 font-medium text-gray-40">
        시작가
      </span>
    </div>
  );
};

export default QuizStockPanel;
