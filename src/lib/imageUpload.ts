import axios from 'axios';

// 이미지 업로드 공통 함수
export const uploadImage = async (file: File): Promise<string> => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const accessToken = localStorage.getItem('accessToken');
        const userId = 3; // 임시 userId
        const fileName = file.name;

        const uploadUrlResponse = await axios.get(`${apiUrl}/v1/images/upload-url`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            params: {
                userId,
                fileName,
            },
        });

        console.log(uploadUrlResponse.data.data);
        if (uploadUrlResponse.data.result !== 'SUCCESS' || !uploadUrlResponse.data.data?.preSignedUrl) {
            throw new Error('presigned URL을 받지 못했습니다.');
        }

        const { preSignedUrl, objectUrl } = uploadUrlResponse.data.data;

        // 2. presigned URL에 이미지 업로드
        await axios.put(preSignedUrl, file, {
            headers: {
                'Content-Type': file.type,
            },
        });

        // 3. 공개 처리
        const publicResponse = await axios.post(`${apiUrl}/v1/images/upload-url/public`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            params: {
                objectUrl,
            },
        });

        if (publicResponse.data.result !== 'SUCCESS') {
            throw new Error('공개 처리에 실패했습니다.');
        }

        // 공개된 이미지 URL 반환
        return objectUrl;
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

