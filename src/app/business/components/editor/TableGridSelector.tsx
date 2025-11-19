"use client";
import { useState, useRef, useEffect } from 'react';

interface TableGridSelectorProps {
    onSelect: (rows: number, cols: number) => void;
    onClose: () => void;
    buttonRef: React.RefObject<HTMLButtonElement | null>;
}

const TableGridSelector = ({ onSelect, onClose, buttonRef }: TableGridSelectorProps) => {
    const [selectedRows, setSelectedRows] = useState(0);
    const [selectedCols, setSelectedCols] = useState(0);
    const gridRef = useRef<HTMLDivElement>(null);
    const maxRows = 8;
    const maxCols = 8;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                gridRef.current &&
                !gridRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose, buttonRef]);

    const handleCellHover = (row: number, col: number) => {
        setSelectedRows(row + 1);
        setSelectedCols(col + 1);
    };

    const handleCellClick = () => {
        if (selectedRows > 0 && selectedCols > 0) {
            onSelect(selectedRows, selectedCols);
            onClose();
        }
    };

    const handleMouseLeave = () => {
        setSelectedRows(0);
        setSelectedCols(0);
    };

    return (
        <div
            ref={gridRef}
            className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50"
            onMouseLeave={handleMouseLeave}
        >
            <div className="mb-2 text-xs text-gray-600 text-center">
                {selectedRows > 0 && selectedCols > 0
                    ? `${selectedRows} x ${selectedCols} 표`
                    : '표 크기 선택'}
            </div>
            <div
                className="grid gap-0.5 cursor-pointer"
                style={{
                    gridTemplateColumns: `repeat(${maxCols}, minmax(0, 1fr))`,
                    width: `${maxCols * 20 + (maxCols - 1) * 2}px`,
                }}
                onClick={handleCellClick}
            >
                {Array.from({ length: maxRows * maxCols }).map((_, index) => {
                    const row = Math.floor(index / maxCols);
                    const col = index % maxCols;
                    const isSelected = row < selectedRows && col < selectedCols;

                    return (
                        <div
                            key={index}
                            className={`w-5 h-5 border border-gray-300 transition-colors ${isSelected
                                ? 'bg-primary-100 border-primary-100'
                                : 'bg-white hover:bg-gray-100'
                                }`}
                            onMouseEnter={() => handleCellHover(row, col)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default TableGridSelector;

