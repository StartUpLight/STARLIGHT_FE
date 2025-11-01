'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

const OAuthSuccessPage = () => {
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
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                login();
            }
            router.push('/');
        } catch (error) {
            console.error('토큰 저장 에러:', error);
            router.push('/');
        }
    }, [searchParams, router, login]);

    return null;
};

export default OAuthSuccessPage;

