import { useEffect, useState } from 'react';
import MyAssets from '../components/mypage/MyAssets';
import MyRecords from '../components/mypage/MyRecords';
import NicknameModal from '../components/mypage/NicknameModal';
import PassCard from '../components/mypage/PassCard';
import ProfileCard from '../components/mypage/ProfileCard';
import SettingsCard from '../components/mypage/SettingsCard';
import UsageHistory from '../components/mypage/UsageHistory';
import { getMyPage } from '../api/member';
import { getCurrentPass } from '../api/pass';
import useAuthStore from '../stores/useAuthStore';
import type { MyPage as MyPageData } from '../types/member';
import type { mypass } from '../types/pass';

const MyPage = () => {
  const [data, setData] = useState<MyPageData | null>(null);
  const [pass, setPass] = useState<mypass | null>(null);
  const [isError, setIsError] = useState(false);
  const [isNicknameOpen, setIsNicknameOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const setMember = useAuthStore((state) => state.setMember);

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
  }, [reloadKey]);

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
    <div className="flex min-w-0 flex-col gap-6 lg:gap-9">
      <h1 className="text-xl leading-9 font-semibold text-black lg:text-[28px]">
        마이페이지
      </h1>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex w-full min-w-0 flex-col gap-6 lg:w-172">
          <ProfileCard
            nickname={profile.nickname}
            joinedDays={profile.joinedDays}
            characterStage={profile.characterStage}
            isPass={profile.passActive}
            onEditNickname={() => setIsNicknameOpen(true)}
          />
          {activePass && (
            <PassCard
              startedAt={activePass.startedAt}
              expiresAt={activePass.expiresAt}
            />
          )}
          <MyAssets assets={data.assets} isPass={profile.passActive} />
          <MyRecords records={data.records} />
          <UsageHistory onRefunded={() => setReloadKey((prev) => prev + 1)} />
        </div>
        <SettingsCard memberId={profile.memberId} />
      </div>
      {isNicknameOpen && (
        <NicknameModal
          currentNickname={profile.nickname}
          onClose={() => setIsNicknameOpen(false)}
          onChanged={(member) => {
            setMember(member);
            setData({
              ...data,
              profile: { ...profile, nickname: member.nickname },
            });
            setIsNicknameOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default MyPage;
