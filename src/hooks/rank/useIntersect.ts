// 이 요소가 화면에 보이면 알려달라는 훅
import { useEffect, useRef } from 'react';

//onIntersect : 요소가 보였을 때 실행할 함수 (예: 다음 20개 불러오기)
//enabled : false면 감시를 멈춤 (예: 다음 페이지가 없거나 에러일 때)
//watch : 이 값이 바뀔 때마다 감시를 다시 시작함 (아래 설명 참고)
export const useIntersect = (
  onIntersect: () => void,
  enabled: boolean,
  watch: number
) => {
  //감시할 요소
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    //요소가 아직 없거나 감시할 필요가 없다 -> 아무것도 안함
    if (!element || !enabled) return;

    //IntersectionObserver: 브라우저가 제공하는 "요소가 화면에 보이는지" 감시자(즉, 스크롤을 내렸는가 안내렷는가를 체크)
    const observer = new IntersectionObserver(
      ([entry]) => {
        //요소가 보이는 영역에 들어왔을 때만 실행하기
        if (entry.isIntersecting) onIntersect();
      },
      //스크롤이 바닥에 닿기 전에 미리 실행 -> 스크롤이 끊기지 않음
      { rootMargin: '200px' }
    );
    observer.observe(element);

    //화면을 벗어나거나 값이 바뀜 -> 감시를 끝냄
    return () => observer.disconnect();
  }, [onIntersect, enabled, watch]);

  return ref;
};
