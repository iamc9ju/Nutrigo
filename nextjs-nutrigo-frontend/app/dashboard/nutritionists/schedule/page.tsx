"use client";
import { useState } from "react";
import { nutritionistApi } from "@/app/services/nutritionists";

export default function LeavePage() {
  const [leaveDate, setLeaveDate] = useState("2026-02-24");
  const [isFullDay, setIsFullDay] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        leaveDate: leaveDate,
        isFullDay: isFullDay,

        newStartTime: !isFullDay ? startTime : undefined,
        newEndTime: !isFullDay ? endTime : undefined,
      };

      await nutritionistApi.createLeave(payload);
      alert("บันทึกวันลาสำเร็จ!");
    } catch (error) {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-white rounded-xl shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">แจ้งลางาน / ปรับเวลาทำการ</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {}
        <div>
          <label>วันที่ต้องการลา</label>
          <input
            type="date"
            className="border w-full p-2"
            value={leaveDate}
            onChange={(e) => setLeaveDate(e.target.value)}
          />
        </div>

        {}
        <div>
          <label>รูปแบบการลา</label>
          <select
            className="border w-full p-2"
            value={isFullDay ? "true" : "false"}
            onChange={(e) => setIsFullDay(e.target.value === "true")}
          >
            <option value="true">ลาหยุดเต็มวัน 🏝️</option>
            <option value="false">เข้าทำงานบางช่วงเวลา ⏱️</option>
          </select>
        </div>

        {}
        {!isFullDay && (
          <div className="flex gap-4">
            <div>
              <label>เข้างานเวลา</label>
              <input
                type="time"
                className="border w-full p-2"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label>เลิกงานเวลา</label>
              <input
                type="time"
                className="border w-full p-2"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        )}

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold"
        >
          {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </button>
      </form>
    </div>
  );
}
