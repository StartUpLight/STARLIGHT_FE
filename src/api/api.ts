import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// refresh 토큰 재발급 요청을 단일화하기 위한 Promise 추적
let refreshTokenPromise: Promise<string> | null = null;

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 요청 취소 에러는 그대로 전파 (정상적인 취소이므로 처리하지 않음)
    if (error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError' || error?.message?.includes('canceled')) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // 401 에러이고, 재시도 플래그가 없을 때만 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          try {
            // 재발급이 이미 진행 중이면 기존 Promise를 재사용
            if (!refreshTokenPromise) {
              refreshTokenPromise = (async () => {
                try {
                  // refreshToken으로 새로운 accessToken 재발급
                  const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/v1/auth/recreate`,
                    {
                      headers: {
                        Authorization: `Bearer ${refreshToken}`,
                      },
                    }
                  );

                  const responseData = response.data?.data ?? response.data;
                  const newAccessToken = responseData?.accessToken || responseData?.access;

                  if (newAccessToken) {
                    localStorage.setItem('accessToken', newAccessToken);
                    if (responseData?.refreshToken || responseData?.refresh) {
                      localStorage.setItem('refreshToken', responseData?.refreshToken || responseData?.refresh);
                    }
                    return newAccessToken;
                  }
                  throw new Error('새로운 accessToken을 받지 못했습니다.');
                } catch (refreshError) {
                  // refreshToken도 만료되었거나 재발급 실패
                  console.error('토큰 재발급 실패:', refreshError);
                  localStorage.removeItem('accessToken');
                  localStorage.removeItem('refreshToken');
                  throw refreshError;
                } finally {
                  // 재발급 완료 후 Promise 초기화 (성공/실패 관계없이)
                  refreshTokenPromise = null;
                }
              })();
            }

            // 재발급 완료 대기 (진행 중이면 기존 Promise 재사용)
            const newAccessToken = await refreshTokenPromise;

            // 새 토큰으로 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            // 재발급 실패 시 에러 반환
            return Promise.reject(refreshError);
          }
        }
      }

      console.error('인증이 만료되었습니다. 다시 로그인하세요.');
    }
    return Promise.reject(error);
  }
);

export default api;
