'use client';
import { useMemo, useState } from 'react';
import ExpertTab from './ExpertTab';
import { useGetExpert } from '@/hooks/queries/useExpert';
import { adaptMentor, MentorProps } from '@/types/expert/expert.props';
import MentorCard from './MentorCard';
import { TAB_LABELS, TabLabel } from '@/types/expert/label';
import { useAuthStore } from '@/store/auth.store';
import LoginModal from '@/app/_components/common/LoginModal';

const ExpertCard = () => {
  const tabs = ['전체', ...TAB_LABELS];
  const [activeTab, setActiveTab] = useState('전체');
  const [openLogin, setOpenLogin] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: experts = [], isLoading: expertsLoading } = useGetExpert();

  const list = useMemo(() => {
    return experts.map((e) => {
      const mentor = adaptMentor(e);
      const status: MentorProps['status'] = 'active';
      return { ...mentor, status };
    });
  }, [experts]);

  const filtered =
    activeTab === '전체'
      ? list
      : list.filter((m) => m.categories.includes(activeTab as TabLabel));

  if (expertsLoading) {
    return (
      <div className="ds-subtext mt-10 text-center text-gray-600">로딩 중</div>
    );
  }

  return (
    <div className="flex w-full flex-col items-start">
      <ExpertTab
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-8"
      />
      <div className="relative w-full">
        <div
          className={`flex w-full flex-col gap-6 pb-6${!isAuthenticated ? ' max-h-[600px] overflow-hidden' : ''
            }`}
        >
          {filtered.length === 0 ? (
            <div className="ds-subtext mt-10 text-center text-gray-600">
              등록된 전문가가 없습니다.
            </div>
          ) : (
            filtered.map((card) => <MentorCard key={card.id} {...card} />)
          )}
        </div>
        {!isAuthenticated && (
          <>
            <div className="absolute inset-0 z-10 rounded-xl bg-white/30 backdrop-blur-[8px]" />
            <div className="absolute inset-0 z-20 flex flex-col items-center mt-12">
              <h3 className="ds-heading font-bold text-gray-900">
                지금 로그인하고 전문가를 만나보세요
              </h3>
              <p className="ds-subtitle text-center font-medium text-gray-600 mt-2">
                로그인을 통해 전문가의 상세 프로필과 활동 이력을 확인할 수 있어요.
              </p>
              <button
                type="button"
                onClick={() => setOpenLogin(true)}
                className="bg-gray-900 cursor-pointer rounded-lg px-8 py-[10px] font-semibold text-white transition-colors mt-9"
              >
                로그인
              </button>
            </div>
          </>
        )}
      </div>
      <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
    </div>
  );
};

export default ExpertCard;
