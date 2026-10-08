import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup, checkNickname } from '../../api/auth';
import { fetchCsrfToken, hasCsrfToken } from '../../api/axiosInstance';
import useAuthstore from '../../stores/useAuthStore';

import textlogo from '../../assets/logos/coze_text_logo_black.svg';
import CheckIcon from '../../assets/signup/check.svg?react';
import CrossIcon from '../../assets/signup/cross.svg?react';
import catImage from '../../assets/character/basic_pose_cat.svg';

import {
  NICKNAME_MAX,
  NICKNAME_MIN,
  LIVE_PATTERN,
  STRICT_PATTERN,
  ONLY_DIGITS,
} from '../../utils/nickname';

type Status =
  | 'idle' // 입력 전
  | 'typing' // 입력중
  | 'available' // 사용 가능
  | 'duplicate' // 중복
  | 'tooLong' // 글자 수 초과
  | 'tooShort' // 글자 수 부족
  | 'onlyDigits' // 숫자만 입력
  | 'invalid' // 사용 불가 문자
  | 'error'; // 서버 오류

//에러인 경우 따로 스타일 뻄
const ERROR_STYLE = {
  border: 'border-red-55',
  text: 'text-red-70',
  bedge: 'text-[#F8003A]',
};

const STYLE: Record<Status, { border: string; text: string; bedge: string }> = {
  idle: {
    border: 'border-gray-20',
    text: '',
    bedge: '',
  },
  typing: {
    border: 'border-blue-60',
    text: 'text-blue-60',
    bedge: '',
  },
  available: {
    border: 'border-green-85',
    text: 'text-green-85',
    bedge: 'text-green-65',
  },
  duplicate: ERROR_STYLE,
  tooLong: ERROR_STYLE,
  tooShort: ERROR_STYLE,
  onlyDigits: ERROR_STYLE,
  invalid: ERROR_STYLE,
  error: ERROR_STYLE,
};

const MESSAGE: Record<Status, string> = {
  idle: '',
  typing: '중복확인 버튼을 눌러주세요',
  available: '사용할 수 있는 닉네임이에요',
  duplicate: '이미 사용 중인 닉네임이에요',
  tooLong: `최대 ${NICKNAME_MAX}자까지 입력할 수 있어요`,
  tooShort: `최소 ${NICKNAME_MIN}자부터 입력할 수 있어요`,
  onlyDigits: '숫자만으로는 만들 수 없어요',
  invalid: '한글, 영문, 숫자만 사용할 수 있어요',
  error: '확인 중 오류가 발생했어요. 다시 시도해주세요',
};

