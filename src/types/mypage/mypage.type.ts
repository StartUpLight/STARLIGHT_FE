export interface getMemberRequest {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  provider: string;
  profileImageUrl: string;
}
export interface getMemberResponse {
  result: string;
  data: getMemberRequest;
  error: {
    code: string;
    message: string;
  };
}
