"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Scale, Ruler, Activity, ChevronLeft, Check, Info } from "lucide-react";
import Swal from "sweetalert2";
import {
    usePatientProfile,
    useUpdateHealthMetrics,
} from "@/hooks/usePatientProfile";

export default function HealthMetricsPage() {
    const { data: profile } = usePatientProfile();

    // Use key to re-mount form when profile loads — avoids setState-in-effect
    const profileKey = profile?.healthMetrics ? "loaded" : "loading";

    return (
        <HealthMetricsForm
            key={profileKey}
            initialWeight={profile?.healthMetrics?.weightKg?.toString() ?? ""}
            initialHeight={profile?.healthMetrics?.heightCm?.toString() ?? ""}
            initialBodyFat={profile?.healthMetrics?.bodyFatPercent?.toString() ?? ""}
        />
    );
}

function HealthMetricsForm({
    initialWeight,
    initialHeight,
    initialBodyFat,
}: {
    initialWeight: string;
    initialHeight: string;
    initialBodyFat: string;
}) {
    const router = useRouter();
    const updateMetricsMutation = useUpdateHealthMetrics();
    const isPending = updateMetricsMutation.isPending;
    const [weight, setWeight] = useState(initialWeight);
    const [height, setHeight] = useState(initialHeight);
    const [bodyFat, setBodyFat] = useState(initialBodyFat);

    // BMI is derived state — compute it directly, don't store in useState
    const bmi = useMemo(() => {
        const w = parseFloat(weight);
        const h = parseFloat(height);
        if (w > 0 && h > 0) {
            const hMeter = h / 100;
            return parseFloat((w / (hMeter * hMeter)).toFixed(2));
        }
        return null;
    }, [weight, height]);

    const getBMICategory = (score: number) => {
        if (score < 18.5)
            return {
                label: "น้ำหนักน้อยเกินไป",
                color: "text-blue-500",
                bg: "bg-blue-50",
            };
        if (score < 23)
            return {
                label: "น้ำหนักปกติ",
                color: "text-[#C6E065]",
                bg: "bg-[#C6E065]/10",
            };
        if (score < 25)
            return {
                label: "น้ำหนักเกิน (ท้วม)",
                color: "text-yellow-500",
                bg: "bg-yellow-50",
            };
        if (score < 30)
            return {
                label: "อ้วนระดับ 1",
                color: "text-orange-500",
                bg: "bg-orange-50",
            };
        return { label: "อ้วนระดับ 2", color: "text-red-500", bg: "bg-red-50" };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!weight || !height) return;

        updateMetricsMutation.mutate(
            {
                weightKg: parseFloat(weight),
                heightCm: parseFloat(height),
                bodyFatPercent: bodyFat ? parseFloat(bodyFat) : undefined,
            },
            {
                onSuccess: () => {
                    Swal.fire({
                        icon: "success",
                        title: "บันทึกสำเร็จ!",
                        text: "ข้อมูลสุขภาพของคุณถูกอัปเดตแล้ว",
                        timer: 1500,
                        confirmButtonColor: "#C6E065",
                        color: "#3d3522",
                        background: "#faf8f2",
                    });
                    router.push("/dashboard/setting");
                },
                onError: (err: unknown) => {
                    const error = err as { response?: { data?: { message?: string } } };
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด",
                        text: error.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
                        confirmButtonColor: "#ef4444",
                        color: "#3d3522",
                        background: "#faf8f2",
                    });
                },
            },
        );
    };

    return (
        <div className="min-h-screen bg-[#faf8f2] p-6">
            <div className="max-w-md mx-auto">
                { }
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[#8a7550] font-bold mb-8 hover:text-[#3d3522] transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                    ย้อนกลับ
                </button>
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-[#3d3522] mb-2 uppercase tracking-tight">
                        Health Metrics
                    </h1>
                    <p className="text-[#8a7550] font-medium">
                        บันทึกข้อมูลดัชนีมวลกายของคุณ
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    { }
                    <div className="bg-white rounded-[32px] p-8 border border-[#f0e6cc] shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
                        { }
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-black text-[#3d3522] uppercase tracking-wider">
                                <Scale className="w-4 h-4 text-[#C6E065]" />
                                น้ำหนัก (KG)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="w-full px-6 py-4 bg-[#faf8f2] rounded-2xl border-2 border-[#f0e6cc] focus:border-[#C6E065] focus:ring-4 focus:ring-[#C6E065]/10 outline-none text-xl font-black text-[#3d3522] transition-all"
                                placeholder="0.0"
                                required
                            />
                        </div>
                        { }
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-black text-[#3d3522] uppercase tracking-wider">
                                <Ruler className="w-4 h-4 text-[#C6E065]" />
                                ส่วนสูง (CM)
                            </label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                className="w-full px-6 py-4 bg-[#faf8f2] rounded-2xl border-2 border-[#f0e6cc] focus:border-[#C6E065] focus:ring-4 focus:ring-[#C6E065]/10 outline-none text-xl font-black text-[#3d3522] transition-all"
                                placeholder="0"
                                required
                            />
                        </div>

                        { }
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-black text-[#3d3522] uppercase tracking-wider">
                                <Activity className="w-4 h-4 text-[#C6E065]" />
                                เปอร์เซ็นต์ไขมัน (%)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={bodyFat}
                                onChange={(e) => setBodyFat(e.target.value)}
                                className="w-full px-6 py-4 bg-[#faf8f2] rounded-2xl border-2 border-[#f0e6cc] focus:border-[#C6E065] outline-none text-xl font-black text-[#3d3522] transition-all"
                                placeholder="0.0"
                            />
                        </div>
                    </div>
                    { }
                    <div
                        className={`rounded-[32px] p-8 border-2 transition-all duration-500 ${bmi
                            ? "bg-white border-[#C6E065]/30"
                            : "bg-white/50 border-dashed border-[#f0e6cc]"
                            }`}
                    >
                        {!bmi ? (
                            <div className="text-center py-4 flex flex-col items-center gap-3">
                                <Activity className="w-10 h-10 text-[#f0e6cc]" />
                                <p className="text-[#8a7550]/60 font-bold text-sm">
                                    กรอกข้อมูลเพื่อคำนวณค่า BMI
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs font-black text-[#8a7550] uppercase tracking-widest mb-1">
                                            Your Body Mass Index
                                        </p>
                                        <h2 className="text-5xl font-black text-[#3d3522]">
                                            {bmi}
                                        </h2>
                                    </div>
                                    <div
                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${getBMICategory(bmi).bg} ${getBMICategory(bmi).color}`}
                                    >
                                        {getBMICategory(bmi).label}
                                    </div>
                                </div>

                                { }
                                <div className="h-3 bg-[#faf8f2] rounded-full overflow-hidden flex shadow-inner">
                                    <div
                                        className="h-full bg-blue-400"
                                        style={{ width: "18.5%" }}
                                    />
                                    <div
                                        className="h-full bg-[#C6E065]"
                                        style={{ width: "4.5%" }}
                                    />
                                    <div
                                        className="h-full bg-yellow-400"
                                        style={{ width: "2%" }}
                                    />
                                    <div
                                        className="h-full bg-orange-400"
                                        style={{ width: "5%" }}
                                    />
                                    <div className="h-full bg-red-400" style={{ width: "70%" }} />
                                </div>
                                <p className="text-[10px] text-[#8a7550]/60 font-medium flex items-center gap-1.5 leading-relaxed">
                                    <Info className="w-3 h-3 shrink-0" />
                                    เกณฑ์การวัดสำหรับคนไทย: ค่าน้ำหนักปกติจะอยู่ที่ 18.5 - 22.9
                                </p>
                            </div>
                        )}
                    </div>
                    { }
                    <button
                        type="submit"
                        disabled={isPending || !weight || !height}
                        className="w-full py-5 bg-[#3d3522] text-[#C6E065] font-black rounded-[24px] text-lg shadow-xl shadow-[#3d3522]/20 hover:bg-[#2c2518] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:grayscale disabled:pointer-events-none flex items-center justify-center gap-3"
                    >
                        {isPending ? (
                            <div className="w-6 h-6 border-4 border-[#C6E065]/30 border-t-[#C6E065] rounded-full animate-spin" />
                        ) : (
                            <>
                                <Check className="w-6 h-6" /> บันทึกข้อมูลวันนี้
                            </>
                        )}
                    </button>

                    <p className="text-center text-[11px] text-[#8a7550]/40 font-bold uppercase tracking-widest">
                        NutriGo Health Tracking Systems
                    </p>
                </form>
            </div>
        </div>
    );
}
