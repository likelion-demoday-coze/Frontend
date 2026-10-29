import { useEffect, useId, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import CheckIcon from '../../assets/signup/check.svg?react';
import CrossIcon from '../../assets/signup/cross.svg?react';
import { checkNickname } from '../../api/auth';
import type { getMeResult } from '../../api/auth';
import { updateNickname } from '../../api/member';
import {
  LIVE_PATTERN,
  NICKNAME_MAX,
  NICKNAME_MIN,
  ONLY_DIGITS,
  STRICT_PATTERN,
} from '../../utils/nickname';

type Status =
  | 'idle'
  | 'typing'
  | 'available'
  | 'same'
  | 'duplicate'
  | 'tooLong'
  | 'tooShort'
  | 'onlyDigits'
  | 'invalid'
  | 'error';

const MESSAGE: Record<Status, string> = {
  idle: '',
  typing: '중복확인 버튼을 눌러주세요',
  available: '사용할 수 있는 닉네임이에요',
  same: '지금 쓰고 있는 닉네임이에요',
  duplicate: '이미 사용 중인 닉네임이에요',
  tooLong: `최대 ${NICKNAME_MAX}자까지 입력할 수 있어요`,
  tooShort: `최소 ${NICKNAME_MIN}자부터 입력할 수 있어요`,
  onlyDigits: '숫자만으로는 만들 수 없어요',
  invalid: '한글, 영문, 숫자만 사용할 수 있어요',
  error: '확인 중 오류가 발생했어요. 다시 시도해주세요',
};

interface NicknameModalProps {
  currentNickname: string;
  onClose: () => void;
  onChanged: (member: getMeResult) => void;
}

//마이페이지 닉네임 변경 팝업
const NicknameModal = ({
  currentNickname,
  onClose,
  onChanged,
}: NicknameModalProps) => {
  const titleId = useId();
  const messageId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [opener] = useState(() => document.activeElement as HTMLElement | null);
  const [nickname, setNickname] = useState('');
  const [isTooLong, setIsTooLong] = useState(false);
  const [checkResult, setCheckResult] = useState<
    'available' | 'duplicate' | 'error' | null
  >(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const latestNicknameRef = useRef(nickname);

  useEffect(() => {
    latestNicknameRef.current = nickname;
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const isInside = dialogRef.current.contains(active);
      if (event.shiftKey && (active === first || !isInside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !isInside)) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => () => opener?.focus(), [opener]);

  const isValid =
    nickname.length >= NICKNAME_MIN &&
    !isTooLong &&
    STRICT_PATTERN.test(nickname) &&
    !ONLY_DIGITS.test(nickname) &&
    nickname !== currentNickname;

  const status: Status = (() => {
    if (!nickname) return 'idle';
    if (!LIVE_PATTERN.test(nickname)) return 'invalid';
    if (isTooLong) return 'tooLong';
    if (ONLY_DIGITS.test(nickname)) return 'onlyDigits';
    if (nickname.length < NICKNAME_MIN) return 'tooShort';
    if (nickname === currentNickname) return 'same';
    return checkResult ?? 'typing';
  })();

  const isError = !['idle', 'typing', 'available'].includes(status);
  const isChecked = status === 'available';
  const canCheck = isValid && !isChecked && !isChecking;
  const canSave = isChecked && !isSaving;

  const handleChange = (value: string) => {
    const exceeded = value.length > NICKNAME_MAX;
    setNickname(exceeded ? value.slice(0, NICKNAME_MAX) : value);
    setIsTooLong(exceeded);
    setCheckResult(null);
  };

  const handleClear = () => {
    handleChange('');
    inputRef.current?.focus();
  };

  const handleCheck = async () => {
    if (!canCheck) return;
    const requested = nickname;
    setIsChecking(true);
    try {
      const { available } = await checkNickname({ nickname: requested });
      if (latestNicknameRef.current !== requested) return;
      setCheckResult(available ? 'available' : 'duplicate');
    } catch (error) {
      if (latestNicknameRef.current !== requested) return;
      console.error('닉네임 확인 실패', error);
      setCheckResult('error');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    try {
      const member = await updateNickname(nickname);
      onChanged(member);
    } catch (error) {
      console.error('닉네임 변경 실패', error);
      setCheckResult(
        isAxiosError(error) && error.response?.status === 409
          ? 'duplicate'
          : 'error'
      );
      setIsSaving(false);
    }
  };

  const inputBorder = isError
    ? 'border-red-55'
    : status === 'available'
      ? 'border-green-65'
      : status === 'typing'
        ? 'border-blue-60'
        : 'border-gray-20';
  const messageColor = isError
    ? 'text-red-70'
    : status === 'available'
      ? 'text-green-80'
      : 'text-blue-60';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-108 flex-col gap-6 rounded-[20px] bg-white p-6"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h2 id={titleId} className="text-xl font-semibold text-black">
            닉네임 변경
          </h2>
          <p className="text-sm font-medium text-gray-60">
            랭킹에 공개되는 이름이에요.
            <br />
            언제든 다시 바꿀 수 있어요.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 lg:gap-5">
            <div
              className={`flex h-14 min-w-0 flex-1 items-center gap-3 rounded-2xl border bg-white px-4 lg:px-5 ${inputBorder}`}
            >
              <input
                ref={inputRef}
                type="text"
                value={nickname}
                autoFocus
                onChange={(event) => handleChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.nativeEvent.isComposing)
                    handleCheck();
                }}
                placeholder={`한글, 영문, 숫자 ${NICKNAME_MIN}-${NICKNAME_MAX}자`}
                aria-label="새 닉네임"
                aria-invalid={isError}
                aria-describedby={messageId}
                className="min-w-0 flex-1 bg-transparent text-base font-medium text-black outline-none placeholder:text-gray-40"
              />
              <button
                type="button"
                onClick={handleClear}
                aria-label="입력 지우기"
                className="flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-10 text-[8px] text-gray-60"
              >
                ✕
              </button>
              <span
                className={`shrink-0 text-xs tabular-nums ${isError ? 'text-red-70' : 'text-gray-60'}`}
              >
                {nickname.length}/{NICKNAME_MAX}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCheck}
              disabled={!isChecked && !canCheck}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
                isChecked
                  ? 'cursor-default bg-gray-20 text-gray-60'
                  : 'cursor-pointer bg-blue-50 text-white disabled:cursor-not-allowed'
              }`}
            >
              {isChecked ? '확인완료' : isChecking ? '확인 중...' : '중복확인'}
            </button>
          </div>
          <p
            id={messageId}
            role={isError ? 'alert' : undefined}
            className={`flex min-h-5 items-center gap-1 px-1 text-sm font-medium ${messageColor}`}
          >
            {status === 'available' && (
              <CheckIcon aria-hidden className="h-3 w-3 text-green-65" />
            )}
            {isError && (
              <CrossIcon aria-hidden className="h-3 w-3 text-red-55" />
            )}
            {MESSAGE[status]}
          </p>
        </div>

        <div className="flex w-full justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-14 flex-1 cursor-pointer rounded-xl border border-gray-20 bg-white text-lg font-semibold text-gray-40 lg:h-16 lg:w-42 lg:flex-none"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="h-14 flex-1 cursor-pointer rounded-xl bg-blue-60 text-lg font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-20 disabled:text-gray-60 lg:h-16 lg:w-42 lg:flex-none"
          >
            {isSaving ? '변경 중...' : '변경하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NicknameModal;
