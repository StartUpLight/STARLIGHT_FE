'use client';
import React, { useEffect, useState } from 'react';
import CloseIcon from '@/assets/icons/close.svg';
import MainLogo from '@/assets/icons/main_logo.svg';
import Check from '@/assets/icons/white_check.svg';
import ChevronRight from '@/assets/icons/arrow_login.svg';
import KakaoActive from '@/assets/icons/kakao_active.svg';
import NaverActive from '@/assets/icons/naver_active.svg';

type MobileLoginScreenProps = {
  open: boolean;
  onClose: () => void;
};

type Provider = 'kakao' | 'naver' | null;

const MobileLoginScreen = ({ open, onClose }: MobileLoginScreenProps) => {
  const [step, setStep] = useState<'login' | 'terms'>('login');
  const [provider, setProvider] = useState<Provider>(null);
  const [agreeToTerms1, setAgreeToTerms1] = useState(false);
  const [agreeToTerms2, setAgreeToTerms2] = useState(false);
  const [agreeToMarketing, setAgreeToMarketing] = useState(false);

  const isRequiredAgreed = agreeToTerms1 && agreeToTerms2;
  const isAllAgreed = agreeToTerms1 && agreeToTerms2 && agreeToMarketing;

  useEffect(() => {
    if (!open) {
      setStep('login');
      setProvider(null);
      setAgreeToTerms1(false);
      setAgreeToTerms2(false);
      setAgreeToMarketing(false);
      return;
    }
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const hasAgreedTerms = () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('termsAgreed') === 'true';
  };

  const handleSelectProvider = (selected: Provider) => {
    if (hasAgreedTerms()) {
      const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const oauthUrl = `${backendUrl}/oauth2/authorization/${selected}`;
      window.location.href = oauthUrl;
      return;
    }
    setProvider(selected);
    setStep('terms');
  };

  const handleBack = () => {
    setStep('login');
    setProvider(null);
    setAgreeToTerms1(false);
    setAgreeToTerms2(false);
    setAgreeToMarketing(false);
  };

  const handleComplete = () => {
    if (!isRequiredAgreed || !provider) return;
    localStorage.setItem('termsAgreed', 'true');
    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const oauthUrl = `${backendUrl}/oauth2/authorization/${provider}`;
    window.location.href = oauthUrl;
  };

  const handleToggleAll = () => {
    const next = !isAllAgreed;
    setAgreeToTerms1(next);
    setAgreeToTerms2(next);
    setAgreeToMarketing(next);
  };

  const Checkbox = ({
    checked,
    onClick,
  }: {
    checked: boolean;
    onClick: () => void;
  }) =>
    checked ? (
      <div
        className="bg-primary-500 flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center rounded-[5.3px]"
        onClick={onClick}
      >
        <Check />
      </div>
    ) : (
      <div
        className="h-6 w-6 flex-shrink-0 cursor-pointer rounded-[5.3px] border-[1.44px] border-gray-400"
        onClick={onClick}
      />
    );

  return (
    <div className="fixed inset-0 z-[200] bg-white md:hidden">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 cursor-pointer"
        aria-label="닫기"
      >
        <CloseIcon />
      </button>

      <div className="flex flex-col items-center px-[42px] pt-[140px]">
        {step === 'login' ? (
          <div className="flex w-full flex-col items-center gap-9">
            <MainLogo />
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-[24px] font-bold leading-[1.5] tracking-[-0.48px] text-gray-900">
                로그인/회원가입
              </h2>
              <p className="text-[16px] font-medium leading-[1.5] tracking-[-0.16px] text-gray-600">
                로그인 후 스타라이트의 모든 기능을 이용하세요
              </p>
            </div>
            <div className="flex w-full flex-col gap-3">
              <button
                type="button"
                onClick={() => handleSelectProvider('kakao')}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-[#FEE500] transition-colors hover:bg-[#FDD835]"
              >
                <KakaoActive />
                <span className="text-[16px] font-medium text-[rgba(0,0,0,0.85)]">
                  카카오 로그인
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectProvider('naver')}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-[#03C75A] transition-colors hover:bg-[#02B350]"
              >
                <NaverActive />
                <span className="text-[16px] font-medium text-white">
                  네이버 로그인
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-9">
            <h2 className="text-[24px] font-bold leading-[1.5] tracking-[-0.48px] text-gray-900 text-center">
              서비스 이용을 위해
              <br />
              약관에 동의해주세요
            </h2>

            <div className="flex w-full flex-col">
              {/* 전체 동의 */}
              <div className="flex items-center gap-3 rounded-lg p-2">
                <Checkbox checked={isAllAgreed} onClick={handleToggleAll} />
                <span className="text-[14px] font-semibold leading-[1.5] text-gray-900">
                  전체 동의
                </span>
              </div>

              <div className="h-px w-full bg-gray-200" />

              {/* 서비스 이용약관 (필수) */}
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={agreeToTerms1}
                    onClick={() => setAgreeToTerms1(!agreeToTerms1)}
                  />
                  <p className="text-[14px] font-medium leading-[1.5] text-gray-500">
                    서비스 이용약관에 동의합니다.{' '}
                    <span className="text-primary-500">(필수)</span>
                  </p>
                </div>
                <a
                  href="https://marked-lift-a34.notion.site/29e6dc10381580dd8a1fff635ed3300f?source=copy_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="서비스 이용약관 보기"
                  className="flex-shrink-0"
                >
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </a>
              </div>

              {/* 개인정보 처리방침 (필수) */}
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={agreeToTerms2}
                    onClick={() => setAgreeToTerms2(!agreeToTerms2)}
                  />
                  <p className="text-[14px] font-medium leading-[1.5] text-gray-500">
                    개인정보 처리방침에 동의합니다.{' '}
                    <span className="text-primary-500">(필수)</span>
                  </p>
                </div>
                <a
                  href="https://marked-lift-a34.notion.site/29e6dc103815807cbd1cc93cd14ef38e?source=copy_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="개인정보 처리방침 보기"
                  className="flex-shrink-0"
                >
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </a>
              </div>

              {/* 마케팅 정보 수신 (선택) */}
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={agreeToMarketing}
                    onClick={() => setAgreeToMarketing(!agreeToMarketing)}
                  />
                  <p className="text-[14px] font-medium leading-[1.5] text-gray-500">
                    마케팅 정보 수신 동의{' '}
                    <span className="text-gray-500">(선택)</span>
                  </p>
                </div>
                <a
                  href="https://marked-lift-a34.notion.site/3176dc103815803bb2f5d15484dbcc8a?source=copy_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="마케팅 정보 수신 동의 보기"
                  className="flex-shrink-0"
                >
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </a>
              </div>
            </div>

            <div className="flex w-full flex-col items-center gap-4">
              <button
                type="button"
                onClick={handleComplete}
                disabled={!isRequiredAgreed}
                className={`flex h-[44px] w-full items-center justify-center rounded-lg text-[16px] font-medium transition-colors ${
                  isRequiredAgreed
                    ? 'bg-primary-500 hover:bg-primary-600 cursor-pointer text-white'
                    : 'cursor-not-allowed bg-gray-200 text-gray-500'
                }`}
              >
                완료
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="cursor-pointer text-[14px] font-medium text-gray-500 transition-colors hover:text-gray-700"
              >
                돌아가기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileLoginScreen;
