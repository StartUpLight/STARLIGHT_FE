import Link from "next/link";
import Logo from "@/assets/icons/logo.svg";

export default function Header() {
    const navLink =
        "ds-text px-2 font-medium text-gray-900 transition-colors hover:text-primary-500 hover:font-semibold";
    const dropdownItem =
        "block px-[12px] py-[8px] ds-subtext font-medium text-gray-900 transition-colors hover:bg-primary-50 hover:text-primary-500";
    const menuWrapper =
        "relative group/nav";
    const menuButton =
        "ds-text px-2 font-medium text-gray-900 transition-colors hover:text-primary-500 hover:font-semibold group-hover/nav:text-primary-500 group-hover/nav:font-semibold focus:outline-none focus-visible:text-primary-500 focus-visible:font-semibold";
    const menuList =
        "invisible opacity-0 scale-95 absolute left-1/2 z-20 mt-3 w-[100px] -translate-x-1/2 overflow-hidden " +
        "rounded-[8px] bg-white shadow-[0_0_10px_0_rgba(0,0,0,0.10)] transition-all duration-150 ease-in-out " +
        "group-hover/nav:visible group-hover/nav:opacity-100 group-hover/nav:scale-100 group-focus-within/nav:visible group-focus-within/nav:opacity-100 group-focus-within/nav:scale-100";

    return (
        <header className="fixed inset-x-0 top-0 z-50 w-full bg-white shadow-[0_4px_6px_0_rgba(0,0,0,0.05)]">
            <div className="mx-auto flex h-[60px] items-center px-8">
                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-1.5">
                        <Logo />
                        <span className="text-gray-900 font-semibold text-[18.9px]">Starlight</span>
                    </Link>
                    <nav className="ml-[100px] flex items-center gap-12 text-gray-900 text-nowrap">
                        <Link href="/" className={navLink}>
                            홈
                        </Link>
                        <div className={menuWrapper}>
                            <button
                                type="button"
                                className={menuButton}
                                aria-haspopup="menu"
                                aria-expanded="false"
                            >
                                사업계획서
                            </button>

                            <div className={menuList} role="menu">
                                <Link href="/business" className={dropdownItem} role="menuitem">
                                    작성하기
                                </Link>
                                <Link href="/business/score" className={dropdownItem} role="menuitem">
                                    채점하기
                                </Link>
                            </div>
                        </div>

                        <Link href="#" className={navLink}>
                            전문가
                        </Link>
                        <Link href="#" className={navLink}>
                            요금제
                        </Link>
                    </nav>
                </div>
                <div className="ml-auto flex items-center">
                    <Link
                        href="/login"
                        className="ds-text text-nowrap py-[6px] px-4 font-medium text-gray-900 transition-colors hover:text-primary-500 hover:font-semibold"
                    >
                        로그인
                    </Link>
                </div>
            </div>
        </header>
    );
}