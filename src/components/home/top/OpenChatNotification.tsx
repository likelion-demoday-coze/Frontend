import { useEffect, useRef, useState } from 'react';
import {
  hideAnnouncementPopup,
  getAnnouncementPopupStatus,
} from '../../../api/auth';
import useAuthstore from '../../../stores/useAuthStore';
import { useCanShowRankingReward } from '../../../hooks/useRankingRewardGate';
import OpenChatModal from './OpenChatModal';
import PassNotification from './PassNotification';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

interface OpenChatNotificationProps {
  variant?: 'openChat' | 'pass';
  blocker: symbol;
  onFinished: () => void;
}

const OpenChatNotification = ({
  variant = 'openChat',
  blocker,
  onFinished,
}: OpenChatNotificationProps) => {
  const navigate = useNavigate();
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
    getAnnouncementPopupStatus()
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
        안내 팝업을 불러오지 못했어요. 다음 홈 방문 시 다시 확인합니다.
      </p>
    );
  }

  if (!canShow || !isOpen || memberId === undefined) return null;

  const close = () => {
    if (saving.current) return;
    setDismissedFor(memberId);
    onFinished();
  };

  const hideToday = async () => {
    if (saving.current || useAuthstore.getState().member?.memberId !== memberId)
      return;
    saving.current = true;
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const response = await hideAnnouncementPopup();
      if (response.shouldShow !== false)
        throw new Error('팝업 숨김 설정을 저장하지 못했어요.');
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
  };

  if (variant === 'pass') {
    return (
      <PassNotification
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        onClose={close}
        onHideToday={() => void hideToday()}
        onViewPass={() => {
          if (saving.current) return;
          close();
          navigate(ROUTES.SHOP);
        }}
      />
    );
  }

  return (
    <OpenChatModal
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      onClose={close}
      onHideToday={() => void hideToday()}
    />
  );
};

export default OpenChatNotification;
