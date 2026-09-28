import axios from 'axios';
import useAuthstore from '../stores/useAuthStore';

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({ baseURL });

//요청 인터셉터 -> accessToken을 자동으로 붙여줌

api.interceptors.request.use(
  (config) => {
    let token = useAuthstore.getState().accessToken;

    //쥬스탠드에 토큰이 없다면 로컬에서 가져오는 코드
    if (!token) {
      try {
        const raw = localStorage.getItem('auth-storage');
        if (raw) {
          const parsed = JSON.parse(raw);
          token = parsed?.state?.accessToken ?? null;
        }
      } catch {
        //실패시 그냥 토근 없는 채로 진행
      }
    }
    //있으면 토큰을 헤더에 추가함
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    //에러를 호출한 곳에 보내줌 -> 나중에 에러메시지 처리
    return Promise.reject(error);
  }
);

//응답 인터셉터 -> 401(토큰 만료) 시에만 자동 재요청, 나머지는 상태코드 별로 로그 처리
api.interceptors.response.use(
  //성공시 응답만 반환
  (response) => response,

  async (error) => {
    //리프레쉬 토큰이 아직 없기 때문에 사용 x -> 추후 주석해제
    /*
    const originalRequest = error.config;

    //401에러이고, 재시도를 한 번 했다면 -> 토큰 만료
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthstore.getState().refreshToken;

        if (!refreshToken) {
          throw new Error('리프레쉬 토큰이 없습니다.');
        }

        const refreshResponse = await axios.post(
          `${baseURL}/api/v1/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = refreshResponse.data.result?.accessToken;

        if (newAccessToken) {
          useAuthstore.setState({ accessToken: newAccessToken });

          //리프레쉬 토큰도 교체
          const newRefreshToken = refreshResponse.data.result?.refreshToken;

          if (newRefreshToken) {
            useAuthstore.setState({ refreshToken: newRefreshToken });
          }

          //실패했던 원래 요청 헤더 토크 ㄴ교체
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        //리프레쉬 토큰도 만료되면 -> 강제 로그아웃
        console.error('토큰 재발급 실패, 로그아웃');
        useAuthstore.getState().clearAuth();

        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch {}

        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }*/

    //임시 401에러 처리
    if (error.response?.status === 401) {
      console.warn('인증 만료 (401) - refresh API 미구현 상태');
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
