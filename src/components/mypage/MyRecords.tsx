import type { MyPage } from '../../types/member';

interface MyRecordsProps {
  records: MyPage['records'];
}

//마이페이지 내 기록 (기록이 없으면 회색 값과 시작 안내)
const MyRecords = ({ records }: MyRecordsProps) => {
  const hasAnswered = records.totalAnsweredCount > 0;
  const tiles = [
    {
      label: '최고 연속 학습',
      value: String(records.highestStreak),
      unit: '일',
      isEmpty: records.highestStreak === 0,
      note: `현재 ${records.currentStreak}일`,
      emptyNote: '정규장을 풀면 시작돼요',
    },
    {
      label: '최고 주가',
      value: records.highestStock.toFixed(2),
      unit: '',
      isEmpty: !hasAnswered,
      note: '방울',
      emptyNote: '방울',
    },
    {
      label: '시간외거래 최고',
      value:
        records.highestTimeAttackCorrectCount > 0
          ? String(records.highestTimeAttackCorrectCount)
          : '-',
      unit: records.highestTimeAttackCorrectCount > 0 ? '문제' : '',
      isEmpty: records.highestTimeAttackCorrectCount === 0,
      note: '1분 기록',
      emptyNote: '아직 도전 기록이 없어요',
    },
    {
      label: '누적 풀이',
      value: String(records.totalAnsweredCount),
      unit: '문제',
      isEmpty: !hasAnswered,
      note: `정답률 ${Math.round(records.accuracyPercent)}%`,
      emptyNote: '첫 문제를 풀어 보세요',
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-black">내 기록</h2>
      <ul className="grid grid-cols-2 gap-3 lg:flex lg:justify-between">
        {tiles.map(({ label, value, unit, isEmpty, note, emptyNote }) => (
          <li
            key={label}
            className="flex flex-col gap-3 rounded-[14px] bg-gray-05 p-4.5 lg:w-40"
          >
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-60">
                {label}
              </span>
              <span className="flex items-end gap-1">
                <strong
                  className={`text-2xl leading-3.5 font-medium ${isEmpty ? 'text-gray-40' : 'text-blue-60'}`}
                >
                  {value}
                </strong>
                {unit && (
                  <span className="text-sm leading-3.5 font-medium text-gray-60">
                    {unit}
                  </span>
                )}
              </span>
            </div>
            <span
              className={`text-xs leading-[1.3] font-medium ${isEmpty && emptyNote !== note ? 'text-blue-60' : 'text-gray-40'}`}
            >
              {isEmpty ? emptyNote : note}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MyRecords;
