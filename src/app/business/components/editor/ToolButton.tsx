import { forwardRef } from 'react';

interface ToolButtonProps {
  onClick?: () => void;
  active?: boolean;
  label: React.ReactNode;
  disabled?: boolean;
}

const ToolButton = forwardRef<HTMLButtonElement, ToolButtonProps>(({ onClick, active, label, disabled }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={disabled ? undefined : onClick}
      aria-pressed={active}
      disabled={disabled}
      className={`flex items-center justify-center rounded-[4px] p-[2px] transition-colors ${
        disabled
          ? "opacity-40 cursor-not-allowed text-gray-400"
          : active
          ? "bg-primary-50 text-primary-500 cursor-pointer"
          : "text-gray-700 hover:text-primary-500 hover:bg-gray-100 cursor-pointer"
      }`}
    >
      {label}
    </button>
  );
});

ToolButton.displayName = 'ToolButton';

export default ToolButton;
