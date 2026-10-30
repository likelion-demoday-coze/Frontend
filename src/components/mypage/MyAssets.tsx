import { Link } from 'react-router-dom';
import ArrowIcon from '../../assets/icons/arrow.svg?react';
import bellIcon from '../../assets/icons/big_bell.svg';
import fishImage from '../../assets/store/Fish_a.svg';
import ticketImage from '../../assets/store/Recover_Ticket_Orange.svg';
import { ROUTES } from '../../constants/routes';
import type { MyPage } from '../../types/member';

interface MyAssetsProps {
  assets: MyPage['assets'];
  isPass: boolean;
}

const linkStyle =
  'flex items-center gap-1 text-xs leading-4.5 font-semibold whitespace-nowrap text-blue-60 sm:text-sm';

//마이페이지 내 자산 (보유 FISH, 복구권, 현재 주가)
const MyAssets = ({ assets, isPass }: MyAssetsProps) => {
  const items = [
    {
      label: '보유 FISH',
      image: fishImage,
      value: assets.fishBalance.toLocaleString(),
      unit: '개',
      footer: null,
    },
    {
      label: '연속 학습 복구권',
      image: ticketImage,
      value: assets.recoveryTicketCount.toLocaleString(),
      unit: '개',
      footer: isPass ? (
        <span className={linkStyle}>패스 이용중 · 무료 복구</span>
      ) : (
        <Link to={ROUTES.SHOP} className={linkStyle}>
          상점 가기
          <ArrowIcon aria-hidden="true" className="h-4 w-2" />
        </Link>
      ),
    },
    {
      label: '현재 주가',
      image: bellIcon,
      value: assets.currentStock.toFixed(2),
      unit: '',
      footer: (
        <Link to={ROUTES.QUIZ} className={linkStyle}>
          주가 올리러 가기
          <ArrowIcon aria-hidden="true" className="h-4 w-2" />
        </Link>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-black">내 자산</h2>
      <ul className="-mx-6 flex gap-2 overflow-x-auto px-6 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:px-0 lg:gap-6">
        {items.map(({ label, image, value, unit, footer }) => (
          <li
            key={label}
            className="flex w-48 shrink-0 flex-col items-end gap-4 rounded-[20px] border border-gray-20 bg-white p-4 sm:w-auto lg:h-35"
          >
            <div className="flex w-full items-center justify-between gap-2">
              <span className="flex h-15 w-18 shrink-0 items-center justify-center rounded-[20px] bg-blue-05">
                <img src={image} alt="" className="size-15 object-contain" />
              </span>
              <div className="flex flex-col items-end gap-3">
                <span className="text-xs font-semibold whitespace-nowrap text-gray-60 sm:text-sm">
                  {label}
                </span>
                <span className="flex items-end gap-1">
                  <strong className="text-xl leading-3.5 font-medium text-blue-60 sm:text-2xl">
                    {value}
                  </strong>
                  {unit && (
                    <span className="text-sm leading-3.5 font-medium text-gray-60">
                      {unit}
                    </span>
                  )}
                </span>
              </div>
            </div>
            {footer}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MyAssets;
