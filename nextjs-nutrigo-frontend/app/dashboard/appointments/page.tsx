"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { appointmentsApi } from "@/app/services/appointments";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import Swal from "sweetalert2";
import Link from "next/link";
import {
    Calendar,
    Clock,
    User,
    ChevronRight,
    Loader2,
    CalendarDays,
    Video,
    AlertCircle,
} from "lucide-react";

interface Appointment {
    appointmentId: string;
    startTime: string;
    endTime: string;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    type: string;
    nutritionist: {
        firstName: string;
        lastName: string;
    };
    chargeId?: string;
    payment?: {
        amount: number;
        qrCodeUrl: string;
    };
}

export default function AppointmentsPage() {
    const router = useRouter(); // Need router for redirect
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleDetailsClick = async (appt: Appointment) => {
        if (appt.status === "pending") {
            try {
                // Fetch full details to get payment info if not present
                const response = await appointmentsApi.getById(appt.appointmentId);
                const fullAppt = response.data;

                if (fullAppt.payment) {
                    const params = new URLSearchParams({
                        appointmentId: fullAppt.appointmentId,
                        qrCodeUrl: fullAppt.payment.qrCodeUrl,
                        amount: fullAppt.payment.amount.toString(),
                        chargeId: fullAppt.chargeId || "",
                    });
                    router.push(`/dashboard/payment?${params.toString()}`);
                }
            } catch (error) {
                console.error("Failed to fetch appointment details:", error);
                Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: "ไม่สามารถดึงข้อมูลการชำระเงินได้",
                    icon: "error",
                });
            }
        } else {
            // Show details for non-pending appointments
            Swal.fire({
                title: `<span class="text-2xl font-black text-[#3d3522]">รายละเอียดการนัดหมาย</span>`,
                html: `
                    <div class="text-left space-y-4 p-2">
                        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                            <div class="w-10 h-10 bg-[#C6E065]/20 rounded-full flex items-center justify-center text-[#4A6707]">
                                <User class="w-5 h-5" />
                            </div>
                            <div>
                                <p class="text-[10px] font-bold text-[#8a7550] uppercase">นักโภชนาการ</p>
                                <p class="font-bold text-[#3d3522]">นพ. ${appt.nutritionist.firstName} ${appt.nutritionist.lastName}</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="p-3 bg-gray-50 rounded-2xl">
                                <p class="text-[10px] font-bold text-[#8a7550] uppercase mb-1">วันที่</p>
                                <p class="text-sm font-bold text-[#3d3522]">${format(new Date(appt.startTime), "d MMMM yyyy", { locale: th })}</p>
                            </div>
                            <div class="p-3 bg-gray-50 rounded-2xl">
                                <p class="text-[10px] font-bold text-[#8a7550] uppercase mb-1">เวลา</p>
                                <p class="text-sm font-bold text-[#3d3522]">${format(new Date(appt.startTime), "HH:mm")} - ${format(new Date(appt.endTime), "HH:mm")} น.</p>
                            </div>
                        </div>
                        <div class="p-3 bg-gray-50 rounded-2xl">
                            <p class="text-[10px] font-bold text-[#8a7550] uppercase mb-1">ประเภท</p>
                            <p class="text-sm font-bold text-[#3d3522]">${appt.type === "online" ? "ปรึกษาออนไลน์ (Video Call)" : "นัดพบที่คลินิก"}</p>
                        </div>
                        <div class="p-3 ${appt.status === "confirmed" ? "bg-[#C6E065]/10" : "bg-gray-50"} rounded-2xl">
                            <p class="text-[10px] font-bold text-[#8a7550] uppercase mb-1">สถานะ</p>
                            <p class="text-sm font-bold ${appt.status === "confirmed" ? "text-[#4A6707]" : "text-[#3d3522]"}">
                                ${appt.status === "confirmed" ? "✅ ยืนยันแล้ว" : appt.status === "completed" ? "🏁 เสร็จสิ้น" : "❌ ยกเลิก"}
                            </p>
                        </div>
                    </div>
                `,
                confirmButtonText: "ตกลง",
                confirmButtonColor: "#C6E065",
                customClass: {
                    popup: "rounded-[32px] p-6",
                    confirmButton: "rounded-xl px-8 py-3 font-bold text-[#3d3522]",
                },
            });
        }
    };

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await appointmentsApi.getMyAppointments();
                setAppointments(response.data);
            } catch (error) {
                console.error("Failed to fetch appointments:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const getStatusStyles = (status: Appointment["status"]) => {
        switch (status) {
            case "confirmed":
                return "bg-[#C6E065]/20 text-[#4A6707] border-[#C6E065]/30";
            case "pending":
                return "bg-amber-50 text-amber-600 border-amber-100";
            case "completed":
                return "bg-blue-50 text-blue-600 border-blue-100";
            case "cancelled":
                return "bg-red-50 text-red-600 border-red-100";
            default:
                return "bg-gray-50 text-gray-500 border-gray-100";
        }
    };

    const getStatusLabel = (status: Appointment["status"]) => {
        switch (status) {
            case "confirmed":
                return "ยืนยันแล้ว";
            case "pending":
                return "รอการชำระเงิน";
            case "completed":
                return "เสร็จสิ้น";
            case "cancelled":
                return "ยกเลิกแล้ว";
            default:
                return status;
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-[#C6E065]" />
                <p className="text-[#8a7550] font-medium animate-pulse">กำลังโหลดข้อมูลการนัดหมาย...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#3d3522]">
                        การนัดหมายของฉัน
                    </h1>
                    <p className="text-[#8a7550] mt-1 font-medium">
                        ติดตามและจัดการตารางการปรึกษากับนักโภชนาการของคุณ
                    </p>
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl border border-[#f0e6cc] shadow-sm flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-[#C6E065]" />
                    <span className="text-sm font-bold text-[#3d3522]">
                        {appointments.length} รายการทั้งหมด
                    </span>
                </div>
            </div>

            {appointments.length === 0 ? (
                <div className="bg-white rounded-[40px] p-12 text-center border border-[#f0e6cc] shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
                    <div className="w-20 h-20 bg-[#FFFBF2] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-10 h-10 text-[#C6E065]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#3d3522] mb-2">ยังไม่มีการนัดหมาย</h3>
                    <p className="text-[#8a7550] mb-8">คุณยังไม่มีรายการนัดหมายในขณะนี้ เริ่มต้นดูแลสุขภาพด้วยการปรึกษานักโภชนาการ</p>
                    <Link
                        href="/dashboard/nutrition"
                        className="inline-flex items-center gap-2 bg-[#C6E065] text-[#3d3522] px-8 py-4 rounded-2xl font-black hover:bg-[#b8d450] transition-all shadow-lg shadow-[#C6E065]/20 hover:scale-105 active:scale-95"
                    >
                        จองคิวนักโภชนาการ
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {appointments.map((appt) => (
                        <div
                            key={appt.appointmentId}
                            className="group bg-white rounded-[32px] p-6 border border-[#f0f0f0] hover:border-[#C6E065] hover:shadow-[0_20px_50px_rgba(198,224,101,0.08)] transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Status Ribbon (Subtle) */}
                            <div className={`absolute top-0 right-0 px-6 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest border-l border-b ${getStatusStyles(appt.status)}`}>
                                {getStatusLabel(appt.status)}
                            </div>

                            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12">
                                {/* Date & Time */}
                                <div className="flex items-center gap-5 lg:border-r lg:border-gray-100 lg:pr-12">
                                    <div className="w-14 h-14 bg-[#FFFBF2] rounded-2xl flex flex-col items-center justify-center border border-[#f0e6cc] group-hover:bg-[#C6E065]/10 group-hover:border-[#C6E065]/30 transition-colors">
                                        <span className="text-[10px] font-bold text-[#8a7550] uppercase">{format(new Date(appt.startTime), "MMM", { locale: th })}</span>
                                        <span className="text-xl font-black text-[#3d3522]">{format(new Date(appt.startTime), "d")}</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-[#3d3522] font-bold mb-1">
                                            <Calendar className="w-4 h-4 text-[#C6E065]" />
                                            <span>{format(new Date(appt.startTime), "EEEEที่ d MMMM yyyy", { locale: th })}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[#8a7550] text-sm font-medium">
                                            <Clock className="w-4 h-4" />
                                            <span>{format(new Date(appt.startTime), "HH:mm")} - {format(new Date(appt.endTime), "HH:mm")} น.</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Nutritionist */}
                                <div className="flex-1 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-[#8a7550]">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#8a7550] mb-0.5">นักโภชนาการ</p>
                                        <h4 className="text-lg font-black text-[#3d3522]">
                                            นพ. {appt.nutritionist.firstName} {appt.nutritionist.lastName}
                                        </h4>
                                    </div>
                                </div>

                                {/* Type & Action */}
                                <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 pt-4 lg:pt-0">
                                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-xs font-bold text-[#3d3522]">
                                        <Video className="w-4 h-4 text-[#C6E065]" />
                                        <span>{appt.type === "online" ? "ปรึกษาออนไลน์" : "นัดพบที่คลินิก"}</span>
                                    </div>

                                    <button
                                        onClick={() => handleDetailsClick(appt)}
                                        className="flex items-center gap-2 text-[#C6E065] hover:text-[#4A6707] font-bold transition-colors group/btn"
                                    >
                                        รายละเอียด <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            {/* Notification if Pending */}
                            {appt.status === "pending" && (
                                <div className="mt-4 flex items-center gap-2 text-xs text-amber-600 bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    <span>กรุณาชำระเงินให้เรียบร้อยเพื่อยืนยันการนัดหมาย</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
