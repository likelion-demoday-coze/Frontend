import passImage from '../../assets/store/Pass_Big.svg';
import { formatMonthDayTime, formatRemaining } from '../../utils/date';

interface PassCardProps {
  startedAt: string;
  expiresAt: string;
}

//패스 이용 중일 때 보이는 패스 카드
const PassCard = ({ startedAt, expiresAt }: PassCardProps) => {
  return (
    <section className="flex flex-col items-center gap-4 rounded-2xl border border-gray-20 bg-white px-5 py-5 lg:px-10">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-4 lg:gap-8">
          <img
            src={passImage}
            alt=""
            className="size-18 shrink-0 rounded-[20px] bg-blue-05 object-contain lg:size-25"
          />
          <div className="flex flex-col gap-3 lg:gap-5">
            <div className="flex items-center gap-3 lg:gap-6">
              <h2 className="text-lg leading-[1.3] font-semibold text-black">
                1주일 패스
              </h2>
              <span className="rounded-[20px] bg-blue-50 px-2 py-1 text-xs leading-5.5 font-bold text-blue-05">
                이용 중
              </span>
            </div>
            <dl className="flex flex-col gap-2 text-sm text-gray-40">
              <div className="flex gap-3">
                <dt className="font-semibold">시작</dt>
                <dd className="font-medium">{formatMonthDayTime(startedAt)}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="font-semibold">만료</dt>
                <dd className="font-medium">{formatMonthDayTime(expiresAt)}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-2.5">
          <span className="text-sm font-medium text-gray-40">
            남은 이용 시간
          </span>
          <strong className="text-lg leading-[1.3] font-semibold text-blue-60">
            {formatRemaining(expiresAt)}
          </strong>
        </div>
      </div>
      <p className="rounded-[20px] border border-gray-20 px-4 py-2 text-center text-sm leading-5.5 font-medium break-keep text-gray-80">
        주가 상승 기회 <b className="font-semibold text-blue-60">하루 15문제</b>{' '}
        · 입장시 <b className="font-semibold text-blue-60">FISH 차감 없음</b> ·
        연속 학습 중단시 <b className="font-semibold text-blue-60">무료 복구</b>
      </p>
    </section>
  );
};

export default PassCard;
