'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/assets/icons/logo.svg';
import React, { useState, useEffect } from 'react';
import UploadReportModal from './UploadReportModal';
import LoginModal from './LoginModal';
import { useAuthStore } from '@/store/auth.store';
import { useUserStore } from '@/store/user.store';
import Image from 'next/image';

const Header = () => {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const { isAuthenticated, checkAuth, logout } = useAuthStore();
  const router = useRouter();
  const { user, fetchUser, clearUser } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    } else {
      clearUser();
    }
  }, [isAuthenticated, fetchUser, clearUser]);

  // 프로필 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    if (!isProfileOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isProfileOpen]);

  // /business 경로에서는 헤더 숨김
  if (pathname.startsWith('/business')) {
    return null;
  }

  const isBusinessActive =
    pathname.startsWith('/business') || pathname.startsWith('/report');

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  const isHomePage = pathname === '/';

  const navLink =
    'ds-text px-2 font-medium transition-colors hover:text-primary-500 hover:font-semibold';
  const dropdownItem =
    'block cursor-pointer px-[12px] py-[8px] ds-subtext font-medium text-gray-900 transition-colors hover:bg-primary-50 hover:text-primary-500';
  const menuWrapper = 'relative group/nav';
  const menuButton =
    'ds-text px-2 font-medium transition-colors hover:text-primary-500 hover:font-semibold group-hover/nav:text-primary-500 group-hover/nav:font-semibold focus:outline-none';
  const menuList =
    'invisible opacity-0 scale-95 absolute left-1/2 z-20 mt-3 w-[100px] -translate-x-1/2 overflow-hidden ' +
    'rounded-[8px] bg-white shadow-[0_0_10px_0_rgba(0,0,0,0.10)] transition-all duration-150 ease-in-out ' +
    'group-hover/nav:visible group-hover/nav:opacity-100 group-hover/nav:scale-100';

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      setOpenLogin(true);
    }
  };

  const handleLogout = () => {
    logout();
    clearUser();
    router.push('/');

    setIsProfileOpen(false);
  };

  return (
    <header
      className={`h-[60px] w-full shadow-[0_4px_6px_0_rgba(0,0,0,0.05)] ${isHomePage ? 'fixed bg-black/30' : 'bg-white'} z-[80]`}
    >
      <div className="mx-auto flex h-[60px] items-center px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-1.5">
            <Logo />
            <span
              className={`text-[18.9px] font-semibold ${isHomePage ? 'text-white' : 'text-gray-900'}`}
            >
              Starlight
            </span>
          </Link>

          <nav className="ml-[100px] flex items-center gap-12 text-nowrap">
            <Link
              href="/"
              className={`${navLink} ${isActive('/')
                ? 'text-primary-500 font-semibold'
                : isHomePage
                  ? 'text-white'
                  : 'text-gray-900'
                }`}
            >
              홈
            </Link>

            <div className={menuWrapper}>
              <button
                type="button"
                className={`${menuButton} ${isBusinessActive
                  ? 'text-primary-500 font-semibold'
                  : isHomePage
                    ? 'text-white'
                    : 'text-gray-900'
                  }`}
                aria-haspopup="menu"
                aria-expanded="false"
              >
                사업계획서
              </button>

              <div className={menuList} role="menu">
                <Link
                  href="/business"
                  className={dropdownItem}
                  role="menuitem"
                >
                  작성하기
                </Link>
                <button
                  type="button"
                  onClick={() => setOpenUpload(true)}
                  className={`${dropdownItem} w-full text-left`}
                  role="menuitem"
                >
                  채점하기
                </button>
              </div>
            </div>

            <Link
              href="/expert"
              className={`${navLink} ${isActive('/expert')
                ? 'text-primary-500 font-semibold'
                : isHomePage
                  ? 'text-white'
                  : 'text-gray-900'
                }`}
            >
              전문가
            </Link>
            <Link
              href="/price"
              className={`${navLink} ${isActive('/price')
                ? 'text-primary-500 font-semibold'
                : isHomePage
                  ? 'text-white'
                  : 'text-gray-900'
                }`}
            >
              요금제
            </Link>
          </nav>
        </div>

        <div className="ml-auto flex items-center">
          {isAuthenticated ? (
            <div className="profile-dropdown relative">
              <div
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex cursor-pointer items-center justify-center rounded-full"
              >
                {user?.profileImageUrl ? (
                  <Image
                    src={user.profileImageUrl}
                    alt={user.name}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                    priority
                  />
                ) : (
                  <span className="ds-text flex h-9 w-9 items-center justify-center rounded-full bg-gray-400 font-medium">
                    {user?.name?.charAt(0)}
                  </span>
                )}
              </div>

              {isProfileOpen && (
                <div className="absolute right-0 z-20 mt-2 w-[100px] overflow-hidden rounded-[8px] bg-white shadow-[0_0_10px_0_rgba(0,0,0,0.10)]">
                  <Link
                    href="/mypage"
                    onClick={() => setIsProfileOpen(false)}
                    className="ds-subtext hover:bg-primary-50 block px-[12px] py-[8px] font-medium text-gray-900 transition-colors"
                  >
                    마이페이지
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="ds-subtext hover:bg-primary-50 w-full cursor-pointer px-[12px] py-[8px] text-left font-medium text-gray-900 transition-colors"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAuthClick}
              className={`ds-text hover:text-primary-500 cursor-pointer px-4 py-[6px] font-medium text-nowrap transition-colors hover:font-semibold ${isHomePage ? 'text-white' : 'text-gray-900'}`}
            >
              로그인
            </button>
          )}
        </div>
      </div>
      <UploadReportModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
      />
      <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
    </header>
  );
};

export default Header;
