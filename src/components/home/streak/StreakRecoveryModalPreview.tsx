import { useSearchParams } from 'react-router-dom';
import bigHandCat from '../../../assets/character/basic_2.svg';
import basicCat from '../../../assets/character/basic_1.svg';
import { getMockStreak } from '../../../mocks/streakMock';
import StreakRecoveryModal from './StreakRecoveryModal';

// 개발용 예시만 사용. 알림 확인, 구매, 복구 API는 호출하지 않음.
const StreakRecoveryModalPreview = () => {
  const [params, setParams] = useSearchParams();
  const scenario = params.get('recoveryModal');
  if (!import.meta.env.DEV || !scenario || !['ticket', 'fish', 'insufficient', 'expired', 'pass'].includes(scenario)) return null;

  const close = () => {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      next.delete('recoveryModal');
      next.delete('stageDrop');
      return next;
    }, { replace: true });
  };

  return <StreakRecoveryModal
    data={{
      days: getMockStreak(scenario === 'expired' ? 'expired' : 'broken').days,
      expired: scenario === 'expired',
      hasPass: scenario === 'pass',
      ownedTickets: scenario === 'ticket' ? 2 : 0,
      fishBalance: scenario === 'insufficient' ? 80 : 300,
      ticketPrice: 200,
      stockBefore: 142.15,
      stockAfter: 113.72,
      deadlineLabel: '오늘 23:59까지',
      stageDrop: params.get('stageDrop') === '1' ? {
        beforeImage: bigHandCat,
        beforeName: '큰손냥',
        afterImage: basicCat,
        afterName: '초보냥',
        description: '주가가 1,000 아래로 떨어졌어요. 복구하면 큰손냥으로 돌아와요.',
      } : undefined,
    }}
    onClose={close}
    onRestore={() => alert('복구 신청 화면 예시입니다. 실제 복구권과 FISH는 사용되지 않습니다.')}
    onShop={() => alert('상점 이동 버튼 예시입니다.')}
    onQuiz={() => alert('퀴즈 이동 버튼 예시입니다.')}
  />;
};

export default StreakRecoveryModalPreview;
