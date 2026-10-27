import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PaymentConfirmModal from '../../components/payment/PaymentConfirmModal';
import PaymentResultModal from '../../components/payment/PaymentResultModal';

const SCREENS = [
  { state: 'confirm', label: '구매 확인 · 전화번호' },
  { state: 'checking', label: '결제 확인 중' },
  { state: 'delayed', label: '확인 지연' },
  { state: 'success', label: '결제 완료' },
  { state: 'cancelled', label: '결제 취소' },
  { state: 'failed', label: '결제 실패' },
] as const;
type Screen = (typeof SCREENS)[number]['state'];

const PaymentPreviewPage = () => {
  const [params] = useSearchParams();
  const [screen, setScreen] = useState<Screen | null>(() => {
    const requested = params.get('state');
    return SCREENS.find((item) => item.state === requested)?.state ?? 'confirm';
  });
  const [nextResult, setNextResult] = useState<'success' | 'delayed'>(
    'delayed'
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (screen !== 'checking') return;
    const timer = window.setTimeout(() => setScreen(nextResult), 3000);
    return () => window.clearTimeout(timer);
  }, [screen, nextResult]);

  const close = () => setScreen(null);
  const showAction = (label: string) => {
    close();
    setMessage(
      `${label} 버튼을 눌렀습니다. 프리뷰에서는 실제 페이지로 이동하지 않습니다.`
    );
  };
  const checkPayment = (next: 'success' | 'delayed') => {
    setNextResult(next);
    setScreen('checking');
  };
  const contact = () => showAction('고객문의');

  return (
    <main className="min-h-dvh bg-gray-05 px-6 py-12">
      <div className="mx-auto max-w-180">
        <h1 className="text-2xl font-bold text-blue-60">결제 팝업 프리뷰</h1>
        <p className="mt-3 text-sm leading-6 text-gray-60">
          모든 상품·금액·결제 결과는 예시입니다. 결제 API 호출과 페이앱 이동은
          없습니다.
        </p>
        <p className="mt-2 text-sm leading-6 text-gray-60">
          구매 확인에서 전화번호와 필수 동의를 입력하면 확인 중 → 완료 화면으로
          이어집니다. ‘결제 확인 중’을 따로 선택하면 3초 뒤 확인 지연 화면으로
          바뀝니다.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {SCREENS.map((item) => (
            <button
              key={item.state}
              type="button"
              onClick={() => {
                setMessage('');
                if (item.state === 'checking') checkPayment('delayed');
                else setScreen(item.state);
              }}
              className="min-h-14 cursor-pointer rounded-xl border border-blue-15 bg-white px-4 py-3 text-sm font-semibold text-blue-60"
            >
              {item.label}
            </button>
          ))}
        </div>
        {message && (
          <p role="status" className="mt-6 text-sm text-gray-60">
            {message}
          </p>
        )}
      </div>
      {screen === 'confirm' && (
        <PaymentConfirmModal
          product={{ name: '1주일 패스', price: 1900, passDurationHours: 168 }}
          onClose={close}
          onConfirm={() => checkPayment('success')}
          onOpenTerms={() =>
            window.alert(
              '이용약관 연결 위치입니다. 프리뷰에서는 실제 페이지로 이동하지 않습니다.'
            )
          }
          onOpenRefundPolicy={() =>
            window.alert(
              '환불 정책 연결 위치입니다. 프리뷰에서는 실제 페이지로 이동하지 않습니다.'
            )
          }
        />
      )}
      {screen === 'checking' && <PaymentResultModal status="checking" />}
      {screen === 'delayed' && (
        <PaymentResultModal
          status="delayed"
          onClose={close}
          onContact={contact}
          onHistory={() => showAction('결제 내역 보기')}
          onRetry={() => checkPayment('success')}
        />
      )}
      {screen === 'success' && (
        <PaymentResultModal
          status="success"
          payment={{
            productName: '1주일 패스',
            amount: 1900,
            orderNumber: 'PAY_PREVIEW_001',
          }}
          passPeriod={{
            startedAt: '2026-10-27T14:23:00+09:00',
            expiresAt: '2026-11-03T14:23:00+09:00',
          }}
          onClose={close}
          onHistory={() => showAction('결제 내역')}
          onQuiz={() => showAction('퀴즈 풀러가기')}
        />
      )}
      {screen === 'cancelled' && (
        <PaymentResultModal
          status="cancelled"
          onClose={close}
          onHome={() => showAction('홈으로')}
          onShop={() => showAction('상점으로')}
        />
      )}
      {screen === 'failed' && (
        <PaymentResultModal
          status="failed"
          orderNumber="PAY_PREVIEW_001"
          failureMessage="카드사 승인 거절"
          onClose={close}
          onShop={() => showAction('상점으로')}
          onRetry={() => setScreen('confirm')}
          onContact={contact}
        />
      )}
    </main>
  );
};

export default PaymentPreviewPage;
