import { useEffect, useState } from 'react';
import MyAssets from '../components/mypage/MyAssets';
import MyRecords from '../components/mypage/MyRecords';
import PassCard from '../components/mypage/PassCard';
import ProfileCard from '../components/mypage/ProfileCard';
import UsageHistory from '../components/mypage/UsageHistory';
import { getMyPage } from '../api/member';
import { getCurrentPass } from '../api/pass';
import type { MyPage as MyPageData } from '../types/member';
import type { mypass } from '../types/pass';

const MyPage = () => {
  const [data, setData] = useState<MyPageData | null>(null);
  const [pass, setPass] = useState<mypass | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let ignore = false;
    Promise.all([getMyPage(), getCurrentPass().catch(() => null)])
      .then(([myPage, currentPass]) => {
        if (ignore) return;
        setData(myPage);
        setPass(currentPass);
      })
      .catch((error) => {
        console.error('마이페이지 조회 실패', error);
        if (!ignore) setIsError(true);
      });
    return () => {
      ignore = true;
    };
  }, []);

  if (!data) {
    return (
      <p className="text-base text-gray-60">
        {isError
          ? '정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
          : '불러오는 중...'}
      </p>
    );
  }

  const { profile } = data;
  const activePass = pass?.active ? pass.pass : null;

  return (
    <div className="flex flex-col gap-6 lg:gap-9">
      <h1 className="text-2xl leading-9 font-semibold text-black lg:text-[28px]">
        마이페이지
      </h1>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex w-full flex-col gap-6 lg:w-172">
          <ProfileCard
            nickname={profile.nickname}
            joinedDays={profile.joinedDays}
            characterStage={profile.characterStage}
            isPass={profile.passActive}
            onEditNickname={() => {
              //TODO: 닉네임 변경 팝업 연결
            }}
          />
          {activePass && (
            <PassCard
              startedAt={activePass.startedAt}
              expiresAt={activePass.expiresAt}
            />
          )}
          <MyAssets assets={data.assets} isPass={profile.passActive} />
          <MyRecords records={data.records} />
          <UsageHistory />
        </div>
      </div>
    </div>
  );
};

export default MyPage;
