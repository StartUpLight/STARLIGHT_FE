import React, { useState, useEffect, useRef } from 'react';
import DropDown from '@/assets/icons/drop_down.svg';
import DropDownUp from '@/assets/icons/puple_drop_down.svg';

type ExpertSelectProps = {
  experts: string[];
  value: string;
  onChange: (name: string) => void;
};

const UserExpertHeader = ({ experts, value, onChange }: ExpertSelectProps) => {
  const [open, setOpen] = useState(false);
  const hasMultiple = experts.length > 1;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const otherExperts = experts.filter((expert) => expert !== value);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  if (!hasMultiple) {
    return (
      <div className="ds-title inline-flex items-center font-semibold text-gray-900">
        {value} 전문가
      </div>
    );
  }

  const buttonBase =
    'ds-title mr-2 inline-flex cursor-pointer items-center gap-1 rounded-[8px] px-2 py-1 font-semibold';
  const buttonState = open
    ? 'bg-primary-50 text-primary-500'
    : 'bg-gray-100 text-gray-900 hover:bg-gray-200';

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className={`${buttonBase} ${buttonState}`}
      >
        <span>{value} 전문가</span>
        {open ? <DropDownUp /> : <DropDown />}
      </button>

      {open && (
        <div className="absolute left-0 z-10 mt-2 min-w-[137px] overflow-hidden rounded-lg bg-white shadow-xl">
          <div className="ds-subtext bg-primary-50 text-primary-500 cursor-pointer px-3 py-2 font-medium">
            {value}
          </div>

          <ul className="bg-white">
            {otherExperts.map((expert) => (
              <li key={expert}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(expert);
                    setOpen(false);
                  }}
                  className="ds-subtext hover:bg-primary-50 w-full cursor-pointer px-3 py-2 text-start text-gray-800"
                >
                  {expert}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserExpertHeader;
