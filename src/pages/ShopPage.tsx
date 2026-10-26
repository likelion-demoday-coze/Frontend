import { useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { getOwnedItems, getStoreItems, purchaseItem } from '../api/store';
import type { Storeitems } from '../types/store';
import { Link } from 'react-router-dom';
import PageTitleSection from '../components/common/PageTitle';
import PassProductCard from '../components/shop/PassProductCard';
import RecoveryProductCard from '../components/shop/RecoveryProductCard';
import { getAttendanceToday } from '../api/attendance';
import { ROUTES } from '../constants/routes';

// 판매 일정 API 연결 전 사용할 목데이터 (한국 시간)
const MOCK_PASS_SCHEDULE = {
  saleEndsAt: '2026-11-03T23:59:59.999+09:00',
  serviceEndsAt: '2026-11-06T00:00:00+09:00',
};

const ShopPage = () => {
  const [recoveryItem, setRecoveryItem] = useState<Storeitems>();
  const [ownedCount, setOwnedCount] = useState<number>();
  const [isLoadingOwnedItems, setIsLoadingOwnedItems] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [passStatus, setPassStatus] = useState<
    'loading' | 'active' | 'inactive' | 'error'
  >('loading');
  // 상태가 화면에 반영되기 전에도 연속 클릭으로 인한 중복 요청을 막음
  const purchaseLock = useRef(false);

  useEffect(() => {
    let active = true;

    getAttendanceToday()
      .then((result) => {
        if (active)
          setPassStatus(
            result.status === 'PASS_ACTIVE' ? 'active' : 'inactive'
          );
      })
      .catch(() => {
        if (active) setPassStatus('error');
      });

    // 상품명에서 공백을 제거해 복구권을 찾고, 서버의 itemId와 가격을 저장
    getStoreItems()
      .then((items) => {
        console.log('상점 상품 조회 결과:', items);
        if (active) {
          setRecoveryItem(
            items.find(
              (item) => item.name.replace(/\s/g, '') === '연속학습복구권'
            )
          );
        }
      })
      .catch(() => {
        if (active) alert('상점 아이템을 불러오지 못했습니다.');
      });

    // 보유 아이템 목록에 복구권이 없으면 0개로 표시
    getOwnedItems()
      .then((items) => {
        if (active) {
          const item = items.find(
            (item) => item.name.replace(/\s/g, '') === '연속학습복구권'
          );
          setOwnedCount(item?.quantity ?? 0);
        }
      })
      .catch(() => {
        if (active) alert('보유 아이템을 불러오지 못했습니다.');
      })
      .finally(() => {
        if (active) setIsLoadingOwnedItems(false);
      });

    // 페이지를 벗어난 뒤 도착한 조회 응답은 반영하지 않음
    return () => {
      active = false;
    };
  }, []);

  const handlePurchase = async () => {
    if (!recoveryItem || isLoadingOwnedItems || purchaseLock.current) return;

    purchaseLock.current = true;
    setIsPurchasing(true);
    try {
      // 조회한 itemId로 1개 구매 요청 (세 번째 인자는 요청 식별용 UUID)
      const result = await purchaseItem(
        recoveryItem.itemId,
        1,
        crypto.randomUUID()
      );
      // 서버가 반환한 구매 후 보유 수량으로 갱신
      setOwnedCount(result.quantityAfter);
      alert('복구권을 구매했습니다.');
    } catch (error) {
      alert(
        isAxiosError(error)
          ? (error.response?.data?.message ?? '구매에 실패했습니다.')
          : '구매에 실패했습니다.'
      );
    } finally {
      purchaseLock.current = false;
      setIsPurchasing(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-260">
      <PageTitleSection
        title="상점"
        description="1주일 패스로 더 자유롭게 풀어보세요. 결제하면 바로 시작돼요."
      />

      <section className="mt-12" aria-labelledby="cash-products">
        <h2 id="cash-products" className="mb-4 text-xl font-semibold">
          현금 결제
        </h2>
        <PassProductCard passStatus={passStatus} {...MOCK_PASS_SCHEDULE} />
      </section>

      <section className="mt-9" aria-labelledby="fish-products">
        <h2 id="fish-products" className="mb-4 text-xl font-semibold">
          생선으로 교환
        </h2>
        <RecoveryProductCard
          ownedCount={ownedCount}
          fishPrice={recoveryItem?.fishPrice}
          disabled={!recoveryItem || isLoadingOwnedItems || isPurchasing}
          isPurchasing={isPurchasing}
          onPurchase={handlePurchase}
        />
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
            · 본 서비스는 경진대회 출품작으로 베타 운영되며, 운영 종료 후
            데이터가 소멸될 수 있습니다.
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
};

export default ShopPage;
