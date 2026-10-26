import { Check } from 'lucide-react';
import passImage from '../../assets/store/Pass_Big.svg';

const BENEFITS = [
  '정규장 문제 풀이 FISH 차감 없이 무제한',
  '연속 학습 복구 무료',
  '정규장 주가 반영 횟수 업그레이드(2회→3회)',
];

const PassProductCard = () => (
  <article className="flex flex-col gap-8 rounded-3xl border border-gray-20 bg-white p-6 sm:flex-row sm:items-center lg:gap-12 lg:p-9">
    <div className="flex size-44 shrink-0 items-center justify-center self-center rounded-3xl bg-blue-05 lg:size-48">
      <img src={passImage} alt="파란색 1주일 패스" className="size-full object-contain p-2" />
    </div>
    <div className="min-w-0 flex-1">
      <h3 className="text-xl font-bold text-black">1주일 패스</h3>
      <p className="mt-2 text-sm text-gray-60">7일 동안 마음껏 풀고, 더 빨리 성장해요</p>
      <ul className="mt-5 space-y-2 text-xs text-gray-60">
        {BENEFITS.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2">
            <Check aria-hidden="true" className="size-4 shrink-0 text-green-65" />
            {benefit}
          </li>
        ))}
      </ul>
      <p className="mt-2 pl-6 text-xs text-red-55">• 타임어택 횟수는 증가하지 않습니다.</p>
    </div>
    <div className="shrink-0 self-end sm:self-center">
      <button type="button" disabled title="구매 준비 중" className="h-16 w-36 cursor-not-allowed rounded-xl border border-blue-60 bg-white text-xl font-bold text-blue-60">
        ₩ 1,900
      </button>
      <p className="mt-2 text-center text-xs text-gray-60">구매 준비 중</p>
    </div>
  </article>
);

export default PassProductCard;
