import type { ReactNode } from 'react';

export interface PaymentSummaryRow {
  label: string;
  value: ReactNode;
  emphasis?: 'blue' | 'red';
}

const PaymentSummary = ({ rows }: { rows: PaymentSummaryRow[] }) => (
  <dl className="mt-6 divide-y divide-gray-20 rounded-xl bg-gray-05 px-4 text-xs sm:text-sm">
    {rows.map(({ label, value, emphasis }) => (
      <div key={label} className="flex items-start justify-between gap-3 py-3">
        <dt className="shrink-0 font-semibold text-gray-60">{label}</dt>
        <dd
          className={`min-w-0 text-right font-semibold break-words ${emphasis === 'blue' ? 'text-blue-60' : emphasis === 'red' ? 'text-red-55' : 'text-gray-80'}`}
        >
          {value}
        </dd>
      </div>
    ))}
  </dl>
);

export default PaymentSummary;
