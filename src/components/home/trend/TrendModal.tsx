import { useState, useEffect, useRef, useId } from 'react';
import type {
  EconomicTrendItem,
  EconomicTrendDetail,
} from '../../../types/trend';
import { getEconomicTrendDetail } from '../../../api/trend';
import CrossIcon from '../../../assets/signup/cross.svg?react';
import info from '../../../assets/home/info.svg';

interface TrendModalProps {
  items: EconomicTrendItem[]; // 트렌드 3개
  initialIndex: number; // 처음 열 카드의 위치: 0, 1, 2
  onClose: () => void; // 모달 닫기
}

const TrendModal = ({ items, initialIndex, onClose }: TrendModalProps) => {
  //모달 관련 함수 호출 시 사용
  const dialogRef = useRef<HTMLDialogElement>(null);
  //모달 제목에 붙일 id -> 스크린 리더에 사용
  const titleId = useId();
  const [index, setIndex] = useState(initialIndex);
  const [detail, setDetail] = useState<EconomicTrendDetail | null>(null);

  // loading: 요청 중 / done: 성공 / error: 실패
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');
  //같은 트렌드의 조회를 다시 실행하기 위한 숫자 -> 재시도 버튼 누르면 증가, 조회 effect 재실행
  const [retryCount, setRetryCount] = useState(0);

  //API 요청에 사용
  const trendId = items[index].trendId;
  //index가 2개면 마지막트랜드(총3개)
  const isLast = index === 2;

  //모달을 처음 켰을 때 실행
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();

    //원래 스크롤 설정 기억 -> 모달 닫을 때 사용
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    getEconomicTrendDetail(trendId)
      .then((res) => {
        if (ignore) return;

        setDetail(res);
        setStatus('done');
      })
      .catch(() => {
        if (!ignore) setStatus('error');
      });
    return () => {
      ignore = true;
    };
  }, [trendId, retryCount]);

  //다음 트랜드 보기 or 닫기
  const handleNext = () => {
    if (isLast) {
      onClose();
      return;
    }
    setStatus('loading');
    setIndex((previous) => previous + 1);
    dialogRef.current?.scrollTo({ top: 0 });
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      //esc누르면 닫힘
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      // 화면보다 커지면 모달 내부에서 스크롤
      className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-4xl overflow-y-auto rounded-4xl border-0 bg-white p-6 text-gray-60 backdrop:bg-black/45 md:p-12"
    >
      <div className="mb-8 flex items-center gap-4">
        <span className="rounded-xl border w-14 h-8 border-blue-60 bg-blue-05 px-3 py-2 text-[16px] text-blue-60 flex items-center justify-center">
          {index + 1}/3
        </span>

        {/* TODO 트렌드 받아오기 */}
        <span className="font-semibold text-[16px]">경제 트렌드</span>

        <button
          type="button"
          aria-label="경제 트렌드 닫기"
          onClick={onClose}
          className="ml-auto grid size-7 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-gray-20 p-0 leading-none"
        >
          <CrossIcon aria-hidden className={`h-4 w-4 shrink-0 `} />
        </button>
      </div>

      {/* 제목은 목록 API에서 이미 받았으므로 로딩 중에도 표시 */}
      <h2 id={titleId} className="text-[24px] font-semibold text-black">
        {items[index].title}
      </h2>

      {/* 상세 데이터를 기다리는 동안 표시 */}
      {status === 'loading' && (
        <p role="status" className="py-20 text-center">
          불러오는 중...
        </p>
      )}

      {/* 상세 조회 실패 시 표시 */}
      {status === 'error' && (
        <div className="py-20 text-center">
          <p>트렌드 상세 정보를 불러오지 못했어요.</p>
        </div>
      )}

      {/* 조회 성공 + 상세 데이터가 있을 때만 본문 표시 */}
      {status === 'done' && detail && (
        <>
          {/* 콘텐츠 기준 날짜*/}
          <p className="mt-2">{detail.contentDate.replace(/-/g, '.')}.</p>

          <div className="mt-6 grid gap-8 md:grid-cols-[1.5fr_1fr]">
            <div className="flex flex-col">
              <h3 className="mb-3 text-[16px] font-semibold text-black">
                핵심 요약
              </h3>

              <p className="whitespace-pre-line text-lg leading-9">
                {detail.summary}
              </p>

              <div className="mt-auto pt-12">
                <p className="mb-4 text-[14px] text-gray-30 flex gap-1 items-center">
                  <img src={info} alt="" className="size-5" />
                  <span className="relative top-px">
                    라이너 API로 아래 기사 {detail.references.length}건을
                    종합했어요.
                  </span>
                </p>

                <ul className="space-y-2">
                  {detail.references.map((reference, referenceIndex) => (
                    <li key={`${reference.url}-${referenceIndex}`}>
                      <a
                        href={reference.url}
                        //원문 기사는 새 탭에서 염
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 rounded-lg bg-gray-05 px-5 py-1 text-sm"
                      >
                        <span className="shrink-0 font-semibold">
                          {reference.publisher}
                        </span>

                        {/* 긴 기사 제목은 한 줄로 줄이고 말줄임 표시 */}
                        <span className="min-w-0 flex-1 truncate">
                          {reference.title}
                        </span>

                        <span className="text-blue-60">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-[16px] text-[#34373E] font-semibold">
                필수 경제 용어
              </h3>

              {/* dl: 설명 목록 / dt: 용어 / dd: 용어 설명 */}
              <dl>
                {detail.terms.map((term, termIndex) => (
                  <div
                    key={`${term.name}-${termIndex}`}
                    className="border-t border-gray-20 py-4 last:border-b"
                  >
                    <dt className="mb-1.5 font-bold text-blue-60">
                      {term.name}
                    </dt>

                    <dd className="leading-7">{term.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </>
      )}

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          className="cursor-pointer rounded-2xl bg-blue-60 px-6 py-4 text-[18px] font-semibold text-white"
        >
          {isLast ? '닫기' : '다음 트렌드 보기'}
        </button>
      </div>
    </dialog>
  );
};

export default TrendModal;
