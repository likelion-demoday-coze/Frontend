import { useCallback, useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { getOwnedItems, getStoreItems, purchaseItem } from '../api/store';
import type { Storeitems } from '../types/store';
import { Link, useOutletContext } from 'react-router-dom';
import PageTitleSection from '../components/common/PageTitle';
import PassProductCard from '../components/shop/PassProductCard';
import RecoveryProductCard from '../components/shop/RecoveryProductCard';
import { getAttendanceToday } from '../api/attendance';
import { ROUTES } from '../constants/routes';
import { PAYMENT_ENABLED, PAYMENT_DISABLED_MESSAGE, WEEK_PASS_PRODUCT } from '../constants/payment';
import { createPaymentOrder } from '../api/payment';
import type { CreatePaymentOrderResult } from '../types/payment';
import { getCurrentPass } from '../api/pass';
import { fetchCsrfToken, hasCsrfToken } from '../api/axiosInstance';
import PaymentConfirmModal from '../components/payment/PaymentConfirmModal';
import RecoveryPurchaseModal from '../components/shop/RecoveryPurchaseModal';
import { getFishBalance } from '../api/fish';

// 판매 일정 API 연결 전 사용할 목데이터 (한국 시간)
const MOCK_PASS_SCHEDULE = {
  saleEndsAt: '2026-11-03T23:59:59.999+09:00',
  serviceEndsAt: '2026-11-06T00:00:00+09:00',
};

const ShopPage = () => {
  const { updateFishBalance } = useOutletContext<{
    updateFishBalance: (balance: number) => void;
  }>();
  const [recoveryItem, setRecoveryItem] = useState<Storeitems>();
  const [ownedCount, setOwnedCount] = useState<number>();
  const [isLoadingOwnedItems, setIsLoadingOwnedItems] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [passStatus, setPassStatus] = useState<
    'loading' | 'active' | 'inactive' | 'error'
  >('loading');
  // 상태가 화면에 반영되기 전에도 연속 클릭으로 인한 중복 요청을 막음
  const purchaseLock = useRef(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const orderLock = useRef(false);
  const createdOrder = useRef<{
    receiverPhone: string;
    order: CreatePaymentOrderResult;
  } | null>(null);
  const [fishBalance, setFishBalance] = useState<number | null>(null);
  const [isLoadingFishBalance, setIsLoadingFishBalance] = useState(true);
  const [fishBalanceError, setFishBalanceError] = useState('');
  const [isRecoveryPurchaseOpen, setIsRecoveryPurchaseOpen] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const fishBalanceVersion = useRef(0);
  const purchaseRequestId = useRef<string | null>(null);
  const mounted = useRef(true);

  const refreshFishBalance = useCallback(async () => {
    if (!mounted.current) return;
    const version = ++fishBalanceVersion.current;
    setIsLoadingFishBalance(true);
    setFishBalanceError('');
    try {
      const balance = await getFishBalance();
      if (!mounted.current || version !== fishBalanceVersion.current) return;
      setFishBalance(balance);
      updateFishBalance(balance);
    } catch {
      if (!mounted.current || version !== fishBalanceVersion.current) return;
      setFishBalance(null);
      setFishBalanceError('FISH 잔액을 불러오지 못했어요.');
    } finally {
      if (mounted.current && version === fishBalanceVersion.current) setIsLoadingFishBalance(false);
    }
  }, [updateFishBalance]);

  useEffect(() => {
    let active = true;
    mounted.current = true;
    const balanceVersion = ++fishBalanceVersion.current;
    getFishBalance().then((balance) => {
      if (active && balanceVersion === fishBalanceVersion.current) {
        setFishBalance(balance);
        updateFishBalance(balance);
      }
    }).catch(() => {
      if (active && balanceVersion === fishBalanceVersion.current) {
        setFishBalance(null);
        setFishBalanceError('FISH 잔액을 불러오지 못했어요.');
      }
    }).finally(() => {
      if (active && balanceVersion === fishBalanceVersion.current) setIsLoadingFishBalance(false);
    });

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

    // 공통 상품 코드로 복구권을 찾고 서버의 itemId와 가격을 저장
    getStoreItems()
      .then((items) => {
        console.log('상점 상품 조회 결과:', items);
        if (active) {
          setRecoveryItem(
            items.find(
              (item) => item.itemCode === 'STREAK_RECOVERY'
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
            (item) => item.itemCode === 'STREAK_RECOVERY'
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
      mounted.current = false;
      fishBalanceVersion.current += 1;
    };
  }, [updateFishBalance]);

  const handlePurchase = async () => {
    if (!recoveryItem || !isRecoveryPurchaseOpen || isLoadingOwnedItems || isLoadingFishBalance || fishBalance === null || fishBalance < recoveryItem.fishPrice || purchaseLock.current) return;

    purchaseLock.current = true;
    fishBalanceVersion.current += 1;
    setIsPurchasing(true);
    setPurchaseError('');
    try {
      if (!hasCsrfToken()) await fetchCsrfToken();
      if (!mounted.current) return;
      purchaseRequestId.current ??= crypto.randomUUID();
      // 조회한 itemId로 1개 구매 요청 (세 번째 인자는 요청 식별용 UUID)
      const result = await purchaseItem(
        recoveryItem.itemId,
        1,
        purchaseRequestId.current
      );
      purchaseRequestId.current = null;
      if (!mounted.current) return;
      // 서버가 반환한 구매 후 보유 수량으로 갱신
      setOwnedCount(result.quantityAfter);
      setFishBalance(result.balanceAfter);
      updateFishBalance(result.balanceAfter);
      setIsRecoveryPurchaseOpen(false);
      alert('복구권을 구매했습니다.');
    } catch (error) {
      if (!mounted.current) return;
      setPurchaseError(
        isAxiosError(error)
          ? (error.response?.data?.message ?? '구매에 실패했습니다.')
          : error instanceof Error ? error.message : '구매에 실패했습니다.'
      );
      void refreshFishBalance();
    } finally {
      purchaseLock.current = false;
      if (mounted.current) setIsPurchasing(false);
    }
  };

  const handlePayment = async (receiverPhone: string) => {
    if (!PAYMENT_ENABLED) throw new Error(PAYMENT_DISABLED_MESSAGE);
    if (orderLock.current) return;
    if (!/^010\d{8}$/.test(receiverPhone)) throw new Error('휴대전화 번호를 확인해 주세요.');
    orderLock.current = true;
    setIsOrdering(true);
    try {
      if (createdOrder.current?.receiverPhone !== receiverPhone) createdOrder.current = null;
      if (!createdOrder.current) {
        if (Date.now() >= Date.parse(MOCK_PASS_SCHEDULE.saleEndsAt)) throw new Error('패스 판매가 종료되었어요.');
        const currentPass = await getCurrentPass();
        if (currentPass.active) {
          setPassStatus('active');
          throw new Error('현재 이용 중인 패스가 있습니다. 만료 후 다시 구매해 주세요.');
        }
        if (!hasCsrfToken()) await fetchCsrfToken();
        const order = await createPaymentOrder({ productCode: WEEK_PASS_PRODUCT.productCode, receiverPhone });
        createdOrder.current = { receiverPhone, order };
      }
      const order = createdOrder.current.order;
      let paymentUrl: URL;
      try { paymentUrl = new URL(order.paymentUrl); }
      catch (error) { throw new Error('결제창 정보를 확인하지 못했어요.', { cause: error }); }
      if (paymentUrl.protocol !== 'https:' || !order.orderNumber) throw new Error('결제창 정보를 확인하지 못했어요.');
      // 결제창 이동 전에 주문번호를 보관해 복귀 후 최종 상태를 확인
      try { sessionStorage.setItem('paymentOrderNumber', order.orderNumber); }
      catch (error) { throw new Error('주문번호를 저장하지 못했어요. 브라우저 저장 공간 설정을 확인해 주세요.', { cause: error }); }
      window.location.assign(paymentUrl.href);
    } catch (error) {
      if (isAxiosError(error)) {
        const code = error.response?.data?.code;
        if (code === 'PAYMENT_409_2') setPassStatus('active');
        if (error.response?.status === 404 && code !== 'PAYMENT_404_1') throw new Error(PAYMENT_DISABLED_MESSAGE, { cause: error });
        throw new Error(error.response?.data?.message ?? '결제 요청 결과를 확인하지 못했어요. 진행 중인 결제가 있는지 확인해 주세요.', { cause: error });
      }
      throw error;
    } finally {
      orderLock.current = false;
      setIsOrdering(false);
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
        <PassProductCard passStatus={passStatus} {...MOCK_PASS_SCHEDULE}
          onPurchase={() => {
            if (passStatus === 'inactive' && Date.now() < Date.parse(MOCK_PASS_SCHEDULE.saleEndsAt)) setIsPaymentOpen(true);
          }} />
      </section>

      {isPaymentOpen && <PaymentConfirmModal
        product={WEEK_PASS_PRODUCT}
        isSubmitting={isOrdering}
        onClose={() => { if (!orderLock.current) setIsPaymentOpen(false); }}
        onConfirm={handlePayment}
      />}

      <section className="mt-9" aria-labelledby="fish-products">
        <h2 id="fish-products" className="mb-4 text-xl font-semibold">
          생선으로 교환
        </h2>
        <RecoveryProductCard
          ownedCount={ownedCount}
          fishPrice={recoveryItem?.fishPrice}
          fishBalance={fishBalance}
          disabled={!recoveryItem || isLoadingOwnedItems || isLoadingFishBalance || fishBalance === null || isPurchasing}
          isPurchasing={isPurchasing}
          statusMessage={fishBalanceError || (isLoadingFishBalance ? 'FISH 확인 중...' : !recoveryItem ? '교환 준비 중' : undefined)}
          onRetry={fishBalanceError ? () => { void refreshFishBalance(); } : undefined}
          onPurchase={() => {
            if (!recoveryItem || fishBalance === null || fishBalance < recoveryItem.fishPrice || isLoadingFishBalance || isLoadingOwnedItems || purchaseLock.current) return;
            setPurchaseError('');
            setIsRecoveryPurchaseOpen(true);
            void refreshFishBalance();
          }}
        />
      </section>

      {isRecoveryPurchaseOpen && recoveryItem && <RecoveryPurchaseModal
        price={recoveryItem.fishPrice}
        fishBalance={fishBalance}
        isPurchasing={isPurchasing}
        isRefreshing={isLoadingFishBalance}
        errorMessage={purchaseError || fishBalanceError}
        onClose={() => { if (!purchaseLock.current) setIsRecoveryPurchaseOpen(false); }}
        onConfirm={() => { void handlePurchase(); }}
      />}

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
