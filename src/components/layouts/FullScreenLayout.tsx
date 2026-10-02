import { Outlet } from 'react-router-dom';
import textlogo from '../../assets/logos/coze_text_logo_black.svg';

//GNB·상태 위젯 없이 로고만 있는 전체 화면 레이아웃
//카테고리 선택, 정규장 결과 정산, 타임어택 종료 화면에서 사용
const FullScreenLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-05">
      <header className="flex h-14 shrink-0 items-center border-b border-gray-10 bg-white px-4 lg:h-16 lg:px-10">
        <img src={textlogo} alt="COZ:E" className="h-7 w-auto lg:h-8" />
      </header>
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default FullScreenLayout;
