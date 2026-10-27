import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import textLogo from '../../assets/logos/coze_text_logo_black.svg';
import LeftNavbar from './LeftNavbar';
import MobileTopNav from './MobileTopNav';
import MobileHomeHero from '../home/top/MobileHomeHero';
import { ROUTES } from '../../constants/routes';
import TopBar from './Topbar/Topbar';
import { useMyStreak } from '../../hooks/useMyStreak';
import { getCurrentPass } from '../../api/pass';
import { getFishBalance } from '../../api/fish';
import type { PassOrCash } from '../../types/PassOrCash';

const Layout = () => {
  const streakState = useMyStreak();
  const { pathname } = useLocation();
  const [isMobile, setIsMobile] = useState(
    () => !window.matchMedia('(min-width: 1024px)').matches
  );
  const [passOrCash, setPassOrCash] = useState<PassOrCash>({
    hasPass: false,
    status: 'loading',
  });
  const [fishBalance, setFishBalance] = useState<number | null>(null);
  const mobileTopBarRef = useRef<HTMLDivElement>(null);
  const [mobileTopBarHeight, setMobileTopBarHeight] = useState(68);
  const fishBalanceVersion = useRef(0);
  const updateFishBalance = useCallback((balance: number) => {
    fishBalanceVersion.current += 1;
    setFishBalance(balance);
  }, []);

  useEffect(() => {
    const element = mobileTopBarRef.current;
    if (!isMobile || !element) return;
    const observer = new ResizeObserver(() => {
      setMobileTopBarHeight(Math.ceil(element.getBoundingClientRect().height));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [isMobile]);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const update = (event: MediaQueryListEvent) => setIsMobile(!event.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    let active = true;
    const version = ++fishBalanceVersion.current;
    getFishBalance()
      .then((balance) => {
        if (active && version === fishBalanceVersion.current)
          setFishBalance(balance);
      })
      .catch(() => {
        if (active && version === fishBalanceVersion.current)
          setFishBalance(null);
      });
    return () => {
      active = false;
    };
  }, [pathname]);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    const load = async () => {
      try {
        const result = await getCurrentPass();
        if (!active) return;
        const remainingMs = result.pass
          ? Date.parse(result.pass.expiresAt) - Date.now()
          : 0;
        if (
          result.active &&
          result.pass?.status === 'ACTIVE' &&
          remainingMs > 0
        ) {
          // 남은 24시간 단위로 올림. 다음 일수 변경 시점에 다시 조회
          const dayMs = 24 * 60 * 60 * 1000;
          const remainingDays = Math.ceil(remainingMs / dayMs);
          setPassOrCash({ hasPass: true, remainingDays });
          timer = setTimeout(
            load,
            remainingMs - (remainingDays - 1) * dayMs + 100
          );
        } else {
          setPassOrCash({ hasPass: false, status: 'inactive' });
        }
      } catch {
        if (active) setPassOrCash({ hasPass: false, status: 'error' });
      }
    };
    void load();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [pathname]);
  return (
    <div className="flex min-h-screen">
      <LeftNavbar />
      <div className="min-w-0 flex-1 overflow-x-clip">
        {isMobile && (
          <div
            ref={mobileTopBarRef}
            className={`sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 px-6 py-4 ${pathname === ROUTES.HOME ? 'bg-blue-08' : 'bg-white'}`}
          >
            <Link to={ROUTES.HOME} aria-label="COZ:E 홈" className="shrink-0">
              <img src={textLogo} alt="COZ:E" className="w-21 h-6" />
            </Link>
            <TopBar
              streakDays={streakState.streak?.currentStreak ?? null}
              fishBalance={fishBalance}
              passOrCash={passOrCash}
            />
          </div>
        )}
        {isMobile && pathname === ROUTES.HOME && <MobileHomeHero onBalanceChange={updateFishBalance} />}
        <MobileTopNav topOffset={mobileTopBarHeight} />
        {/* 본문 틀: 폭 제한 + 가운데 + 공통 패딩 */}
        <div className="relative mx-auto w-full max-w-360 px-6 pt-6 pb-10 lg:pt-16">
          <div className="hidden lg:absolute lg:top-16 lg:right-33.25 lg:block">
            <TopBar
              streakDays={streakState.streak?.currentStreak ?? null}
              fishBalance={fishBalance}
              passOrCash={passOrCash}
            />
          </div>
          <main>
            <Outlet context={{ ...streakState, updateFishBalance, isMobile }} />
          </main>
        </div>
      </div>
    </div>
  );
};
export default Layout;
