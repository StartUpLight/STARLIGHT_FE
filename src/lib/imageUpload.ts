import axios from 'axios';

// 이미지 업로드 공통 함수
export const uploadImage = async (file: File): Promise<string> => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const accessToken = localStorage.getItem('accessToken');
        // 파일명을 URL 인코딩하여 전송
        const fileName = encodeURIComponent(file.name);

        const uploadUrlResponse = await axios.get(`${apiUrl}/v1/images/upload-url`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            params: {
                fileName,
            },
        });

        //console.log(uploadUrlResponse.data.data);
        if (uploadUrlResponse.data.result !== 'SUCCESS' || !uploadUrlResponse.data.data?.preSignedUrl) {
            throw new Error('presigned URL을 받지 못했습니다.');
        }

        const { preSignedUrl, objectUrl } = uploadUrlResponse.data.data;

        // 2. presigned URL에 이미지 업로드
        // presigned URL도 인코딩된 파일명을 포함할 수 있으므로 그대로 사용
        await axios.put(preSignedUrl, file, {
            headers: {
                'Content-Type': file.type,
            },
        });

        // 3. 공개 처리
        // curl의 --data-urlencode와 동일하게 application/x-www-form-urlencoded 형식으로 전송
        const params = new URLSearchParams();
        // objectUrl도 인코딩하여 전송 (한글 파일명 처리)
        params.append('objectUrl', objectUrl);

        const publicResponse = await axios.post(
            `${apiUrl}/v1/images/upload-url/public`,
            params.toString(),
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                },
            }
        );

        //console.log(publicResponse.data);

        if (publicResponse.data.result !== 'SUCCESS') {
            throw new Error('공개 처리에 실패했습니다.');
        }

        // 공개된 이미지 URL 반환
        // URL에 한글이 포함되어 있을 수 있으므로, 사용 시 인코딩된 경로로 변환
        // 서버에서 반환한 URL이 이미 올바르게 인코딩되어 있다면 그대로 사용
        // 만약 문제가 있다면 URL의 경로 부분만 인코딩 처리
        try {
            const url = new URL(objectUrl);
            // 경로 부분에 한글이 있으면 인코딩
            const encodedPath = url.pathname.split('/').map(segment =>
                encodeURIComponent(decodeURIComponent(segment))
            ).join('/');
            return `${url.origin}${encodedPath}${url.search}${url.hash}`;
        } catch {
            // URL 파싱 실패 시 원본 반환
            return objectUrl;
        }
    } catch (error) {
        console.error('이미지 업로드 오류:', error);
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message ||
                error.message ||
                '이미지 업로드에 실패했습니다.'
            );
        }
        throw error;
    }
};
