import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    const originalRequest = error.config;

    // 401 에러이고, 재시도 플래그가 없을 때만 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          try {
            // refreshToken으로 새로운 accessToken 재발급
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_BASE_URL}/v1/auth/recreate`,
              { refreshToken }
            );

            const newAccessToken = response.data.accessToken || response.data.access;

            if (newAccessToken) {
              localStorage.setItem('accessToken', newAccessToken);
              if (response.data.refreshToken || response.data.refresh) {
                localStorage.setItem('refreshToken', response.data.refreshToken || response.data.refresh);
              }
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            // refreshToken도 만료되었거나 재발급 실패
            console.error('토큰 재발급 실패:', refreshError);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
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
