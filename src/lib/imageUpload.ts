import axios from 'axios';

// 이미지 업로드 공통 함수
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const accessToken = localStorage.getItem('accessToken');
    // const fileName = file.name;

    const fileExtension = file.name.split('.').pop() || '';
    const newFileName = `${generateShortId()}.${fileExtension}`;
    // 한글 파일명의 경우 인코딩을 한 번 더 적용
    // const encodedFileName = encodeURIComponent(fileName);

    const uploadUrlResponse = await axios.get(
      `${apiUrl}/v1/images/upload-url`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          fileName: newFileName,
        },
      }
    );

    if (
      uploadUrlResponse.data.result !== 'SUCCESS' ||
      !uploadUrlResponse.data.data?.preSignedUrl
    ) {
      throw new Error('presigned URL을 받지 못했습니다.');
    }

    const { preSignedUrl, objectUrl } = uploadUrlResponse.data.data;

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
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
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

/**
 * 짧은 고유 ID 생성 함수 (Nanoid 스타일)
 * 영문 대소문자 + 숫자로 구성된 랜덤 문자열 반환
 * @param length 생성할 문자열 길이 (기본값 10자)
 */
const generateShortId = (length: number = 10): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};
