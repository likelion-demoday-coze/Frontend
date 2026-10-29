import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { getPaymentStatus } from '../api/payment';
import { getCurrentPass, getPassHistories } from '../api/pass';
import type { PaymentDetail } from '../types/payment';

type PaymentCheckState =
  | { phase: 'checking'; payment: PaymentDetail | null }
  | { phase: 'delayed'; payment: PaymentDetail | null }
  | { phase: 'resolved'; payment: PaymentDetail }
  | { phase: 'error'; message: string };
type PassPeriod = { startedAt: string; expiresAt: string };

const TERMINAL = ['COMPLETED', 'REFUNDED', 'FAILED', 'CANCELLED'];
const PENDING = ['READY', 'PAYMENT_REQUESTED', 'APPROVED', 'CANCEL_REQUESTED'];

export const usePaymentResult = (orderNumber: string | null) => {
  const [attempt, setAttempt] = useState(0);
  const [periodAttempt, setPeriodAttempt] = useState(0);
  const [stored, setStored] = useState<{
    orderNumber: string | null;
    attempt: number;
    state: PaymentCheckState;
  }>({
    orderNumber: null,
    attempt: 0,
    state: { phase: 'checking', payment: null },
  });
  const [period, setPeriod] = useState<{
    paymentId: number;
    attempt: number;
    periodAttempt: number;
    value: PassPeriod | null;
  } | null>(null);
  const state: PaymentCheckState =
    stored.orderNumber === orderNumber && stored.attempt === attempt
      ? stored.state
      : { phase: 'checking', payment: null };

  useEffect(() => {
    if (!orderNumber) return;
    const controller = new AbortController();
    let active = true;
    let pollTimer: ReturnType<typeof setTimeout>;
    let latest: PaymentDetail | null = null;
    const update = (state: PaymentCheckState) => {
      if (active && !controller.signal.aborted)
        setStored({ orderNumber, attempt, state });
    };
    const deadlineTimer = setTimeout(() => {
      update({ phase: 'delayed', payment: latest });
      controller.abort();
      clearTimeout(pollTimer);
    }, 60000);

    const stop = () => {
      clearTimeout(deadlineTimer);
      clearTimeout(pollTimer);
    };
    const poll = async () => {
      try {
        const payment = await getPaymentStatus(orderNumber, controller.signal);
        if (!active || controller.signal.aborted) return;
        if (!payment || payment.orderNumber !== orderNumber) {
          stop();
          update({
            phase: 'error',
            message: '주문 정보를 확인하지 못했어요. 주문번호를 확인해 주세요.',
          });
          return;
        }
        latest = payment;
        try {
          sessionStorage.setItem('paymentOrderNumber', orderNumber);
        } catch {
          /* URL의 주문번호로 계속 조회 */
        }
        if (TERMINAL.includes(payment.status)) {
          stop();
          update({ phase: 'resolved', payment });
          return;
        }
        if (!PENDING.includes(payment.status)) {
          stop();
          update({
            phase: 'error',
            message:
              '결제 상태를 확인하지 못했어요. 잠시 후 다시 확인해 주세요.',
          });
          return;
        }
        update({ phase: 'checking', payment });
      } catch (error) {
        if (!active || controller.signal.aborted) return;
        if (!isAxiosError(error) && error instanceof Error) {
          stop();
          update({ phase: 'error', message: error.message });
          return;
        }
        if (
          isAxiosError(error) &&
          [400, 401, 403, 404].includes(error.response?.status ?? 0)
        ) {
          stop();
          update({
            phase: 'error',
            message:
              error.response?.data?.message ??
              '결제 조회 권한 또는 주문번호를 확인해 주세요.',
          });
          return;
        }
      }
      if (active && !controller.signal.aborted)
        pollTimer = setTimeout(poll, 2000);
    };
    void poll();
    return () => {
      active = false;
      stop();
      controller.abort();
    };
  }, [orderNumber, attempt]);

  const completedId =
    state.phase === 'resolved' && state.payment.status === 'COMPLETED'
      ? state.payment.paymentId
      : null;
  useEffect(() => {
    if (completedId === null) return;
    let active = true;
    Promise.allSettled([getCurrentPass(), getPassHistories(0, 100)]).then(
      ([current, histories]) => {
        if (!active) return;
        const history =
          histories.status === 'fulfilled'
            ? histories.value.passes.find(
                (pass) => pass.paymentId === completedId
              )
            : undefined;
        const pass =
          current.status === 'fulfilled' &&
          current.value.pass?.memberPassId === history?.memberPassId
            ? current.value.pass
            : history;
        setPeriod({
          paymentId: completedId,
          attempt,
          periodAttempt,
          value: pass
            ? { startedAt: pass.startedAt, expiresAt: pass.expiresAt }
            : null,
        });
      }
    );
    return () => {
      active = false;
    };
  }, [completedId, attempt, periodAttempt]);

  return {
    state,
    passPeriod:
      period?.paymentId === completedId &&
      period.attempt === attempt &&
      period.periodAttempt === periodAttempt
        ? period.value
        : null,
    isLoadingPassPeriod:
      completedId !== null &&
      (period?.paymentId !== completedId ||
        period.attempt !== attempt ||
        period.periodAttempt !== periodAttempt),
    retryPassPeriod: () => {
      if (completedId !== null) setPeriodAttempt((value) => value + 1);
    },
    retry: () => setAttempt((value) => value + 1),
  };
};
