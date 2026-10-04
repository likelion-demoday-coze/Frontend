import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup, checkNickname } from '../../api/auth';
import { fetchCsrfToken, hasCsrfToken } from '../../api/axiosInstance';
import useAuthstore from '../../stores/useAuthStore';

import CheckIcon from '../../assets/signup/check.svg?react';
import CrossIcon from '../../assets/signup/cross.svg?react';
import catImage from '../../assets/character/basic_pose_cat.svg';

//최대 글자 수
const MAX_LENGTH = 8;
// 입력 중에는 조합 중인 자모(ㄱ, ㅏ 등)도 허용해서 한글 입력 시 에러가 깜빡이지 않게 함
const LIVE_PATTERN = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]*$/;

// 중복확인 시에는 완성된 한글만 허용
const STRICT_PATTERN = /^[가-힣a-zA-Z0-9]+$/;

type Status =
  | 'idle' // 입력 전
  | 'typing' // 입력중
  | 'available' // 사용 가능
  | 'duplicate' // 중복
  | 'tooLong' // 글자 수 초과
  | 'invalid' // 사용 불가 문자
  | 'error'; // 서버 오류

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
  duplicate: {
    border: 'border-red-55',
    text: 'text-red-70',
    bedge: 'text-[#F8003A]',
  },
  tooLong: {
    border: 'border-red-55',
    text: 'text-red-70',
    bedge: 'text-[#F8003A]',
  },
  invalid: {
    border: 'border-red-55',
    text: 'text-red-70',
    bedge: 'text-[#F8003A]',
  },
  error: {
    border: 'border-red-55',
    text: 'text-red-70',
    bedge: 'text-[#F8003A]',
  },
};

const MESSAGE: Record<Status, string> = {
  idle: '',
  typing: '중복확인 버튼을 눌러주세요',
  available: '사용할 수 있는 닉네임이에요',
  duplicate: '이미 사용 중인 닉네임이에요',
  tooLong: `최대 ${MAX_LENGTH}자까지 입력할 수 있어요`,
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
    const exceeded = value.length > MAX_LENGTH;
    //초과하면 끊어서 저장
    setNickname(exceeded ? value.slice(0, MAX_LENGTH) : value);
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

  //랜더링마다 현재 닉네임에 허용되지 않는 글자가 있는지 계산
  const hasInvalidChar = !LIVE_PATTERN.test(nickname);

  // 현재 화면에 보여줄 상태를 하나로 결정
  // 위에서부터 우선순위 순으로 검사하고, 먼저 걸리는 상태를 사용함
  const status: Status = (() => {
    if (!nickname) return 'idle'; // 비어있음 -> 입력 전
    if (hasInvalidChar) return 'invalid'; // 허용되지 않는 문자 -> 최우선 에러
    if (isTooLong) return 'tooLong'; // 8자 초과 시도
    if (isChecked) return 'available'; // 중복확인 통과
    if (isDuplicate) return 'duplicate'; // 중복
    if (hasServerError) return 'error'; // 서버 오류
    return 'typing'; // 그 외: 입력 중 (아직 중복확인 안 함)
  })();

  const handleCheckNickname = async () => {
    const trimmed = nickname.trim();

    //비어있거나, 확인 완료 됐거나, 요청중이라면 -> 종료
    if (!trimmed || isChecked || isChecking) return;

    // 완성되지 않은 한글(자모만 남은 경우 등)이면 서버로 보내지 않음
    // 이 경우 화면에는 hasInvalidChar 또는 typing 상태가 그대로 보임
    if (!STRICT_PATTERN.test(trimmed)) {
      setIsTooLong(false);
      setNickname(trimmed); // 앞뒤 공백이 있었다면 정리
      setHasServerError(false);
      return;
    }

    try {
      setIsChecking(true); //확인중
      //중복 여부 조회
      const { available } = await checkNickname({ nickname: nickname?.trim() });
      setIsChecked(available);
      setIsDuplicate(!available); //중복은 아님
      setHasServerError(false); //서버에러도 아님
    } catch (error) {
      console.error('닉네임 확인 실패', error);
      setIsChecked(false);
      setIsDuplicate(false);
      setHasServerError(true);
    } finally {
      setIsChecking(false); //확인중 상태 해제
    }
  };

  const handleSignup = async () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    if (!isChecked) {
      alert('닉네임 중복 확인을 해주세요.');
      return;
    }
    try {
      setIsLoading(true);
      //토큰이 없으면 받은 후 가입요청
      if (!hasCsrfToken()) {
        await fetchCsrfToken();
      }
      const result = await signup({ nickname: nickname.trim() });
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
    status === 'invalid' ||
    status === 'error';

  return (
    <div className="flex clamp min-h-screen flex-col items-center overflow-hidden px-4 pt-25">
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
              placeholder={`한글, 영문, 숫자 최대 ${MAX_LENGTH}자`}
              aria-invalid={isError}
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
              {nickname.length}/{MAX_LENGTH}
            </span>
          </div>

          {/* 중복 확인 버튼 */}
          <button
            type="button"
            onClick={handleCheckNickname}
            disabled={isChecked || isChecking}
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
          disabled={isLoading}
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
  );
};

export default SignupPage;
