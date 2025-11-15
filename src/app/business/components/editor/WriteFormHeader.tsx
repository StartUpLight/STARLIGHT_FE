interface WriteFormHeaderProps {
    number: string;
    title: string;
    subtitle?: string;
}

const WriteFormHeader = ({ number, title, subtitle }: WriteFormHeaderProps) => {
    return (
        <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-2">
                <div className="ds-caption flex h-[20px] items-center justify-center rounded-full bg-gray-900 px-[6px] font-semibold text-white">
                    {number}
                </div>
                <p className="ds-subtitle font-semibold text-gray-900">
                    {number === '0' ? '개요' : title}
                </p>
            </div>
            {number !== '0' && (
                <p className="ds-subtext mt-[10px] font-medium text-gray-600">
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default WriteFormHeader;

