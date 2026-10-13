import QuizDialog from './QuizDialog';
import { QUIZ_CATEGORY_INFO } from '../../constants/quizCategory';
import type { ActiveQuizSession } from '../../types/quiz';

interface ResumeQuizModalProps {
  session: ActiveQuizSession;
  onClose: () => void;
  onResume: () => void;
}

const formatTime = (dateTime: string) => {
  const date = new Date(dateTime);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

//정규장 이어 풀기 팝업
const ResumeQuizModal = ({
  session,
  onClose,
  onResume,
}: ResumeQuizModalProps) => {
  const { label, icon } = QUIZ_CATEGORY_INFO[session.category];

  return (
    <QuizDialog
      icon={icon}
      title="진행 중인 학습이 있어요"
      description="이어서 풀면 생선이 추가로 차감되지 않아요."
      secondary={{ label: '닫기', onClick: onClose }}
      primary={{ label: '이어서 풀기', onClick: onResume }}
      onClose={onClose}
    >
      <dl className="flex w-full flex-col gap-2 rounded-lg bg-blue-05 px-5 py-2.25 text-sm leading-4.5 font-bold">
        <div className="flex items-center justify-between gap-2 border-b border-gray-20 pb-2">
          <dt className="text-gray-60">카테고리</dt>
          <dd className="text-gray-80">{label}</dd>
        </div>
        <div className="flex items-center justify-between gap-2 border-b border-gray-20 pb-2">
          <dt className="text-gray-60">진행</dt>
          <dd className="text-blue-60">
            {session.answeredCount}/{session.totalQuestionCount}문제
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="text-gray-60">이어풀기</dt>
          <dd className="font-semibold text-red-55">
            오늘 {formatTime(session.expiresAt)}까지
          </dd>
        </div>
      </dl>
    </QuizDialog>
  );
};

export default ResumeQuizModal;
