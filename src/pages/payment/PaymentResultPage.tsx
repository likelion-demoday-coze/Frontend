import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import PaymentResultModal from '../../components/payment/PaymentResultModal';
import PassStartedModal from '../../components/payment/PassStartedModal';
import { usePaymentResult } from '../../hooks/usePaymentResult';
import { ROUTES } from '../../constants/routes';

const PaymentResultPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const orderNumber = useMemo(() => {
    if (params.has('orderNumber'))
      return params.get('orderNumber')?.trim() || null;
    try {
      return sessionStorage.getItem('paymentOrderNumber')?.trim() || null;
    } catch {
      return null;
    }
  }, [params]);
  const { state, passPeriod, isLoadingPassPeriod, retry, retryPassPeriod } =
    usePaymentResult(orderNumber);
  const [confirmedPaymentId, setConfirmedPaymentId] = useState<number | null>(
    null
  );
  const payment = 'payment' in state ? state.payment : null;

  useEffect(() => {
    if (!orderNumber || !payment) return;
    const target =
      payment.status === 'COMPLETED'
        ? ROUTES.PAYMENT_SUCCESS
        : payment.status === 'FAILED' || payment.status === 'CANCELLED'
          ? ROUTES.PAYMENT_FAIL
          : ROUTES.PAYMENT_RESULT;
    if (pathname !== target)
      navigate(`${target}?orderNumber=${encodeURIComponent(orderNumber)}`, {
        replace: true,
      });
  }, [orderNumber, payment, pathname, navigate]);

  const leave = (path: string) => {
    if (state.phase === 'resolved') {
      try {
        if (sessionStorage.getItem('paymentOrderNumber') === orderNumber)
          sessionStorage.removeItem('paymentOrderNumber');
      } catch {
        /* 조회 결과는 URL에서도 다시 확인 가능 */
      }
    }
    navigate(path, { replace: true });
  };
  const toShop = () => leave(ROUTES.SHOP);
  const toHome = () => leave(ROUTES.HOME);

  if (!orderNumber || state.phase === 'error') {
    return (
      <section className="mx-auto my-12 w-[calc(100%-32px)] max-w-105 rounded-3xl bg-white p-6 text-center">
        <h1 className="text-lg font-bold">결제 결과를 확인할 수 없어요</h1>
        <p role="alert" className="mt-3 text-sm leading-6 text-gray-60">
          {!orderNumber
            ? '주문번호가 없습니다. 결제를 진행했던 브라우저에서 다시 확인해 주세요.'
            : state.phase === 'error'
              ? state.message
              : ''}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={toShop}
            className="h-12 flex-1 cursor-pointer rounded-xl border border-gray-20 text-sm font-semibold text-gray-60"
          >
            상점으로
          </button>
          {orderNumber && (
            <button
              type="button"
              onClick={retry}
              className="h-12 flex-1 cursor-pointer rounded-xl bg-blue-60 text-sm font-semibold text-white"
            >
              다시 확인
            </button>
          )}
        </div>
      </section>
    );
  }

  let modal;
  if (state.phase === 'checking') {
    const message =
      payment?.status === 'APPROVED'
        ? '결제 승인이 완료되어 패스를 지급하고 있어요. 잠시만 기다려 주세요.'
        : payment?.status === 'CANCEL_REQUESTED'
          ? '환불 결과를 확인하고 있어요. 잠시만 기다려 주세요.'
          : undefined;
    modal = <PaymentResultModal status="checking" message={message} />;
  } else if (state.phase === 'delayed') {
    modal = (
      <PaymentResultModal status="delayed" onClose={toShop} onRetry={retry} />
    );
  } else if (state.payment.status === 'COMPLETED') {
    const showPassStarted = () =>
      setConfirmedPaymentId(state.payment.paymentId);
    modal =
      confirmedPaymentId === state.payment.paymentId ? (
        <PassStartedModal
          passPeriod={passPeriod}
          isLoadingPeriod={isLoadingPassPeriod}
          onRetry={retryPassPeriod}
          onClose={toShop}
          onQuiz={() => leave(ROUTES.QUIZ)}
        />
      ) : (
        <PaymentResultModal
          status="success"
          payment={state.payment}
          passPeriod={passPeriod}
          onClose={showPassStarted}
          onConfirm={showPassStarted}
        />
      );
  } else if (
    state.payment.status === 'CANCELLED' ||
    state.payment.status === 'REFUNDED'
  ) {
    modal = (
      <PaymentResultModal
        status={state.payment.status === 'REFUNDED' ? 'refunded' : 'cancelled'}
        onClose={toShop}
        onHome={toHome}
        onShop={toShop}
      />
    );
  } else {
    modal = (
      <PaymentResultModal
        status="failed"
        orderNumber={state.payment.orderNumber}
        failureMessage={state.payment.failureMessage}
        onClose={toShop}
        onShop={toShop}
        onRetry={toShop}
      />
    );
  }

  return (
    <section className="flex flex-1 items-center justify-center p-6">
      <h1 className="sr-only">결제 결과</h1>
      {modal}
    </section>
  );
};

export default PaymentResultPage;
