'use client'
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ArrowLeft, Star, Mail, BadgeCheck, Calendar, MessageSquare, Clock, MapPin } from 'lucide-react';

interface NutritionistDetail {
    id: string;
    firstName: string;
    lastName: string;
    licenseNumber: string | null;
    consultationFee: number;
    verificationStatus: string;
    user: { email: string };
    nutritionistSpecialties: {
        specialty: { id: number; name: string };
    }[];
    nutritionistSchedules: {
        dayOfWeek: number;
        startTime: string;
        endTime: string;
    }[];
    reviews: {
        rating: number;
        comment: string | null;
        createdAt: string;
        patient: { firstName: string; lastName: string };
    }[];
    avgRating: number;
    totalReviews: number;
}

const dayNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

export default function NutritionistDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [nutritionist, setNutritionist] = useState<NutritionistDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNutritionist = async () => {
            try {
                const res = await api.get<NutritionistDetail>(`/nutritionists/${id}`);
                setNutritionist(res.data);
            } catch (err) {
                console.error('Failed to fetch nutritionist:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNutritionist();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
                <div className="h-8 w-32 bg-gray-100 rounded-full" />
                <div className="bg-white rounded-[32px] p-8 border border-[#f0e6cc]">
                    <div className="flex gap-8">
                        <div className="w-48 h-48 bg-gray-100 rounded-3xl" />
                        <div className="flex-1 space-y-4">
                            <div className="h-8 bg-gray-100 rounded-full w-1/2" />
                            <div className="h-4 bg-gray-100 rounded-full w-1/3" />
                            <div className="h-4 bg-gray-100 rounded-full w-1/4" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!nutritionist) {
        return (
            <div className="text-center py-20">
                <p className="text-[#8a7550] text-lg">ไม่พบข้อมูลนักโภชนาการ</p>
                <button onClick={router.back} className="mt-4 inline-flex items-center gap-2 text-[#4A6707] font-semibold hover:underline cursor-pointer">
                    ← กลับ
                </button>
            </div>
        );
    }

    const avatarUrl = `https://ui-avatars.com/api/?name=${nutritionist.firstName}+${nutritionist.lastName}&background=C6E065&color=3d3522&size=300&bold=true`;
    const specialties = nutritionist.nutritionistSpecialties.map(ns => ns.specialty);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* ปุ่มกลับ */}
            <button onClick={() => router.back()} className="flex items-center gap-2 text-[#8a7550] hover:text-[#3d3522] font-bold transition-colors cursor-pointer">
                <ArrowLeft className="w-5 h-5" /> กลับ
            </button>

            {/* ข้อมูลหลัก */}
            <div className="bg-white rounded-[32px] p-8 border-2 border-[#f0e6cc] shadow-sm">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-48 h-48 rounded-3xl overflow-hidden border-4 border-[#C6E065] shadow-lg flex-shrink-0">
                        <img src={avatarUrl} alt={`${nutritionist.firstName} ${nutritionist.lastName}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black text-[#3d3522]">
                                {nutritionist.firstName} {nutritionist.lastName}
                            </h1>
                            {nutritionist.verificationStatus === 'approved' && (
                                <BadgeCheck className="w-6 h-6 text-[#4A6707] fill-[#C6E065]" />
                            )}
                        </div>
                        <p className="text-[#8a7550] font-medium mb-4">นักโภชนาการ</p>

                        {/* Rating จาก API จริง */}
                        {nutritionist.totalReviews > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={`w-5 h-5 ${i < Math.round(nutritionist.avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-[#3d3522]">{nutritionist.avgRating.toFixed(1)}</span>
                                <span className="text-sm text-[#8a7550]">({nutritionist.totalReviews} รีวิว)</span>
                            </div>
                        )}

                        {/* ข้อมูลเพิ่มเติม */}
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-3 text-[#8a7550]">
                                <Mail className="w-4 h-4" />
                                <span>{nutritionist.user.email}</span>
                            </div>
                            {nutritionist.licenseNumber && (
                                <div className="flex items-center gap-3 text-[#8a7550]">
                                    <BadgeCheck className="w-4 h-4" />
                                    <span>เลขที่ใบอนุญาต: {nutritionist.licenseNumber}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ความเชี่ยวชาญ */}
            {specialties.length > 0 && (
                <div className="bg-white rounded-[32px] p-8 border-2 border-[#f0e6cc] shadow-sm">
                    <h2 className="text-lg font-bold text-[#3d3522] mb-4">ความเชี่ยวชาญ</h2>
                    <div className="flex flex-wrap gap-3">
                        {specialties.map((s) => (
                            <span key={s.id} className="px-4 py-2 bg-[#C6E065]/20 text-[#4A6707] font-bold text-sm rounded-full border border-[#C6E065]/40">
                                {s.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* ตารางเวลา */}
            {nutritionist.nutritionistSchedules.length > 0 && (
                <div className="bg-white rounded-[32px] p-8 border-2 border-[#f0e6cc] shadow-sm">
                    <h2 className="text-lg font-bold text-[#3d3522] mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#8a7550]" /> ตารางเวลาให้คำปรึกษา
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {nutritionist.nutritionistSchedules.map((schedule, i) => (
                            <div key={i} className="flex items-center justify-between bg-[#faf8f2] rounded-xl px-5 py-3">
                                <span className="font-bold text-[#3d3522]">วัน{dayNames[schedule.dayOfWeek]}</span>
                                <span className="text-sm text-[#8a7550] font-medium">
                                    {schedule.startTime} - {schedule.endTime}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ค่าบริการ + ปุ่มนัดปรึกษา */}
            <div className="bg-white rounded-[32px] p-8 border-2 border-[#f0e6cc] shadow-sm">
                <h2 className="text-lg font-bold text-[#3d3522] mb-4">ค่าบริการ</h2>
                <div className="flex items-center justify-between bg-[#faf8f2] rounded-2xl p-6 mb-6">
                    <div>
                        <p className="text-sm text-[#8a7550]">ค่าปรึกษาต่อครั้ง</p>
                        <p className="text-3xl font-black text-[#3d3522]">
                            ฿{Number(nutritionist.consultationFee).toLocaleString()}
                        </p>
                    </div>
                    <span className="text-4xl">💰</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-3 py-4 bg-[#C6E065] text-[#3d3522] font-bold rounded-2xl hover:bg-[#b8d450] active:scale-[0.97] transition-all shadow-md">
                        <Calendar className="w-5 h-5" /> นัดปรึกษา
                    </button>
                    <button className="flex items-center justify-center gap-3 py-4 bg-[#3d3522] text-white font-bold rounded-2xl hover:bg-[#2c2518] active:scale-[0.97] transition-all shadow-md">
                        <MessageSquare className="w-5 h-5" /> ส่งข้อความ
                    </button>
                </div>
            </div>

            {/* รีวิวจากผู้ใช้ */}
            {nutritionist.reviews.length > 0 && (
                <div className="bg-white rounded-[32px] p-8 border-2 border-[#f0e6cc] shadow-sm">
                    <h2 className="text-lg font-bold text-[#3d3522] mb-6">
                        รีวิวจากผู้ใช้ ({nutritionist.totalReviews})
                    </h2>
                    <div className="space-y-4">
                        {nutritionist.reviews.map((review, i) => (
                            <div key={i} className="bg-[#faf8f2] rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-[#3d3522]">
                                        {review.patient.firstName} {review.patient.lastName}
                                    </span>
                                    <span className="text-xs text-[#8a7550]">
                                        {new Date(review.createdAt).toLocaleDateString('th-TH')}
                                    </span>
                                </div>
                                <div className="flex gap-0.5 mb-2">
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <Star key={j} className={`w-4 h-4 ${j < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                    ))}
                                </div>
                                {review.comment && (
                                    <p className="text-sm text-[#8a7550]">{review.comment}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}