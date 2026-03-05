"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { nutritionistApi } from "@/app/services/nutritionists";
import { appointmentsApi } from "@/app/services/appointments";
import type { NutritionistDetail, TimeSlot } from "@/types/nutritionist";
import { DAY_NAMES_TH } from "@/types/nutritionist";
import { useNutritionistAvailability } from "@/hooks/useNutritionists";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Star,
  BadgeCheck,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Mail,
} from "lucide-react";

// ─── Calendar Helper ───
function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prev = new Date(year, month, 0).getDate();

  const days: { day: number; current: boolean; dateStr: string }[] = [];

  // Previous month fill
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prev - i;
    const m = month === 0 ? 12 : month;
    const y = month === 0 ? year - 1 : year;
    days.push({
      day: d,
      current: false,
      dateStr: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      day: d,
      current: true,
      dateStr: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    });
  }

  // Next month fill
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      const m = month + 2 > 12 ? 1 : month + 2;
      const y = month + 2 > 12 ? year + 1 : year;
      days.push({
        day: d,
        current: false,
        dateStr: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      });
    }
  }

  return days;
}

const WEEKDAY_HEADERS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
const MONTH_NAMES_TH = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
  "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
  "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

export default function NutritionistBookingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // ─── State ───
  const [nutritionist, setNutritionist] = useState<NutritionistDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  // ─── Calendar state ───
  const now = useMemo(() => new Date(), []);
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [calYear, setCalYear] = useState(now.getFullYear());

  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  const calendarDays = useMemo(
    () => getCalendarDays(calYear, calMonth),
    [calYear, calMonth],
  );

  const goToPrevMonth = useCallback(() => {
    setCalMonth((m) => {
      if (m === 0) {
        setCalYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setCalMonth((m) => {
      if (m === 11) {
        setCalYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  // ─── Fetch nutritionist detail ───
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await nutritionistApi.getNutritionistById(id);
        setNutritionist(res.data ?? res);
      } catch {
        console.error("Failed to fetch nutritionist");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ─── Fetch availability ───
  const {
    data: availabilityData,
    isLoading: slotsLoading,
    isError: slotsError,
  } = useNutritionistAvailability(id, selectedDate);
  const rawSlots = availabilityData?.data ?? availabilityData;
  const timeSlots: TimeSlot[] = Array.isArray(rawSlots) ? rawSlots : [];

  // ─── Reset slot when date changes ───
  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDate]);

  // ─── Booking handler ───
  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot || !nutritionist) return;

    const confirmResult = await Swal.fire({
      title: "ยืนยันการจอง",
      html: `
        <div style="text-align:left; font-size:14px; line-height:2">
          <p><strong>นักโภชนาการ:</strong> ${nutritionist.firstName} ${nutritionist.lastName}</p>
          <p><strong>วันที่:</strong> ${new Date(selectedDate).toLocaleDateString("th-TH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          <p><strong>เวลา:</strong> ${selectedSlot} น.</p>
          <p><strong>ค่าบริการ:</strong> ฿${Number(nutritionist.consultationFee).toLocaleString()}</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4A6707",
      cancelButtonColor: "#8a7550",
      confirmButtonText: "ยืนยันจอง",
      cancelButtonText: "ยกเลิก",
    });

    if (!confirmResult.isConfirmed) return;

    setIsBooking(true);
    try {
      const startTime = new Date(
        `${selectedDate}T${selectedSlot}:00+07:00`,
      ).toISOString();

      const result = await appointmentsApi.create({
        nutritionistId: id,
        startTime,
        type: "online",
      });

      // Extract payment data from response
      const paymentData = result?.data ?? result;
      const { appointmentId: apptId, payment } = paymentData;

      // Redirect to PromptPay QR payment page
      const params = new URLSearchParams({
        appointmentId: apptId,
        qrCodeUrl: payment.qrCodeUrl,
        amount: String(payment.amount),
        chargeId: payment.chargeId,
      });

      router.push(`/dashboard/payment?${params.toString()}`);
    } catch (error: unknown) {
      let message = "เกิดข้อผิดพลาด กรุณาลองใหม่";

      const err = error as { response?: { data?: { message?: string | string[] } } };

      if (err?.response?.data?.message) {
        const backendMessage = err.response.data.message;
        if (
          backendMessage ===
          "Patient profile not found or incomplete. Please complete your profile first."
        ) {
          message =
            "กรุณากรอกข้อมูลส่วนตัวในหน้าโปรไฟล์ให้ครบถ้วนก่อนทำการจองคิวครับ";
        } else if (
          backendMessage === "This time slot has already been booked"
        ) {
          message = "เวลานี้ถูกจองไปแล้ว กรุณาเลือกเวลาอื่น";
        } else if (
          backendMessage ===
          "The requested time is outside the nutritionist working hours"
        ) {
          message = "เวลาที่เลือกอยู่นอกเวลาทำการของนักโภชนาการ";
        } else if (
          backendMessage ===
          "The nutritionist is on leave during the requested time"
        ) {
          message = "นักโภชนาการลางานในเวลาที่เลือก";
        } else {
          message = Array.isArray(backendMessage)
            ? backendMessage.join(", ")
            : backendMessage;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      Swal.fire({
        title: "จองไม่สำเร็จ",
        text: message,
        icon: "error",
        confirmButtonColor: "#8a7550",
      });
    } finally {
      setIsBooking(false);
    }
  };

  // ═══════════════════════════════════════════════════════
  // LOADING STATE
  // ═══════════════════════════════════════════════════════
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-24 bg-gray-100 rounded-full" />
        <div className="bg-white rounded-[32px] p-8 border border-[#f0e6cc] h-60" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-[32px] p-8 border border-[#f0e6cc] h-72" />
          <div className="bg-white rounded-[32px] p-8 border border-[#f0e6cc] h-72" />
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // NOT FOUND STATE
  // ═══════════════════════════════════════════════════════
  if (!nutritionist) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">😔</div>
        <p className="text-lg font-bold text-[#3d3522] mb-2">
          ไม่พบข้อมูลนักโภชนาการ
        </p>
        <button
          onClick={() => router.back()}
          className="mt-4 inline-flex items-center gap-2 text-[#4A6707] font-semibold hover:underline cursor-pointer"
        >
          ← กลับหน้ารายชื่อ
        </button>
      </div>
    );
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=${nutritionist.firstName}+${nutritionist.lastName}&background=C6E065&color=3d3522&size=200&bold=true`;
  const specialties =
    nutritionist.nutritionistSpecialties?.map((ns) => ns.specialty) ?? [];
  const availableCount = timeSlots.filter((s) => s.available).length;

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#8a7550] hover:text-[#3d3522] font-bold transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" /> กลับ
      </button>

      {/* ═══════════════════════════════════════════════════════
          SECTION 1: Nutritionist Detail Card (top — full width)
          ═══════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#f0e6cc] shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-[3px] border-[#C6E065] shadow-md flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt={`${nutritionist.firstName} ${nutritionist.lastName}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-[#3d3522] truncate">
                {nutritionist.firstName} {nutritionist.lastName}
              </h1>
              {nutritionist.verificationStatus === "approved" && (
                <BadgeCheck className="w-5 h-5 text-[#4A6707] fill-[#C6E065] flex-shrink-0" />
              )}
            </div>

            <p className="text-sm text-[#8a7550] font-medium mb-2">นักโภชนาการ</p>

            {/* Rating */}
            {nutritionist.totalReviews > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(nutritionist.avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-[#3d3522]">
                  {nutritionist.avgRating.toFixed(1)}
                </span>
                <span className="text-xs text-[#8a7550]">
                  ({nutritionist.totalReviews} รีวิว)
                </span>
              </div>
            )}

            {/* Email */}
            <div className="flex items-center gap-2 text-sm text-[#8a7550] mb-3">
              <Mail className="w-3.5 h-3.5" />
              <span>{nutritionist.user.email}</span>
            </div>

            {/* Specialties */}
            {specialties.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {specialties.map((s) => (
                  <span
                    key={s.specialtyId ?? s.name}
                    className="text-[10px] font-bold bg-[#C6E065]/20 text-[#4A6707] px-2.5 py-1 rounded-full"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Fee */}
          <div className="flex flex-col items-end justify-center flex-shrink-0">
            <p className="text-xs text-[#8a7550] mb-1">ค่าปรึกษา</p>
            <p className="text-2xl font-black text-[#3d3522]">
              ฿{Number(nutritionist.consultationFee).toLocaleString()}
            </p>
            <p className="text-[10px] text-[#8a7550]">ต่อครั้ง (1 ชม.)</p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2: Weekly Schedule (วันทำการ)
          ═══════════════════════════════════════════════════════ */}
      {nutritionist.nutritionistSchedules?.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {DAY_NAMES_TH.map((dayName, dayIndex) => {
            const schedule = nutritionist.nutritionistSchedules?.find(
              (s) => s.dayOfWeek === dayIndex,
            );
            return (
              <div
                key={dayIndex}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors
                  ${schedule ? "bg-white border border-[#C6E065] text-[#3d3522]" : "bg-gray-50 border border-gray-100 text-gray-300"}
                `}
              >
                <span className="font-bold">{dayName}</span>
                {schedule ? (
                  <span className="text-xs text-[#8a7550]">
                    {schedule.startTime}–{schedule.endTime}
                  </span>
                ) : (
                  <span className="text-xs">หยุด</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 3: Two-Column Booking (Calendar + Time Slots)
          ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ───── Left: Calendar ───── */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#f0e6cc] shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-[#3d3522] flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#8a7550]" /> เลือกวัน
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevMonth}
                className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-[#8a7550]" />
              </button>
              <span className="text-sm font-bold text-[#3d3522] min-w-[120px] text-center">
                {MONTH_NAMES_TH[calMonth]} {calYear + 543}
              </span>
              <button
                onClick={goToNextMonth}
                className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-[#8a7550]" />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAY_HEADERS.map((w) => (
              <div
                key={w}
                className="text-center text-[11px] font-bold text-[#8a7550] py-1"
              >
                {w}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((d, i) => {
              const isToday = d.dateStr === todayStr;
              const isSelected = d.dateStr === selectedDate;
              const isPast = d.dateStr < todayStr;
              const isDisabled = !d.current || isPast;

              return (
                <button
                  key={i}
                  disabled={isDisabled}
                  onClick={() => setSelectedDate(d.dateStr)}
                  className={`aspect-square rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer
                    ${isDisabled ? "text-gray-200 cursor-not-allowed" : "hover:bg-[#C6E065]/20"}
                    ${isToday && !isSelected ? "ring-2 ring-[#C6E065] text-[#4A6707] font-bold" : ""}
                    ${isSelected ? "bg-[#C6E065] text-[#3d3522] font-black shadow-md" : ""}
                    ${!isDisabled && !isSelected && !isToday ? "text-[#3d3522]" : ""}
                  `}
                >
                  {d.day}
                </button>
              );
            })}
          </div>

          {/* Selected date label */}
          {selectedDate && (
            <div className="mt-4 pt-4 border-t border-[#f0e6cc] text-center">
              <p className="text-sm text-[#8a7550]">
                เลือก:{" "}
                <span className="font-bold text-[#3d3522]">
                  {new Date(selectedDate).toLocaleDateString("th-TH", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* ───── Right: Time Slots + Booking Button ───── */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#f0e6cc] shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-[#3d3522] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#8a7550]" /> เลือกเวลา
            </h2>
            {selectedDate && !slotsLoading && timeSlots.length > 0 && (
              <span className="text-xs text-[#8a7550] bg-[#faf8f2] px-3 py-1 rounded-full">
                ว่าง {availableCount}/{timeSlots.length}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            {!selectedDate ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-[#8a7550]">
                <CalendarDays className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">กรุณาเลือกวันที่ก่อน</p>
              </div>
            ) : slotsLoading ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-[#8a7550]">
                <Loader2 className="w-8 h-8 animate-spin mb-3 opacity-50" />
                <p className="text-sm font-medium">กำลังตรวจสอบคิวว่าง...</p>
              </div>
            ) : slotsError ? (
              <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>ไม่สามารถโหลดคิวได้ กรุณาลองใหม่</span>
              </div>
            ) : timeSlots.length === 0 ? (
              <div className="flex items-center gap-3 p-4 bg-orange-50 text-orange-700 rounded-2xl text-sm border border-orange-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>ไม่มีคิวว่างสำหรับวันนี้</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {timeSlots.map((slot) => {
                  const isSelected = selectedSlot === slot.time;
                  return (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`relative py-3 px-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer
                        ${!slot.available ? "bg-gray-50 text-gray-300 cursor-not-allowed line-through border border-gray-100" : ""}
                        ${slot.available && !isSelected ? "bg-[#faf8f2] text-[#3d3522] border border-[#f0e6cc] hover:border-[#C6E065] hover:bg-[#C6E065]/10" : ""}
                        ${isSelected ? "bg-[#C6E065] text-[#3d3522] shadow-md ring-2 ring-[#C6E065]/50" : ""}
                      `}
                    >
                      {slot.time}
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 absolute top-1 right-1 text-[#4A6707]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Booking Button */}
          <div className="mt-6 pt-6 border-t border-[#f0e6cc]">
            {selectedSlot && (
              <div className="bg-[#faf8f2] rounded-2xl p-4 mb-4 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8a7550]">วันที่</span>
                  <span className="font-bold text-[#3d3522]">
                    {new Date(selectedDate).toLocaleDateString("th-TH", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8a7550]">เวลา</span>
                  <span className="font-bold text-[#3d3522]">
                    {selectedSlot} น.
                  </span>
                </div>
                <div className="h-px bg-[#f0e6cc]" />
                <div className="flex justify-between items-center">
                  <span className="text-[#8a7550]">ค่าบริการ</span>
                  <span className="text-lg font-black text-[#3d3522]">
                    ฿{Number(nutritionist.consultationFee).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleBooking}
              disabled={!selectedSlot || isBooking}
              className="w-full py-4 bg-[#C6E065] text-[#3d3522] font-bold text-base rounded-2xl hover:bg-[#b8d450] active:scale-[0.98] transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isBooking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  กำลังจอง...
                </>
              ) : (
                "จองปรึกษา"
              )}
            </button>

            {!selectedSlot && selectedDate && timeSlots.length > 0 && (
              <p className="text-center text-xs text-[#8a7550] mt-3">
                เลือกเวลาที่ต้องการเพื่อจองคิว
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
