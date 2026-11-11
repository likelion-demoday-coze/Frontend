import type { CSSProperties } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import './StockLineChart.css';

export interface ChartPoint {
  label: string;
  value: number;
}

interface StockLineChartProps {
  data: ChartPoint[];
  startLabel: string;
  endLabel: string;
  guides: number[];
}

const LINE_COLOR = '#276AD8';
const GRID_COLOR = '#CCD1D5';
const CHART_HEIGHT = 260;
const BOTTOM_MARGIN = 8;
const X_AXIS_HEIGHT = 30;

const StockLineChart = ({
  data,
  startLabel,
  endLabel,
  guides,
}: StockLineChartProps) => {
  //마지막 점의 번호(점이 찍힘))
  const lastIndex = data.length - 1;

  //y축 범위를 정하기위해 가장 낮은 값과 높은 값을 구함
  //점선 가격도 같이 넣어야 점선이 그래프 밖으로 나가지 않음
  const values = data.map((d) => d.value);
  const min = Math.min(...values, ...guides);
  const max = Math.max(...values, ...guides);

  return (
    // ResponsiveContainer: 부모 폭에 맞춰 차트 크기를 자동으로 조절
    // (부모에 폭이 있어야 동작 -> 카드 내에 작성
    <ResponsiveContainer
      width="100%"
      height={CHART_HEIGHT}
      className="home-stock-chart"
      style={
        {
          '--stock-line-baseline': `${CHART_HEIGHT - BOTTOM_MARGIN - X_AXIS_HEIGHT}px`,
        } as CSSProperties
      }
    >
      <LineChart
        data={data}
        margin={{ top: 16, right: 12, bottom: BOTTOM_MARGIN, left: 24 }}
      >
        {/* 아래 x축: 모든 점의 라벨을 찍지 않고 맨 앞/맨 뒤 두 개만 보여줌 */}
        <XAxis
          height={X_AXIS_HEIGHT}
          dataKey="label" // x축 기준
          ticks={[data[0].label, data[lastIndex].label]} // 라벨을 찍을 위치: 첫 점, 마지막 점
          interval={0} // 라벨을 건너뛰지 않고 위 두 개를 전부 표시
          // 위 두 자리에 실제 라벨 대신 props로 받은 글씨를 넣음 (i가 0이면 왼쪽, 아니면 오른쪽)
          tickFormatter={(_, i) => (i === 0 ? startLabel : endLabel)}
          axisLine={{ stroke: GRID_COLOR }} // 축 선 색
          tickLine={false} // 눈금 작대기 숨김
          tick={{ fontSize: 12 }}
        />

        {/* 오른쪽 y축: 시안처럼 가격 숫자를 오른쪽에 표시 */}
        <YAxis
          orientation="right" // 기본은 왼쪽이라 오른쪽으로 옮김
          width="auto"
          tickMargin={8}
          padding={{ top: 8, bottom: 8 }}
          // 아래/위 여유를 위해 최솟값은 내림, 최댓값은 올림
          domain={[Math.floor(min), Math.ceil(max)]}
          // 숫자를 찍을 위치: 점선 가격들 + 가장 낮은 값 (Set으로 중복 제거)
          ticks={[...new Set([...guides, min])]}
          tickFormatter={(v: number) => v.toFixed(2)} // 소수 둘째 자리까지 (예: 100.00)
          axisLine={{ stroke: GRID_COLOR }}
          tickLine={false}
          tick={{ fontSize: 12 }}
        />

        {/* 가로 점선: guides에 들어 있는 가격마다 한 줄씩 */}
        {guides.map((g) => (
          <ReferenceLine
            key={g}
            y={g}
            stroke={GRID_COLOR}
            strokeDasharray="4 4"
          />
        ))}

        {/* 파란 꺾은선 */}
        <Line
          className="home-stock-line-rise"
          type="linear" // 점 사이를 직선으로 연결
          dataKey="value" // data의 어떤 값을 y축 높이로 쓸지
          stroke={LINE_COLOR}
          strokeWidth={2}
          isAnimationActive={false} // 선과 마지막 점은 CSS로 함께 아래에서 위로 표시
          // 점(dot)을 그리는 방법을 직접 정함: 마지막 점에만 동그라미를 찍음
          dot={({ cx, cy, index }) =>
            index === lastIndex ? (
              <g key="end">
                {/* 연한 파란 큰 원: 시안의 번짐(후광) 효과 */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={8}
                  fill={LINE_COLOR}
                  fillOpacity={0.2}
                />
                {/* 검은 작은 원: 현재 값 위치 */}
                <circle cx={cx} cy={cy} r={4} fill="#111" />
              </g>
            ) : (
              // 마지막이 아닌 점은 빈 그룹을 반환해서 아무것도 안 그림
              <g key={index} />
            )
          }
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default StockLineChart;