const SignupPage = () => {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // 사용 가능 확인 완료
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isTooLong, setIsTooLong] = useState(false);
  const [hasServerError, setHasServerError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  //카카오 로그인 후 페이지 리로드 시 메모리 csrf토큰 사라짐 -> 다시 받음
  useEffect(() => {
    fetchCsrfToken();
  }, []);

  //이전 중복 확인 결과를 초기화함 -> 닉네임이 수정되면 호출
  const resetResult = () => {
    setIsChecked(false);
    setIsDuplicate(false);
    setHasServerError(false);
  };

  //닉네임이 바뀌고있으면 이전 결과를 무효
  const handleChange = (value: string) => {
    const exceeded = value.length > NICKNAME_MAX;
    //초과하면 끊어서 저장
    setNickname(exceeded ? value.slice(0, NICKNAME_MAX) : value);
    //초과하면 true
    setIsTooLong(exceeded);
    resetResult();
  };

  //입력창 우측 텍스트 삭제 버튼
  const handleClear = () => {
    setNickname('');
    setIsTooLong(false);
    resetResult();

    //지운 뒤 바로 입력
    inputRef.current?.focus();
  };

  // → 화면, 중복확인, 가입에 쓰는 값이 항상 같음
  const hasInvalidChar = !LIVE_PATTERN.test(nickname);
  const isOnlyDigits = ONLY_DIGITS.test(nickname);
  const isTooShort = nickname.length > 0 && nickname.length < NICKNAME_MIN;

  // 중복확인 전 단계의 규칙을 모두 통과했는지
  const isValid =
    nickname.length >= NICKNAME_MIN &&
    !isTooLong &&
    STRICT_PATTERN.test(nickname) && // 조합이 끝난 글자만
    !isOnlyDigits;

  // 현재 화면에 보여줄 상태를 하나로 결정
  // 위에서부터 우선순위 순으로 검사하고, 먼저 걸리는 상태를 사용함(순서체크)
  const status: Status = (() => {
    if (!nickname) return 'idle';
    if (hasInvalidChar) return 'invalid';
    if (isTooLong) return 'tooLong';
    if (isOnlyDigits) return 'onlyDigits';
    if (isTooShort) return 'tooShort';
    if (isChecked) return 'available';
    if (isDuplicate) return 'duplicate';
    if (hasServerError) return 'error';
    return 'typing';
  })();

  //항상 최신 닉네임을 가리킴
  const latestNicknameRef = useRef(nickname);

  useEffect(() => {
    latestNicknameRef.current = nickname;
  });
  // 체크 가능 조건
  const canCheck = isValid && !isChecked && !isChecking;
  //회원가입 가능 조건
  const canSignup = isValid && isChecked && !isLoading;

  const handleCheckNickname = async () => {
    if (!canCheck) return; // 규칙 위반, 확인 완료, 요청 중이면 종료

    const requested = nickname; // 이 값으로 요청함
    try {
      setIsChecking(true);
      const { available } = await checkNickname({ nickname: requested });

      // 응답이 오는 사이 입력이 바뀌었으면 이 응답은 버림
      if (latestNicknameRef.current !== requested) return;
      setIsChecked(available);
      setIsDuplicate(!available); //중복은 아님
      setHasServerError(false); //서버에러도 아님
    } catch (error) {
      // 입력이 바뀌었으면 에러 표시를 하지 않음
      if (latestNicknameRef.current !== requested) return;
      console.error('닉네임 확인 실패', error);
      setIsChecked(false);
      setIsDuplicate(false);
      setHasServerError(true);
    } finally {
      setIsChecking(false); //확인중 상태 해제
    }
  };

  const handleSignup = async () => {
    if (!canSignup) return; // 규칙과 중복확인을 모두 통과해야만 진행

    try {
      setIsLoading(true);
      //토큰이 없으면 받은 후 가입요청
      if (!hasCsrfToken()) {
        await fetchCsrfToken();
      }
      const result = await signup({ nickname });
      useAuthstore.getState().setMember(result);
      navigate('/home');
    } catch (error) {
      console.error('회원가입 실패', error);
      alert('회원가입에 실패하였습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 현재 상태에 맞는 색상 클래스
  const style = STYLE[status];

  // 에러 계열 상태인지 (X 아이콘 표시, aria-invalid, role="alert"에 사용)
  const isError =
    status === 'duplicate' ||
    status === 'tooLong' ||
    status === 'tooShort' ||
    status === 'onlyDigits' ||
    status === 'invalid' ||
    status === 'error';

  return (
    <div>
      <header className="mx-auto max-w-300 px-15 pt-6">
        <img src={textlogo} alt="COZ:E" className="h-8" />
      </header>
      <div className="flex clamp min-h-screen flex-col items-center overflow-hidden px-4 pt-15">
        <div className="mb-7 w-full max-w-135.25">
          <div className="mb-13 text-left">
            <h1 className="text-[28px] font-semibold">닉네임을 정해주세요</h1>
            <p className="mt-2 text-[18px] text-gray-60">
              랭킹에 공개되는 이름이에요. 마이페이지에서 언제든 바꿀 수 있어요.
            </p>
          </div>

          <div className="flex items-center gap-5">
            <div
              className={`flex h-14 flex-1 items-center rounded-xl border bg-white px-5 transition-colors ${style.border}`}
            >
              <input
                ref={inputRef}
                type="text"
                value={nickname}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={(e) => {
                  // Enter로 중복확인 가능
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                    handleCheckNickname();
                  }
                }}
                placeholder={`한글, 영문, 숫자 ${NICKNAME_MIN}~${NICKNAME_MAX}자`}
                aria-invalid={isError}
                aria-label="닉네임"
                aria-describedby="nickname-message" // 아래 메시지와 연결
                className="min-w-0 flex-1 bg-transparent text-base outline-none"
              />

              {/* 입력 지우기 버튼: 입력값이 있을 때만 노출 */}
              {nickname && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="입력 지우기"
                  className="mr-3 flex h-3 w-3 items-center justify-center rounded-full bg-gray-10 text-gray-60 text-[10px] cursor-pointer"
                >
                  ✕
                </button>
              )}

              {/* 글자수 카운터  */}
              <span
                className={`text-sm tabular-nums ${style.bedge || 'text-gray-50'}`}
              >
                {nickname.length}/{NICKNAME_MAX}
              </span>
            </div>

            {/* 중복 확인 버튼 */}
            <button
              type="button"
              onClick={handleCheckNickname}
              disabled={!canCheck}
              className={`shrink-0 rounded-full px-4 py-2 text-[14px] font-bold transition ${
                isChecked
                  ? 'cursor-default bg-gray-20 text-gray-50'
                  : 'bg-blue-60 text-white hover:brightness-95 disabled:opacity-50'
              }`}
            >
              {isChecked ? '확인완료' : isChecking ? '확인 중...' : '중복확인'}
            </button>
          </div>

          {/* 입력중일땐 아무것도 안뜸*/}
          <div className="mt-2 min-h-5 px-1">
            {status !== 'idle' && (
              <p
                id="nickname-message"
                className={`flex items-center gap-1 text-[14px] ${style.text}`}
                role={isError ? 'alert' : undefined}
              >
                {status === 'available' && (
                  <CheckIcon aria-hidden className={`h-3 w-3 ${style.bedge}`} />
                )}
                {isError && (
                  <CrossIcon aria-hidden className={`h-3 w-3 ${style.bedge}`} />
                )}
                {MESSAGE[status]}
              </p>
            )}
          </div>

          <button
            onClick={handleSignup}
            type="button"
            disabled={!canSignup}
            className="mt-8 h-16 w-full rounded-lg bg-blue-60 text-[18px] font-semibold text-white transition hover:brightness-95 disabled:opacity-50"
          >
            {isLoading ? '가입 중...' : '시작하기'}
          </button>
        </div>

        <div className="relative -mt-10 h-[510px] w-218.75 shrink-0 overflow-hidden">
          <div className="absolute top-74 left-7 z-10 rounded-full bg-blue-50 px-3 py-2 text-sm font-bold text-blue-05">
            뭐라고 불러주면 될까 냥?
          </div>

          <img src={catImage} alt="고양이" className="block h-auto w-full" />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
