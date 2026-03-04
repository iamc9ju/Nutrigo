"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense, useRef } from "react";
import {
    CheckCircle2,
    Loader2,
    ArrowLeft,
    QrCode,
    Clock,
    Shield,
} from "lucide-react";
import { appointmentsApi } from "@/app/services/appointments";
import Swal from "sweetalert2";

function PaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const appointmentId = searchParams.get("appointmentId");
    const qrCodeUrl = searchParams.get("qrCodeUrl");
    const amount = searchParams.get("amount");
    const chargeId = searchParams.get("chargeId");

    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 min countdown
    const timeLeftRef = useRef(timeLeft);

    useEffect(() => {
        timeLeftRef.current = timeLeft;
    }, [timeLeft]);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((t) => {
                const nav = t - 1;
                if (nav <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return nav;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(() => {
        if (!appointmentId) return;

        let isMounted = true;
        const pollInterval = setInterval(async () => {
            // Use ref to get the latest time
            if (timeLeftRef.current <= 0) {
                clearInterval(pollInterval);
                return;
            }

            try {
                const response = await appointmentsApi.getById(appointmentId);
                const status = response.data.status;

                if (status === "confirmed" && isMounted) {
                    clearInterval(pollInterval);
                    Swal.fire({
                        title: "ชำระเงินสำเร็จ!",
                        text: "ระบบกำลังพาท่านไปยังหน้าการนัดหมาย",
                        icon: "success",
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                        allowOutsideClick: false,
                    });
                    router.push("/dashboard/appointments");
                }
            } catch (error) {
                console.error("Polling error:", error);
            }
        }, 10000); // Poll every 10 seconds

        return () => {
            isMounted = false;
            clearInterval(pollInterval);
        };
    }, [appointmentId, router]); // Removed timeLeft from dependencies

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    if (!qrCodeUrl || !appointmentId) {
        return (
            <div className="text-center py-20">
                <div className="text-5xl mb-4">⚠️</div>
                <p className="text-lg font-bold text-[#3d3522] mb-2">
                    ไม่พบข้อมูลการชำระเงิน
                </p>
                <button
                    onClick={() => router.push("/dashboard/nutrition")}
                    className="mt-4 inline-flex items-center gap-2 text-[#4A6707] font-semibold hover:underline cursor-pointer"
                >
                    ← กลับหน้ารายชื่อนักโภชนาการ
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto space-y-6">

            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[#8a7550] hover:text-[#3d3522] font-bold transition-colors cursor-pointer"
            >
                <ArrowLeft className="w-5 h-5" /> กลับ
            </button>

            {/* Payment Card */}
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#f0e6cc] shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-[#C6E065]/20 text-[#4A6707] px-4 py-2 rounded-full text-sm font-bold mb-4">
                        <QrCode className="w-4 h-4" /> PromptPay
                    </div>
                    <h1 className="text-2xl font-black text-[#3d3522]">
                        ชำระเงินด้วย QR Code
                    </h1>
                    <p className="text-sm text-[#8a7550] mt-1">
                        สแกน QR Code ด้านล่างผ่านแอปธนาคาร
                    </p>
                </div>

                {/* QR Code Image */}
                <div className="bg-[#faf8f2] rounded-2xl p-6 mb-6">
                    <div className="bg-white rounded-xl p-4 mx-auto w-fit shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={qrCodeUrl}
                            alt="PromptPay QR Code"
                            className="w-60 h-60 object-contain mx-auto"
                        />
                    </div>
                </div>

                {/* Amount */}
                <div className="bg-[#faf8f2] rounded-2xl p-5 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-[#8a7550] font-medium">
                            ยอดชำระ
                        </span>
                        <span className="text-3xl font-black text-[#3d3522]">
                            ฿{Number(amount).toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Timer */}
                <div
                    className={`flex items-center justify-center gap-3 py-3 rounded-2xl text-sm font-bold mb-6 ${timeLeft > 300
                        ? "bg-[#C6E065]/10 text-[#4A6707]"
                        : timeLeft > 0
                            ? "bg-red-50 text-red-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                >
                    <Clock className="w-4 h-4" />
                    {timeLeft > 0 ? (
                        <span>
                            เหลือเวลา {minutes}:{String(seconds).padStart(2, "0")} นาที
                        </span>
                    ) : (
                        <span>QR Code หมดอายุ กรุณาจองใหม่อีกครั้ง</span>
                    )}
                </div>

                {/* Info */}
                <div className="space-y-3 text-xs text-[#8a7550]">
                    <div className="flex items-start gap-2">
                        <Shield className="w-4 h-4 mt-0.5 text-[#C6E065] flex-shrink-0" />
                        <span>
                            ชำระเงินผ่านระบบ Omise ที่ได้รับมาตรฐาน PCI DSS Level 1
                        </span>
                    </div>
                    <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#C6E065] flex-shrink-0" />
                        <span>
                            หลังชำระเงินสำเร็จ ระบบจะยืนยันนัดหมายอัตโนมัติ
                        </span>
                    </div>
                    {chargeId && (
                        <div className="pt-2 border-t border-[#f0e6cc]">
                            <span className="text-[10px] text-gray-300">
                                Ref: {chargeId}
                            </span>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-[#C6E065]" />
                </div>
            }
        >
            <PaymentContent />
        </Suspense>
    );
}
