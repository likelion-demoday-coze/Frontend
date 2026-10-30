import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowIcon from '../../assets/icons/arrow.svg?react';
import LinkIcon from '../../assets/icons/link.svg?react';
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
  'flex w-full items-center justify-between border-b border-gray-20 py-3.5 text-left text-sm font-medium text-gray-80 lg:text-base';

const ExternalRow = ({ label, href }: { label: string; href: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={rowStyle}>
    {label}
    <LinkIcon aria-hidden="true" className="size-3.25 shrink-0" />
  </a>
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
    <section className="flex w-full flex-col gap-4 lg:w-70 lg:gap-2 lg:rounded-2xl lg:border lg:border-gray-20 lg:bg-white lg:px-5 lg:py-5">
      <h2 className="text-lg font-semibold text-black lg:text-xl">
        설정 · 지원
      </h2>
      <div className="flex flex-col rounded-[20px] border border-gray-20 bg-white px-4 py-1 lg:rounded-none lg:border-0 lg:p-0">
        <button
          type="button"
          onClick={() => setIsTutorialOpen(true)}
          className={`${rowStyle} cursor-pointer`}
        >
          서비스 이용안내 다시 보기
          <ArrowIcon aria-hidden="true" className="h-4 w-2 text-gray-40" />
        </button>
        <ExternalRow label="고객 문의" href={SUPPORT_URL} />
        <ExternalRow label="이용약관" href={POLICY_URL} />
        <button
          type="button"
          onClick={handleLogout}
          disabled={isPending}
          className={`${rowStyle} cursor-pointer disabled:cursor-default`}
        >
          로그아웃
        </button>
        <div className="flex items-center justify-between py-3 text-xs font-semibold text-gray-40 lg:pt-5 lg:pb-0 lg:text-sm">
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
