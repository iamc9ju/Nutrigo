'use client';

import * as React from 'react';
import { format, getDaysInMonth, setMonth, setYear, setDate } from 'date-fns';
import { th } from 'date-fns/locale';
import { Calendar as CalendarIcon, X, Check } from 'lucide-react';

interface DatePickerProps {
    selected?: Date;
    onSelect: (date: Date | undefined) => void;
    placeholder?: string;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(setMonth(new Date(), i), 'MMMM', { locale: th }),
}));

const YEARS = Array.from({ length: 121 }, (_, i) => new Date().getFullYear() - i);

export function DatePicker({ selected, onSelect, placeholder = 'เลือกวันที่' }: DatePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [tempDate, setTempDate] = React.useState<Date>(selected || new Date(2000, 0, 1));

    const daysInMonth = getDaysInMonth(tempDate);
    const DAYS = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const updateDate = (type: 'day' | 'month' | 'year', val: number) => {
        let newDate = new Date(tempDate);
        if (type === 'day') newDate = setDate(newDate, val);
        if (type === 'month') newDate = setMonth(newDate, val);
        if (type === 'year') newDate = setYear(newDate, val);
        setTempDate(newDate);
    };

    const handleConfirm = () => {
        onSelect(tempDate);
        setIsOpen(false);
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={`w-full px-6 py-5 rounded-3xl border-2 flex items-center gap-4 transition-all duration-300
                    ${isOpen
                        ? 'border-[#C6E065] ring-8 ring-[#C6E065]/10 bg-white'
                        : 'border-[#f0e6cc] bg-white hover:border-[#C6E065]/40 hover:shadow-lg'
                    }
                `}
            >
                <div className="w-12 h-12 bg-[#faf8f2] rounded-2xl flex items-center justify-center text-[#C6E065]">
                    <CalendarIcon className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-start gap-0.5">
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#8a7550]/40">Date of Birth</span>
                    <span className={`text-xl font-black ${selected ? 'text-[#3d3522]' : 'text-[#8a7550]/40'}`}>
                        {selected ? format(selected, 'dd MMMM yyyy', { locale: th }) : placeholder}
                    </span>
                </div>
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-[#3d3522]/40 backdrop-blur-md animate-in fade-in duration-300"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-md relative overflow-hidden animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-8 pt-8 pb-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black text-[#3d3522]">เลือกวันเกิด</h3>
                                <p className="text-sm font-bold text-[#8a7550]/60">เลื่อนเพื่อเลือก วัน / เดือน / ปี</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-12 h-12 rounded-full bg-[#faf8f2] flex items-center justify-center text-[#8a7550] hover:bg-[#ffebee] hover:text-red-500 transition-all active:scale-90"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Picker Area */}
                        <div className="relative h-[280px] px-4 flex gap-2">
                            {/* Focus Highlight */}
                            <div className="absolute top-1/2 left-0 right-0 h-16 -translate-y-1/2 bg-[#C6E065]/10 border-y-2 border-[#C6E065]/20 pointer-events-none" />

                            <WheelColumn
                                items={DAYS}
                                value={tempDate.getDate()}
                                onChange={(v) => updateDate('day', v)}
                                flex={1}
                            />
                            <WheelColumn
                                items={MONTHS.map(m => m.label)}
                                values={MONTHS.map(m => m.value)}
                                value={tempDate.getMonth()}
                                onChange={(v) => updateDate('month', v)}
                                flex={2}
                            />
                            <WheelColumn
                                items={YEARS}
                                value={tempDate.getFullYear()}
                                onChange={(v) => updateDate('year', v)}
                                flex={1.5}
                            />

                            {/* Gradient Overlays */}
                            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent pointer-events-none" />
                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                        </div>

                        {/* Footer */}
                        <div className="p-8 pt-4">
                            <button
                                onClick={handleConfirm}
                                className="w-full py-5 bg-[#3d3522] text-[#C6E065] rounded-3xl font-black text-xl shadow-xl shadow-[#3d3522]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                <Check className="w-6 h-6" />
                                ยืนยันข้อมูล
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

interface WheelColumnProps {
    items: (string | number)[];
    values?: number[];
    value: number;
    onChange: (val: number) => void;
    flex: number;
}

function WheelColumn({ items, values, value, onChange, flex }: WheelColumnProps) {
    const listRef = React.useRef<HTMLDivElement>(null);

    // Initial scroll position
    React.useEffect(() => {
        const index = values ? values.indexOf(value) : items.indexOf(value);
        if (listRef.current && index !== -1) {
            listRef.current.scrollTop = index * 48;
        }
    }, []); // Run on mount

    const handleScroll = () => {
        if (!listRef.current) return;
        const index = Math.round(listRef.current.scrollTop / 48);
        const actualValue = values ? values[index] : (items[index] as number);
        if (actualValue !== undefined && actualValue !== value) {
            onChange(actualValue);
        }
    };

    return (
        <div
            className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide py-[116px]"
            ref={listRef}
            onScroll={handleScroll}
            style={{ flex, scrollbarWidth: 'none' }}
        >
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            {items.map((item, i) => {
                const actualValue = values ? values[i] : (item as number);
                const isActive = actualValue === value;
                return (
                    <div
                        key={i}
                        className={`h-[48px] flex items-center justify-center snap-center transition-all duration-300
                            ${isActive ? 'text-2xl font-black text-[#3d3522] scale-110' : 'text-lg font-bold text-[#8a7550]/30'}
                        `}
                    >
                        {item}
                    </div>
                );
            })}
        </div>
    );
}
