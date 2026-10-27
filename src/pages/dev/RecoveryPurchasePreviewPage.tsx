import { useState } from 'react';
import RecoveryProductCard from '../../components/shop/RecoveryProductCard';
import RecoveryPurchaseModal from '../../components/shop/RecoveryPurchaseModal';

const RecoveryPurchasePreviewPage = () => {
  const [balance, setBalance] = useState(1000);
  const [owned, setOwned] = useState(0);
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState('');
  const price = 200;

  return (
    <main className="min-h-dvh bg-gray-05 px-6 py-10">
      <div className="mx-auto max-w-260">
        <h1 className="text-xl font-bold text-blue-60">복구권 교환 프리뷰</h1>
        <p className="mt-3 text-sm text-gray-60">
          예시 데이터입니다. 실제 구매 요청이나 FISH 차감은 없습니다.
        </p>
        <div className="my-6 flex flex-wrap gap-3">
          {[
            { label: '잔액 충분 · FISH 1,000', value: 1000 },
            { label: '잔액 부족 · FISH 100', value: 100 },
            { label: '잔액 딱 맞음 · FISH 200', value: 200 },
          ].map((example) => (
            <button
              type="button"
              key={example.value}
              onClick={() => {
                setBalance(example.value);
                setOwned(0);
                setMessage('');
              }}
              className="cursor-pointer rounded-xl border border-blue-15 bg-white px-4 py-3 text-sm font-semibold text-blue-60"
            >
              {example.label}
            </button>
          ))}
        </div>
        <RecoveryProductCard
          ownedCount={owned}
          fishPrice={price}
          fishBalance={balance}
          disabled={balance < price}
          onPurchase={() => setOpen(true)}
        />
        {message && (
          <p role="status" className="mt-4 text-sm text-blue-60">
            {message}
          </p>
        )}
      </div>
      {open && (
        <RecoveryPurchaseModal
          price={price}
          fishBalance={balance}
          isPurchasing={false}
          isRefreshing={false}
          errorMessage=""
          onClose={() => setOpen(false)}
          onConfirm={() => {
            if (balance < price) return;
            setBalance((value) => value - price);
            setOwned((value) => value + 1);
            setOpen(false);
            setMessage(
              '예시 교환이 완료됐습니다. 실제 계정에는 반영되지 않습니다.'
            );
          }}
        />
      )}
    </main>
  );
};

export default RecoveryPurchasePreviewPage;
