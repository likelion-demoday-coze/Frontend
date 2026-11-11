import { useEffect, useRef, useState } from 'react';
import {
  acknowledgeOpenChatModal,
  checkOpenChatModal,
} from '../../../api/auth';
import useAuthstore from '../../../stores/useAuthStore';
import { useCanShowRankingReward } from '../../../hooks/useRankingRewardGate';
import OpenChatModal from './OpenChatModal';

interface OpenChatNotificationProps {
  blocker: symbol;
  onFinished: () => void;
}

const OpenChatNotification = ({
  blocker,
  onFinished,
}: OpenChatNotificationProps) => {
  const memberId = useAuthstore((state) => state.member?.memberId);
  const [result, setResult] = useState<{
    memberId: number;
    shouldShow: boolean;
    failed: boolean;
  } | null>(null);
  const [dismissedFor, setDismissedFor] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const saving = useRef(false);
  const active = useRef(true);
  const isOpen =
    memberId !== undefined &&
    result?.memberId === memberId &&
    result.shouldShow &&
    dismissedFor !== memberId;
  const canShow = useCanShowRankingReward(blocker);

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);

  useEffect(() => {
    if (memberId === undefined) return;
    let ignore = false;
    checkOpenChatModal()
      .then((response) => {
        if (!ignore) {
          setResult({
            memberId,
            shouldShow: response.shouldShow === true,
            failed: false,
          });
          if (response.shouldShow !== true) onFinished();
        }
      })
      .catch(() => {
        if (!ignore) {
          setResult({ memberId, shouldShow: false, failed: true });
          onFinished();
        }
      });
    return () => {
      ignore = true;
    };
  }, [memberId, onFinished]);

  if (result?.memberId === memberId && result?.failed) {
    return (
      <p role="status" className="mt-3 text-sm text-gray-60">
        오픈채팅 안내를 불러오지 못했어요. 다음 홈 방문 시 다시 확인합니다.
      </p>
    );
  }

  if (!canShow || !isOpen || memberId === undefined) return null;

  return (
    <OpenChatModal
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      onClose={() => {
        if (!saving.current) {
          setDismissedFor(memberId);
          onFinished();
        }
      }}
      onHideForThreeDays={async () => {
        if (
          saving.current ||
          useAuthstore.getState().member?.memberId !== memberId
        )
          return;
        saving.current = true;
        setIsSubmitting(true);
        setErrorMessage('');
        try {
          const response = await acknowledgeOpenChatModal();
          if (response.shouldShow !== false)
            throw new Error('오픈채팅 숨김 설정을 저장하지 못했어요.');
          if (
            !active.current ||
            useAuthstore.getState().member?.memberId !== memberId
          )
            return;
          setResult({ memberId, shouldShow: false, failed: false });
          setDismissedFor(memberId);
          onFinished();
        } catch {
          if (
            active.current &&
            useAuthstore.getState().member?.memberId === memberId
          )
            setErrorMessage('숨김 설정을 저장하지 못했어요. 다시 눌러 주세요.');
        } finally {
          saving.current = false;
          if (active.current) setIsSubmitting(false);
        }
      }}
    />
  );
};

export default OpenChatNotification;
