import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LeftNavbar from './LeftNavbar';
import TopBar from './Topbar/Topbar';
import { useMyStreak } from '../../hooks/useMyStreak';
import { getCurrentPass } from '../../api/pass';
import { getFishBalance } from '../../api/fish';
import type { PassOrCash } from '../../types/PassOrCash';

const Layout = () => {
  const streakState = useMyStreak();
  const { pathname } = useLocation();
  const [passOrCash, setPassOrCash] = useState<PassOrCash>({ hasPass: false, status: 'loading' });
  const [fishBalance, setFishBalance] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    getFishBalance().then((balance) => {
      if (active) setFishBalance(balance);
    }).catch(() => {
      if (active) setFishBalance(null);
    });
    return () => { active = false; };
  }, [pathname]);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    const load = async () => {
      try {
        const result = await getCurrentPass();
        if (!active) return;
        const remainingMs = result.pass ? Date.parse(result.pass.expiresAt) - Date.now() : 0;
        if (result.active && result.pass?.status === 'ACTIVE' && remainingMs > 0) {
          // 남은 24시간 단위로 올림. 다음 일수 변경 시점에 다시 조회
          const dayMs = 24 * 60 * 60 * 1000;
          const remainingDays = Math.ceil(remainingMs / dayMs);
          setPassOrCash({ hasPass: true, remainingDays });
          timer = setTimeout(load, remainingMs - (remainingDays - 1) * dayMs + 100);
        } else {
          setPassOrCash({ hasPass: false, status: 'inactive' });
        }
      } catch {
        if (active) setPassOrCash({ hasPass: false, status: 'error' });
      }
    };
    void load();
    return () => { active = false; clearTimeout(timer); };
  }, [pathname]);
  return (
    <div className="flex min-h-screen">
      <LeftNavbar />
      <div className="flex-1 overflow-x-hidden">
        {/* 본문 틀: 폭 제한 + 가운데 + 공통 패딩 */}
        <div className="relative mx-auto w-full max-w-360 px-6 pt-16 pb-10">
          <div className="absolute top-16 right-33.25">
            <TopBar
              streakDays={streakState.streak?.currentStreak ?? null}
              fishBalance={fishBalance}
              passOrCash={passOrCash}
            />
          </div>
          <main>
            <Outlet context={streakState} />
          </main>
        </div>
      </div>
    </div>
  );
};
export default Layout;
