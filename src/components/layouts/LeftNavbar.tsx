import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

import UserIcon from '../../assets/navbar/user.svg?react';
import HomeIcon from '../../assets/navbar/home.svg?react';
import QuestionIcon from '../../assets/navbar/question.svg?react';
import StoreIcon from '../../assets/navbar/store.svg?react';
import ChartIcon from '../../assets/navbar/chart.svg?react';

import textlogo from '../../assets/logos/coze_text_logo_black.svg';

const menuItems = [
  { to: '/home', label: '홈', icon: HomeIcon },
  { to: '/quiz', label: '문제 풀이', icon: QuestionIcon },
  { to: '/ranking', label: '랭킹', icon: ChartIcon },
  { to: '/mypage', label: '마이페이지', icon: UserIcon },
  { to: '/shop', label: '상점', icon: StoreIcon },
];

const LeftNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const closeMenu = useCallback(() => {
    if (!isVisible) {
      // 진입 애니메이션 시작 전이면 바로 닫기
      setIsMenuOpen(false);
      return;
    }

    // 이미 표시됐다면 퇴장 애니메이션 실행
    setIsVisible(false);
  }, [isVisible]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    //애니메이션 추가
    let secondFrame = 0;

    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });

    const mediaQuery = window.matchMedia('(min-width: 1024px)');

    const handleResize = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsVisible(false);
        setIsMenuOpen(false);
      }
    };

    mediaQuery.addEventListener('change', handleResize);

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      dialog.close();
      document.body.style.overflow = previousOverflow;
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, [isMenuOpen]);

  // 사이드바와 모바일 메뉴에서 같은 목록을 사용해.
  const renderMenu = (isMobile = false) =>
    menuItems.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        end={to === '/home'}
        onClick={isMobile ? closeMenu : undefined}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-lg py-2 ${
            isMobile ? 'text-[22px]' : 'text-[18px]'
          } ${isActive ? 'font-bold text-blue-60' : 'text-gray-60'}`
        }
      >
        <Icon aria-hidden="true" className="size-4.5 shrink-0" />
        <span>{label}</span>
      </NavLink>
    ));

  return (
    <>
      <aside className="sticky top-0 hidden h-dvh w-49.5 shrink-0 flex-col gap-6.5 overflow-y-auto border-r border-gray-20 px-4.5 py-8 lg:flex">
        <Link to="/home">
          <img src={textlogo} alt="COZ:E" />
        </Link>

        <nav aria-label="주 메뉴" className="flex flex-col gap-5">
          {renderMenu()}
        </nav>
      </aside>

      <button
        type="button"
        aria-label="메뉴 열기"
        aria-haspopup="dialog"
        aria-expanded={isMenuOpen}
        onClick={() => {
          setIsMenuOpen(true);
        }}
        className="fixed top-4 left-4 z-40 flex size-11 cursor-pointer items-center justify-center rounded-xl text-gray-60  lg:hidden"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="size-6"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isMenuOpen && (
        <dialog
          ref={dialogRef}
          aria-label="전체 메뉴"
          onCancel={(event) => {
            event.preventDefault();
            closeMenu();
          }}

          className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 backdrop:bg-transparent lg:hidden"
        >
          <div
            onTransitionEnd={(event) => {
              if (
                event.target === event.currentTarget &&
                (event.propertyName === 'translate' ||
                  event.propertyName === 'transform') &&
                !isVisible
              ) {
                setIsMenuOpen(false);
              }
            }}
            className={`flex h-full w-full flex-col overflow-y-auto bg-white px-6 py-6 text-gray-60 transition-transform duration-300 ease-in-out motion-reduce:duration-[1ms] ${
              isVisible ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between">
              <Link to="/home" onClick={closeMenu}>
                <img src={textlogo} alt="COZ:E" className="w-32" />
              </Link>

              <button
                type="button"
                aria-label="메뉴 닫기"
                onClick={closeMenu}
                className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-gray-05"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="size-6"
                >
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <nav aria-label="주 메뉴" className="mt-12 flex flex-col gap-5">
              {renderMenu(true)}
            </nav>
          </div>
        </dialog>
      )}
    </>
  );
};

export default LeftNavbar;
