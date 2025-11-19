import { forwardRef } from 'react';

const ToolButton = forwardRef<HTMLButtonElement, {
  onClick?: () => void;
  active?: boolean;
  label: React.ReactNode;
}>(({ onClick, active, label }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center justify-center cursor-pointer rounded-[4px] p-[2px] transition-colors ${active
        ? "bg-primary-50 text-primary-500"
        : "text-gray-700 hover:text-primary-500 hover:bg-gray-100"
        }`}
    >
      {label}
    </button>
  );
});

ToolButton.displayName = 'ToolButton';

export default ToolButton;
