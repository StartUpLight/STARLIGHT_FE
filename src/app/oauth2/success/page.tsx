'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { LOGIN_REDIRECT_KEY } from '@/lib/business/authKeys';

const OAuthSuccessContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuthStore();

    useEffect(() => {
        const accessToken = searchParams.get('access');
        const refreshToken = searchParams.get('refresh');

        if (!accessToken || !refreshToken) {
            console.error('토큰을 받지 못했습니다.');
            router.push('/');
            return;
        }

        const redirectToStoredPath = () => {
            if (typeof window === 'undefined') {
                router.push('/');
                return;
            }
            const storedPath = sessionStorage.getItem(LOGIN_REDIRECT_KEY);
            if (storedPath) {
                sessionStorage.removeItem(LOGIN_REDIRECT_KEY);
                router.push(storedPath);
            } else {
                router.push('/');
            }
        };

        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                login();
            }
            redirectToStoredPath();
        } catch (error) {
            console.error('토큰 저장 에러:', error);
            router.push('/');
        }
    }, [searchParams, router, login]);

    return null;
};

const OAuthSuccessPage = () => {
    return (
        <Suspense fallback={null}>
            <OAuthSuccessContent />
        </Suspense>
    );
};

export default OAuthSuccessPage;

