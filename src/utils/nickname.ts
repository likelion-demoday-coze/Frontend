//닉네임 확인 기준
export const NICKNAME_MIN = 2;
export const NICKNAME_MAX = 8;

export const LIVE_PATTERN = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]*$/; // 입력 중(조합 중인 자모 허용)
export const STRICT_PATTERN = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]+$/; // 확인/가입용(완성된 글자만)
export const ONLY_DIGITS = /^[0-9]+$/; //숫자는안됨

// 닉네임이 규칙에 맞지 않으면 사용자에게 보여 줄 메시지, 맞으면 null
export const validateNickname = (nickname: string): string | null => {
  if (nickname.length < NICKNAME_MIN || nickname.length > NICKNAME_MAX) {
    return `${NICKNAME_MIN}~${NICKNAME_MAX}자로 입력해 주세요.`;
  }
  if (!STRICT_PATTERN.test(nickname)) {
    return '한글, 영문, 숫자만 사용할 수 있어요.';
  }
  if (ONLY_DIGITS.test(nickname)) {
    return '숫자만으로는 만들 수 없어요.';
  }
  return null;
};
