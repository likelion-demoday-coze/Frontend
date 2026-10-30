import { useNavigate } from 'react-router-dom';
import logo from '../assets/logos/coze_text_logo_black.svg';
import sadCat from '../assets/character/stand_sad_cat.svg';
import { ROUTES } from '../constants/routes';
import useAuthstore from '../stores/useAuthStore';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const member = useAuthstore((state) => state.member);
  const isInitialized = useAuthstore((state) => state.isInitialized);

  return (
    <div className="flex min-h-dvh flex-col bg-[#fafcfe]">
      <header className="flex h-16 shrink-0 items-center border-b border-gray-20 bg-white px-6 sm:px-9">
        <img src={logo} alt="COZ:E" className="h-auto w-27" />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-300 text-center">
          <div className="relative mx-auto h-[clamp(220px,34vw,490px)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center text-[clamp(140px,40vw,600px)] leading-none font-bold tracking-[-0.04em] text-blue-05 select-none"
            >
              404
            </div>
            <p className="absolute top-0 left-1/2 z-10 -translate-x-1/2 rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold whitespace-nowrap text-white sm:px-4 sm:py-2.5 sm:text-base">
              길을 잃었다 냥..
            </p>
            <img
              src={sadCat}
              alt="길을 잃어 슬픈 고양이"
              className="absolute top-1/2 left-1/2 size-[clamp(160px,24vw,340px)] -translate-x-1/2 -translate-y-1/2 object-contain"
            />
          </div>

          <h1 className="relative mt-2 text-[22px] font-bold break-keep text-black sm:text-[28px]">
            페이지를 찾을 수 없어요
          </h1>
          <p className="mt-2 text-sm font-medium break-keep text-gray-60 sm:text-lg">
            주소가 바뀌었거나 없는 페이지예요.
          </p>
          <button
            type="button"
            disabled={!isInitialized}
            onClick={() =>
              navigate(member ? ROUTES.HOME : ROUTES.LANDING, { replace: true })
            }
            className="mt-8 h-14 w-40 cursor-pointer rounded-[14px] bg-blue-60 text-base font-semibold text-white disabled:cursor-wait disabled:opacity-50 sm:mt-10 sm:h-17 sm:w-45 sm:text-xl"
          >
            홈으로
          </button>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;
