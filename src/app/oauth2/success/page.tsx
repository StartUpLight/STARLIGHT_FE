'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const OAuthSuccessPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

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
            }
            router.push('/');
        } catch (error) {
            console.error('토큰 저장 에러:', error);
            router.push('/');
        }
    }, [searchParams, router]);

    return null;
};

export default OAuthSuccessPage;

