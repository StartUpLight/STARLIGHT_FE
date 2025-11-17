const FeedBackHeader = ({ onComplete }: { onComplete: () => void }) => {
    return (
        <header className="fixed top-0 right-0 bottom-0 z-[100] h-[60px] w-full bg-white shadow-[0_4px_6px_0_rgba(0,0,0,0.05)]">
            <div className="flex h-full w-full items-center justify-end px-8">
                <button
                    type="button"
                    onClick={onComplete}
                    className="ds-subtext cursor-pointer flex px-4 py-[6px] h-[33px] items-center justify-center rounded-[8px] bg-primary-500 font-medium text-white transition hover:bg-primary-600"
                >
                    완료하기
                </button>
            </div>
        </header>
    );
};

export default FeedBackHeader;
