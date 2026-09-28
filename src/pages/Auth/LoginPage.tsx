import { startKaKaoLogin } from '../../api/auth';

const LoginPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">로그인</h1>
      <button
        onClick={startKaKaoLogin}
        className="rounded-lg bg-[#FEE500] px-6 py-3 text-base font-medium text-black transition hover:brightness-95"
      >
        카카오로 로그인
      </button>
    </div>
  );
};

export default LoginPage;
