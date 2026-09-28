//공통 통신 설정
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({ baseURL, withCredentials: true });

//CSRF 토큰 캐싱용 -> 최초 진입/로그인 직후 한 번 받아서 보관, 이후 요청마다 재사용
let csrfToken: string | null = null;
let csrfHeaderName: string | null = null;

//토큰 조회 함수 -> 앱 최초 진입/로그인 성공/세선 만료 후 재로그인시
export async function fetchCsrfToken() {
  const { data } = await axios.get(`${baseURL}/api/v1/auth/csrf`, {
    withCredentials: true,
  });
  csrfToken = data.result.token;
  csrfHeaderName = data.result.headerName;
}

// axiosInstance.ts에 추가
export function hasCsrfToken() {
  return !!csrfToken && !!csrfHeaderName;
}

//CSRF 토큰 초기화 함수
export function clearCsrfToken() {
  csrfToken = null;
  csrfHeaderName = null;
}

//요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const safeMethods = ['get', 'head', 'options'];
    const method = config.method?.toLowerCase();

    //안전한 메서드가 아니고,  토큰과 헤더 이름이 모두 준비되어있을떄
    if (
      method &&
      !safeMethods.includes(method) &&
      csrfHeaderName &&
      csrfToken
    ) {
      //토큰을 헤더에 붙임
      config.headers[csrfHeaderName] = csrfToken;
    }

    //요청 계속 진행
    return config;
  },
  (error) => {
    //에러를 호출한 곳으로 전송
    return Promise.reject(error);
  }
);

//응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    //임시 401에러 처리
    if (error.response?.status === 401) {
      console.warn('인증 만료 (401) - 재로그인 필요');
      clearCsrfToken();
    }
    //이외 에러 처리
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 400:
          console.warn('잘못된 요청입니다.', error.response.data);
          break;
        case 403:
          console.warn(
            '해당 기능에 접근 가능한 권한이 없습니다',
            error.response.data
          );
          break;
        case 404:
          console.error(
            '요청 URL 경로 또는 해당 데이터가 존재하지 않습니다.',
            error.response.data
          );
          break;
        case 500:
          console.warn(
            '서버에 일시적인 오류가 발생하였습니다.',
            error.response.data
          );
          break;
        default:
          console.error(`서버 오류 발생 (${status})`, error.response.data);
      }
    } else {
      alert('네트워크 연결이 불안정합니다. 인터넷 연결을 확인해 주세요.');
    }
    return Promise.reject(error);
  }
);

export default api;
