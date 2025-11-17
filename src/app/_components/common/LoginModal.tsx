'use client';
import React, { useEffect, useState } from 'react';
import CloseIcon from '@/assets/icons/close.svg';
import MainLogo from '@/assets/icons/main_logo.svg';
import Check from '@/assets/icons/white_check.svg';
import Kakao from '@/assets/icons/kakao.svg';
import KakaoActive from '@/assets/icons/kakao_active.svg';
import Naver from '@/assets/icons/naver.svg';
import NaverActive from '@/assets/icons/naver_active.svg';

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
};

const LoginModal = ({ open, onClose }: LoginModalProps) => {
  const [agreeToTerms1, setAgreeToTerms1] = useState(false);
  const [agreeToTerms2, setAgreeToTerms2] = useState(false);
  const isAllAgreed = agreeToTerms1 && agreeToTerms2;

  useEffect(() => {
    if (!open) {
      setAgreeToTerms1(false);
      setAgreeToTerms2(false);
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleKakaoLogin = () => {
    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const oauthUrl = `${backendUrl}/oauth2/authorization/kakao`;
    window.location.href = oauthUrl;
  };

  const handleNaverLogin = () => {
    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const oauthUrl = `${backendUrl}/oauth2/authorization/naver`;
    window.location.href = oauthUrl;
  };

  return (
    <div className="fixed inset-0 z-[200]">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-[480px] rounded-[20px] bg-white p-[42px] shadow-[0_0_20px_0_rgba(0,0,0,0.15)]">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 cursor-pointer"
            aria-label="닫기"
          >
            <CloseIcon />
          </button>

          <div className="flex flex-col gap-9">
            <div className="flex justify-center">
              <MainLogo />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="ds-title text-center font-bold text-gray-900">
                로그인/회원가입
              </h2>
              <p className="ds-subtext text-center font-medium text-gray-600">
                로그인 후 스타라이트의 모든 기능을 이용하세요
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="ds-caption font-medium text-gray-500">
                  서비스 이용약관에 동의합니다.{' '}
                  <a
                    href="https://marked-lift-a34.notion.site/29e6dc10381580dd8a1fff635ed3300f?source=copy_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-gray-700 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
                    aria-label="개인정보 처리방침 약관 보기"
                  >
                    (약관 보기)
                  </a>
                </p>
                {agreeToTerms1 ? (
                  <div
                    className="bg-primary-500 flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center rounded-[4px]"
                    onClick={() => setAgreeToTerms1(!agreeToTerms1)}
                  >
                    <Check />
                  </div>
                ) : (
                  <div
                    className="h-5 w-5 flex-shrink-0 cursor-pointer rounded-[4px] border-[1.2px] border-gray-400"
                    onClick={() => setAgreeToTerms1(!agreeToTerms1)}
                  />
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="ds-caption font-medium text-gray-500">
                  개인정보 처리방침에 동의합니다.{` `}
                  <a
                    href="https://marked-lift-a34.notion.site/29e6dc103815807cbd1cc93cd14ef38e?source=copy_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-gray-700 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
                    aria-label="개인정보 처리방침 약관 보기"
                  >
                    (약관 보기)
                  </a>
                </p>
                {agreeToTerms2 ? (
                  <div
                    className="bg-primary-500 flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center rounded-[4px]"
                    onClick={() => setAgreeToTerms2(!agreeToTerms2)}
                  >
                    <Check />
                  </div>
                ) : (
                  <div
                    className="h-5 w-5 flex-shrink-0 cursor-pointer rounded-[4px] border-[1.2px] border-gray-400"
                    onClick={() => setAgreeToTerms2(!agreeToTerms2)}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleKakaoLogin}
                disabled={!isAllAgreed}
                className={`flex h-[44px] w-full items-center justify-center gap-2 rounded-lg transition-colors ${
                  isAllAgreed
                    ? 'cursor-pointer bg-[#FEE500] hover:bg-[#FDD835]'
                    : 'cursor-not-allowed bg-gray-200'
                }`}
              >
                {isAllAgreed ? <KakaoActive /> : <Kakao />}
                <span
                  className={`ds-text font-medium ${
                    isAllAgreed
                      ? 'rgba(0, 0, 0, 0.85) text-gray-900'
                      : 'text-gray-500'
                  }`}
                >
                  카카오 로그인
                </span>
              </button>

              <button
                type="button"
                onClick={handleNaverLogin}
                disabled={!isAllAgreed}
                className={`flex h-[44px] w-full items-center justify-center gap-2 rounded-lg transition-colors ${
                  isAllAgreed
                    ? 'cursor-pointer bg-[#03C75A] hover:bg-[#02B350]'
                    : 'cursor-not-allowed bg-gray-200'
                }`}
              >
                {isAllAgreed ? <NaverActive /> : <Naver />}
                <span
                  className={`ds-text font-medium ${
                    isAllAgreed ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  네이버 로그인
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
