'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const KakaoCallbackPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // 에러 처리
        if (error) {
            console.error('카카오 로그인 에러:', error, errorDescription);
            setErrorMessage(errorDescription || error);
            setStatus('error');
            setTimeout(() => {
                router.push('/');
            }, 3000);
            return;
        }

        // 인증 코드가 없으면 에러
        if (!code) {
            console.error('인증 코드가 없습니다.');
            setErrorMessage('인증 코드를 받지 못했습니다.');
            setStatus('error');
            setTimeout(() => {
                router.push('/');
            }, 3000);
            return;
        }

        // state 검증 (CSRF 공격 방지)
        if (typeof window !== 'undefined') {
            const savedState = sessionStorage.getItem('kakao_oauth_state');
            const decodedState = state ? decodeURIComponent(state) : null;

            if (decodedState && savedState && decodedState !== savedState) {
                console.error('state 불일치 - CSRF 공격 가능성');
                setErrorMessage('보안 검증에 실패했습니다.');
                setStatus('error');
                setTimeout(() => {
                    router.push('/');
                }, 3000);
                return;
            }
            if (savedState) {
                sessionStorage.removeItem('kakao_oauth_state');
            }
        }

        // 백엔드 API로 인증 코드 전송하여 토큰 받아오기
        const handleTokenRequest = async () => {
            try {
                // 백엔드 API 엔드포인트 호출
                // TODO: 실제 백엔드 API 엔드포인트 URL로 변경
                const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;

                const response = await fetch(`${backendUrl}/api/auth/kakao`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        code,
                        state: state ? decodeURIComponent(state) : null,
                        redirectUri: 'http://localhost:3000/login/oauth2/code/kakao'
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: '로그인 실패' }));
                    throw new Error(errorData.message || `서버 오류: ${response.status}`);
                }

                const data = await response.json();

                // 토큰 저장
                if (data.accessToken) {
                    localStorage.setItem('accessToken', data.accessToken);
                }
                if (data.refreshToken) {
                    localStorage.setItem('refreshToken', data.refreshToken);
                }

                // 사용자 정보 저장 (있는 경우)
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }

                setStatus('success');

                // 로그인 처리 후 홈으로 이동
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            } catch (error) {
                console.error('토큰 요청 에러:', error);
                setErrorMessage(error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.');
                setStatus('error');
                setTimeout(() => {
                    router.push('/');
                }, 3000);
            }
        };

        handleTokenRequest();
    }, [searchParams, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="text-center">
                {status === 'loading' && (
                    <>
                        <div className="mb-4 text-lg font-medium text-gray-900">
                            카카오 로그인 처리 중...
                        </div>
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <div className="mb-4 text-lg font-medium text-primary-500">
                            로그인 성공!
                        </div>
                        <div className="ds-text font-medium text-gray-600">
                            홈으로 이동합니다...
                        </div>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <div className="mb-4 text-lg font-medium text-red-500">
                            로그인 실패
                        </div>
                        {errorMessage && (
                            <div className="ds-text font-medium text-gray-600 mb-2">
                                {errorMessage}
                            </div>
                        )}
                        <div className="ds-text font-medium text-gray-600">
                            홈으로 이동합니다...
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default KakaoCallbackPage;

