import { NextRequest, NextResponse } from 'next/server';

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    try {
        const params = await context.params;
        const path = params.path.join('/');
        const body = await request.text();

        // Authorization 헤더 가져오기
        const authorization = request.headers.get('authorization');

        const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${apiBaseUrl}/v1/${path}`;

        console.log('프록시 요청:', {
            method: 'POST',
            url,
            path,
            hasAuth: !!authorization,
        });

        // 요청 바디 파싱하여 출력
        try {
            const bodyJson = JSON.parse(body);
            console.log('요청 바디:', JSON.stringify(bodyJson, null, 2));
        } catch (e) {
            console.log('요청 바디 (텍스트):', body.substring(0, 500));
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(authorization && { Authorization: authorization }),
            },
            body: body,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API 에러:', response.status, errorText);
            return NextResponse.json(
                { error: `API 요청 실패: ${response.status}`, details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('프록시 오류:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        console.error('에러 상세:', { errorMessage, errorStack });
        return NextResponse.json(
            {
                error: '서버 오류가 발생했습니다.',
                details: errorMessage,
            },
            { status: 500 }
        );
    }
}

// GET, PUT, DELETE 등 다른 HTTP 메서드도 지원
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    try {
        const params = await context.params;
        const path = params.path.join('/');
        const authorization = request.headers.get('authorization');
        const searchParams = request.nextUrl.searchParams.toString();

        const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${apiBaseUrl}v1/${path}${searchParams ? `?${searchParams}` : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                ...(authorization && { Authorization: authorization }),
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: `API 요청 실패: ${response.status}`, details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('프록시 오류:', error);
        return NextResponse.json(
            {
                error: '서버 오류가 발생했습니다.',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

