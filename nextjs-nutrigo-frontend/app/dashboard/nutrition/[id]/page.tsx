"use client";

import { useState } from "react";
import { useNutritionistAvailability } from "@/hooks/useNutritionists";

export default function BookingPage({ params }: { params: { id: string } }) {
  const [selectedDate, setSelectedDate] = useState<string>("2026-02-23");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const { data, isLoading, isError } = useNutritionistAvailability(
    params.id,
    selectedDate,
  );
  const timeSlots: { time: string; available: boolean }[] = data?.data || [];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">จองคิวปรึกษา</h2>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium">
          เลือกวันที่ต้องการ
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedTimeSlot(null);
          }}
          className="border border-gray-300 rounded-md p-2 w-full"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium">
          เวลาว่างทั้งหมด
        </label>

        {isLoading && (
          <p className="text-gray-500 text-sm animate-pulse">
            กำลังตรวจสอบคิวว่าง...
          </p>
        )}
        {isError && (
          <p className="text-red-500 text-sm">
            ไม่สามารถโหลดคิวได้ กรุณาลองใหม่
          </p>
        )}

        {!isLoading && timeSlots.length === 0 && (
          <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
            ขออภัย นักโภชนาการไม่ได้รับคิวในวันนี้ หรือคิวเต็มแล้ว
          </p>
        )}

        <div className="grid grid-cols-3 gap-3">
          {!isLoading &&
            timeSlots.map((slot) => {
              const isSelected = selectedTimeSlot === slot.time;

              return (
                <button
                  key={slot.time}
                  disabled={!slot.available}
                  onClick={() => setSelectedTimeSlot(slot.time)}
                  className={`
                  py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200
                  ${!slot.available ? "bg-gray-100 text-gray-400 cursor-not-allowed border outline-none" : ""}
                  ${slot.available && !isSelected ? "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50" : ""}
                  ${isSelected ? "bg-emerald-600 text-white shadow-md" : ""}
                `}
                >
                  {slot.time}
                  {!slot.available && (
                    <span className="block text-[10px] mt-1">เต็มแล้ว</span>
                  )}
                </button>
              );
            })}
        </div>
      </div>

      <button
        disabled={!selectedTimeSlot}
        className="w-full bg-emerald-700 text-white font-bold py-3 rounded-xl hover:bg-emerald-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        onClick={() => {
          console.log("กำลังจองคิว:", {
            nutritionistId: params.id,
            date: selectedDate,
            time: selectedTimeSlot,
          });
        }}
      >
        ยืนยันการจอง {selectedTimeSlot ? `(เวลา ${selectedTimeSlot})` : ""}
      </button>
    </div>
  );
}
