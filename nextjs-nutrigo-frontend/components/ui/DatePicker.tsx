"use client";

import * as React from "react";
import { format, getDaysInMonth, setMonth, setYear, setDate } from "date-fns";
import { th } from "date-fns/locale";
import { Calendar as CalendarIcon, X, Check } from "lucide-react";

interface DatePickerProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i,
  label: format(setMonth(new Date(), i), "MMMM", { locale: th }),
}));

const YEARS = Array.from(
  { length: 121 },
  (_, i) => new Date().getFullYear() - i,
);

export function DatePicker({
  selected,
  onSelect,
  placeholder = "เลือกวันที่",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<Date>(
    selected || new Date(2000, 0, 1),
  );
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const daysInMonth = getDaysInMonth(tempDate);
  const DAYS = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const updateDate = (type: "day" | "month" | "year", val: number) => {
    let newDate = new Date(tempDate);
    if (type === "day") newDate = setDate(newDate, val);
    if (type === "month") newDate = setMonth(newDate, val);
    if (type === "year") newDate = setYear(newDate, val);
    setTempDate(newDate);
  };

  const handleConfirm = () => {
    onSelect(tempDate);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-6 py-5 rounded-3xl border-2 flex items-center gap-4 transition-all duration-300
                    ${isOpen
            ? "border-[#C6E065] ring-8 ring-[#C6E065]/10 bg-white"
            : "border-[#f0e6cc] bg-white hover:border-[#C6E065]/40 hover:shadow-lg"
          }
                `}
      >
        <div className="w-12 h-12 bg-[#faf8f2] rounded-2xl flex items-center justify-center text-[#C6E065]">
          <CalendarIcon className="w-6 h-6" />
        </div>
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-[10px] uppercase font-black tracking-widest text-[#8a7550]/40">
            Date of Birth
          </span>
          <span
            className={`text-xl font-black ${selected ? "text-[#3d3522]" : "text-[#8a7550]/40"}`}
          >
            {selected
              ? `${format(selected, "dd MMMM", { locale: th })} ${selected.getFullYear() + 543}`
              : placeholder}
          </span>
        </div>
      </button>

      { }
      {isOpen && (
        <div
          className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 z-[100] w-[280px] animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-[32px] shadow-[0_15px_50px_-12px_rgba(0,0,0,0.25)] border border-[#f0e6cc] overflow-hidden">
            { }
            <div className="px-6 pt-5 pb-1 text-center relative">
              <h3 className="text-lg font-black text-[#3d3522]">
                เลือกวันเกิด
              </h3>
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#8a7550]/40">
                วัน / เดือน / ปี
              </p>

              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#faf8f2] flex items-center justify-center text-[#8a7550] hover:bg-[#ffebee] hover:text-red-500 transition-all active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            { }
            <div className="relative h-[210px] px-4 flex gap-1">
              { }
              <div className="absolute top-1/2 left-3 right-3 h-10 -translate-y-1/2 bg-[#C6E065]/10 border-y-2 border-[#C6E065]/30 rounded-xl pointer-events-none" />

              <WheelColumn
                items={DAYS}
                value={tempDate.getDate()}
                onChange={(v) => updateDate("day", v)}
                flex={1}
              />
              <WheelColumn
                items={MONTHS.map((m) => m.label)}
                values={MONTHS.map((m) => m.value)}
                value={tempDate.getMonth()}
                onChange={(v) => updateDate("month", v)}
                flex={2.2}
              />
              <WheelColumn
                items={YEARS.map((y) => y + 543)}
                values={YEARS}
                value={tempDate.getFullYear()}
                onChange={(v) => updateDate("year", v)}
                flex={1.8}
              />

              { }
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none z-10" />
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10" />
            </div>

            { }
            <div className="px-6 pb-5 pt-0">
              <button
                onClick={handleConfirm}
                className="w-full py-3 bg-[#C6E065] text-[#3d3522] rounded-xl font-bold text-base shadow-md shadow-[#C6E065]/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                บันทึกข้อมูล
              </button>
            </div>
          </div>
          { }
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-[#f0e6cc] rotate-45 shadow-lg" />
        </div>
      )}
    </div>
  );
}

interface WheelColumnProps {
  items: (string | number)[];
  values?: number[];
  value: number;
  onChange: (val: number) => void;
  flex: number;
}

function WheelColumn({
  items,
  values,
  value,
  onChange,
  flex,
}: WheelColumnProps) {
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const index = values ? values.indexOf(value) : items.indexOf(value);
    if (listRef.current && index !== -1) {
      listRef.current.scrollTop = index * 42;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = () => {
    if (!listRef.current) return;
    const index = Math.round(listRef.current.scrollTop / 42);
    const actualValue = values ? values[index] : (items[index] as number);
    if (actualValue !== undefined && actualValue !== value) {
      onChange(actualValue);
    }
  };

  return (
    <div
      className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide py-[84px]"
      ref={listRef}
      onScroll={handleScroll}
      style={{ flex, scrollbarWidth: "none" }}
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
            className={`h-[42px] flex items-center justify-center snap-center transition-all duration-300
                            ${isActive ? "text-xl font-black text-[#3d3522] scale-105" : "text-xs font-bold text-[#8a7550]/30"}
                        `}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}
