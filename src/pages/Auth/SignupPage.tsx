import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup, checkNickname } from '../../api/auth';
import { fetchCsrfToken, hasCsrfToken } from '../../api/axiosInstance';
import useAuthstore from '../../stores/useAuthStore';

const SignupPage = () => {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  //카카오 로그인 후 페이지 리로드 시 메모리 csrf토큰 사라짐 -> 다시 받음

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  //닉네임이 바뀌고있으면 이전 결과를 뮤효
  const handleChange = (value: string) => {
    setNickname(value);
    setIsChecked(false);
    setMessage('');
  };

  const handleCheckNickname = async () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    try {
      const { available } = await checkNickname({ nickname: nickname?.trim() });
      setIsChecked(available);
      setMessage(
        available
          ? '사용 가능한 닉네임 입니다.'
          : '이미 사용중인 닉네임 입니다.'
      );
    } catch (error) {
      console.error('닉네임 확인 실패', error);
      setIsChecked(false);
      setMessage('확인 중 오류 발생');
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
      navigate('/');
    } catch (error) {
      console.error('회원가입 실패', error);
      alert('회원가입에 실패하였습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">회원가입</h1>
      <div className="flex gap-2">
        <input
          type="text"
          value={nickname}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="닉네임"
          className="w-64 rounded-lg border border-gray-300 px-4 py-3"
        />
        <button
          onClick={handleCheckNickname}
          className="rounded-lg border border-gray-300 px-4 py-3"
        >
          중복 확인
        </button>
      </div>
      {message && (
        <p className={isChecked ? 'text-green-600' : 'text-red-500'}>
          {message}
        </p>
      )}
      <button
        onClick={handleSignup}
        disabled={isLoading}
        className="rounded-lg bg-[#FEE500] px-6 py-3 text-base font-medium text-black transition hover:brightness-95 disabled:opacity-50"
      >
        {isLoading ? '가입 중...' : '회원가입 하기'}
      </button>
    </div>
  );
};

export default SignupPage;
