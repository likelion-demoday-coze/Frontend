import { Link } from 'react-router-dom';
import PageTitleSection from '../components/common/PageTitle';
import PassProductCard from '../components/shop/PassProductCard';
import RecoveryProductCard from '../components/shop/RecoveryProductCard';
import { ROUTES } from '../constants/routes';

const ShopPage = () => (
  <div className="mx-auto w-full max-w-260">
    <PageTitleSection
      title="상점"
      description="1주일 패스로 더 자유롭게 풀어보세요. 결제하면 바로 시작돼요."
    />

    <section className="mt-12" aria-labelledby="cash-products">
      <h2 id="cash-products" className="mb-4 text-xl font-semibold">
        현금 결제
      </h2>
      <PassProductCard />
    </section>

    <section className="mt-9" aria-labelledby="fish-products">
      <h2 id="fish-products" className="mb-4 text-xl font-semibold">
        생선으로 교환
      </h2>
      <RecoveryProductCard />
    </section>

    <footer className="mt-14 text-xs leading-6 text-gray-40">
      <ul className="rounded-xl bg-gray-05 px-5 py-3">
        <li>
          · 결제대행: 페이앱(주식회사 유디아이디) · 결제 수단: 신용·체크카드,
          휴대폰
        </li>
        <li>
          · 결제 즉시 이용이 시작되며, 미사용 패스는 환불 정책에 따라
          환불됩니다.
        </li>
        <li>
          · 본 서비스는 경진대회 출품작으로 베타 운영되며, 운영 종료 후 데이터가
          소멸될 수 있습니다.
        </li>
      </ul>
      <div className="mt-6 px-4">
        <p>운영 COZ:E(팀 홍대프)</p>
        <Link
          to={ROUTES.MYPAGE_POLICY}
          className="mt-1 inline-block text-gray-60 underline underline-offset-2"
        >
          이용약관 · 개인정보처리방침 · 환불 정책
        </Link>
      </div>
    </footer>
  </div>
);

export default ShopPage;
