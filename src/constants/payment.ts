export const PAYMENT_ENABLED = import.meta.env.VITE_PAYMENT_ENABLED === 'true';
export const PAYMENT_DISABLED_MESSAGE = '결제 서비스 준비 중입니다.';

export const WEEK_PASS_PRODUCT = {
  productCode: 'WEEKLY_PASS',
  name: '1주일 패스',
  price: 1900,
  passDurationHours: 168,
};
