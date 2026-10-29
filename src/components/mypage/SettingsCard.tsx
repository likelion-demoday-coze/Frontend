import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowIcon from '../../assets/icons/arrow.svg?react';
import catSad from '../../assets/character/quiz_cat_sad.png';
import { logout, withdraw } from '../../api/auth';
import { clearCsrfToken } from '../../api/axiosInstance';
import { POLICY_URL, SUPPORT_URL } from '../../constants/support';
import { ROUTES } from '../../constants/routes';
import useAuthStore from '../../stores/useAuthStore';
import QuizDialog from '../quiz/QuizDialog';
import TutorialModal from '../tutorial/TutorialModal';

interface SettingsCardProps {
  memberId: number;
}

const rowStyle =
  'flex w-full items-center justify-between border-b border-gray-20 py-3.5 text-left text-base font-medium text-gray-80';

const ExternalIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4 text-gray-40"
  >
    <path d="M13.25 9v4.25H2.75V2.75H7M10.75 2.75h2.5v2.5M8 8l5-5" />
  </svg>
);

const ExternalRow = ({ label, href }: { label: string; href: string }) =>
  href ? (
    <a href={href} target="_blank" rel="noreferrer" className={rowStyle}>
      {label}
      <ExternalIcon />
    </a>
  ) : (
    <span className={`${rowStyle} text-gray-40`}>
      {label}
      <span className="text-xs">준비 중</span>
    </span>
  );

//마이페이지 설정·지원 카드
const SettingsCard = ({ memberId }: SettingsCardProps) => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const leave = () => {
    clearAuth();
    navigate(ROUTES.LANDING, { replace: true });
  };

  const handleLogout = async () => {
    if (isPending) return;
    setIsPending(true);
    try {
      await logout();
      leave();
    } catch (error) {
      console.error('로그아웃 실패', error);
      setIsPending(false);
      alert('로그아웃에 실패했어요. 잠시 후 다시 시도해 주세요.');
    }
  };

  const handleWithdraw = async () => {
    if (isPending) return;
    setIsPending(true);
    try {
      await withdraw();
      clearCsrfToken();
      leave();
    } catch (error) {
      console.error('회원 탈퇴 실패', error);
      setIsPending(false);
      alert('회원 탈퇴에 실패했어요. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <section className="flex w-full flex-col gap-2 rounded-2xl border border-gray-20 bg-white px-5 py-5 lg:w-70">
      <h2 className="text-xl font-semibold text-black">설정 · 지원</h2>
      <div className="flex flex-col">
        <button
          type="button"
          onClick={() => setIsTutorialOpen(true)}
          className={`${rowStyle} cursor-pointer`}
        >
          서비스 이용안내 다시 보기
          <ArrowIcon aria-hidden="true" className="h-4 w-2 text-gray-40" />
        </button>
        <ExternalRow label="고객 문의" href={SUPPORT_URL} />
        <ExternalRow label="약관 및 정책" href={POLICY_URL} />
        <button
          type="button"
          onClick={handleLogout}
          disabled={isPending}
          className={`${rowStyle} cursor-pointer disabled:cursor-default`}
        >
          로그아웃
        </button>
        <div className="flex items-center justify-between pt-5 text-sm font-semibold text-gray-40">
          <button
            type="button"
            onClick={() => setIsWithdrawOpen(true)}
            className="cursor-pointer underline underline-offset-2"
          >
            회원 탈퇴하기
          </button>
          <span>회원 번호 {memberId}</span>
        </div>
      </div>
      {isTutorialOpen && (
        <TutorialModal
          onClose={() => setIsTutorialOpen(false)}
          onComplete={() => setIsTutorialOpen(false)}
        />
      )}
      {isWithdrawOpen && (
        <QuizDialog
          icon={catSad}
          title="정말 탈퇴할까요?"
          description={
            '탈퇴하면 주가, FISH, 연속 학습 기록이 모두 사라지고\n다시 되돌릴 수 없어요.'
          }
          secondary={{
            label: '탈퇴하기',
            onClick: handleWithdraw,
            disabled: isPending,
          }}
          primary={{
            label: '계속 이용하기',
            onClick: () => setIsWithdrawOpen(false),
          }}
          onClose={() => setIsWithdrawOpen(false)}
        />
      )}
    </section>
  );
};

export default SettingsCard;
