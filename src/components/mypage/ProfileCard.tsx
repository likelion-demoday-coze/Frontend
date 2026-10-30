import type { CharacterStage } from '../../types/member';
import { getCharacterImage } from '../../utils/character';

interface ProfileCardProps {
  nickname: string;
  joinedDays: number;
  characterStage: CharacterStage;
  isPass: boolean;
  onEditNickname: () => void;
}

//마이페이지 프로필 카드
const ProfileCard = ({
  nickname,
  joinedDays,
  characterStage,
  isPass,
  onEditNickname,
}: ProfileCardProps) => {
  return (
    <section className="flex items-center justify-between gap-4 rounded-[20px] border border-gray-20 bg-white px-5 py-4 lg:px-8 lg:py-6">
      <div className="flex min-w-0 flex-1 items-center gap-2.5 lg:flex-none lg:gap-6">
        <img
          src={getCharacterImage(characterStage)}
          alt=""
          className="size-17 shrink-0 rounded-[20px] bg-blue-05 object-contain lg:size-25"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1 lg:gap-1.5">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 lg:justify-start">
            <div className="flex items-center gap-3">
              <h2 className="text-lg leading-9 font-bold whitespace-nowrap text-black lg:text-xl">
                {nickname}
              </h2>
              {isPass && (
                <span className="shrink-0 rounded-[20px] bg-blue-50 px-2 py-1 text-xs leading-5.5 font-bold text-blue-05 lg:hidden">
                  PASS
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onEditNickname}
              className="shrink-0 cursor-pointer rounded-lg border border-gray-20 bg-gray-05 px-3 py-1 text-xs leading-5.5 font-bold text-gray-60"
            >
              닉네임 변경
            </button>
          </div>
          <p className="text-xs leading-6.5 font-semibold break-keep text-gray-60 lg:text-sm">
            COZ:E와 함께한 지 {joinedDays}일째 · 카카오 로그인
          </p>
        </div>
      </div>
      {isPass && (
        <span className="hidden shrink-0 rounded-[20px] bg-blue-50 px-2 py-1 text-xs leading-5.5 font-bold text-blue-05 lg:inline">
          PASS
        </span>
      )}
    </section>
  );
};

export default ProfileCard;
