import { useEffect, useRef, useState } from 'react';
import {
  confirmCharacterEvolution,
  getMyCharacter,
} from '../../../api/character';
import useAuthstore from '../../../stores/useAuthStore';
import {
  useBlockRankingReward,
  useCanShowRankingReward,
} from '../../../hooks/useRankingRewardGate';
import { getPendingCharacterEvolution } from '../../../utils/characterEvolution';
import type { CharacterEvolution } from '../../../utils/characterEvolution';
import CharacterEvolutionModal from './CharacterEvolutionModal';

const CharacterEvolutionNotification = () => {
  const memberId = useAuthstore((state) => state.member?.memberId);
  const [result, setResult] = useState<{
    memberId: number;
    evolution: CharacterEvolution | null;
  } | null>(null);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmError, setConfirmError] = useState('');
  const confirmLock = useRef(false);
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  const evolution =
    result && result.memberId === memberId ? result.evolution : null;
  const loading =
    memberId !== undefined && result?.memberId !== memberId && !failed;
  const blocker = useBlockRankingReward(loading || evolution !== null);
  const canShow = useCanShowRankingReward(blocker);

  useEffect(() => {
    if (memberId === undefined) return;
    let active = true;
    getMyCharacter({ timeout: 5000, suppressNetworkAlert: true })
      .then((character) => {
        if (active) {
          setFailed(false);
          setResult({
            memberId,
            evolution: getPendingCharacterEvolution(
              character.pendingEvolutionStage
            ),
          });
        }
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [memberId, retry]);

  if (failed)
    return (
      <p role="status" className="mt-3 text-sm text-gray-60">
        캐릭터 진화 정보를 불러오지 못했어요.
        <button
          type="button"
          onClick={() => {
            setFailed(false);
            setResult(null);
            setRetry((value) => value + 1);
          }}
          className="ml-2 cursor-pointer font-semibold text-blue-60 underline"
        >
          다시 확인
        </button>
      </p>
    );
  if (!canShow || !evolution || memberId === undefined) return null;

  return (
    <CharacterEvolutionModal
      evolution={evolution}
      isSubmitting={isSubmitting}
      errorMessage={confirmError}
      onClose={async () => {
        if (
          confirmLock.current ||
          useAuthstore.getState().member?.memberId !== memberId
        )
          return;
        confirmLock.current = true;
        setIsSubmitting(true);
        setConfirmError('');
        try {
          await confirmCharacterEvolution(evolution.stage);
          if (
            active.current &&
            useAuthstore.getState().member?.memberId === memberId
          )
            setResult({ memberId, evolution: null });
        } catch {
          if (
            active.current &&
            useAuthstore.getState().member?.memberId === memberId
          )
            setConfirmError('진화 확인을 저장하지 못했어요. 다시 눌러 주세요.');
        } finally {
          confirmLock.current = false;
          if (active.current) setIsSubmitting(false);
        }
      }}
    />
  );
};

export default CharacterEvolutionNotification;
