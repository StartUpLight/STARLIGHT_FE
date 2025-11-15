import axios from 'axios';

// 이미지 업로드 공통 함수
export const uploadImage = async (file: File): Promise<string> => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const accessToken = localStorage.getItem('accessToken');
        const fileName = file.name;

        // 한글 파일명의 경우 인코딩을 한 번 더 적용
        const encodedFileName = encodeURIComponent(fileName);

        const uploadUrlResponse = await axios.get(`${apiUrl}/v1/images/upload-url`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            params: {
                fileName: encodedFileName,
            },
        });

        if (uploadUrlResponse.data.result !== 'SUCCESS' || !uploadUrlResponse.data.data?.preSignedUrl) {
            throw new Error('presigned URL을 받지 못했습니다.');
        }

        const { preSignedUrl, objectUrl } = uploadUrlResponse.data.data;
        console.log(preSignedUrl, objectUrl);

        await axios.put(preSignedUrl, file, {
            headers: {
                'Content-Type': file.type,
            },
        });

        const params = new URLSearchParams();
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

        if (publicResponse.data.result !== 'SUCCESS') {
            throw new Error('공개 처리에 실패했습니다.');
        }
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
