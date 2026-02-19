'use client';

import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface Nutritionist {
    id: string;
    firstName: string;
    lastName: string;
    licenseNumber: string | null;
    consultationFee: number;
    verificationStatus: string;
    user: { email: string };
    // ⬇️ เพิ่มใหม่
    nutritionistSpecialties?: {
        specialty: { id: number; name: string };
    }[];
}

export default function NutritionistCard({ nutritionist }: { nutritionist: Nutritionist }) {
    const avatarUrl = `https://ui-avatars.com/api/?name=${nutritionist.firstName}+${nutritionist.lastName}&background=C6E065&color=3d3522&size=300&bold=true`;
    const router = useRouter();

    // ดึง specialty names ออกมา แสดงแค่ 2 tags แรก
    const specialties = nutritionist.nutritionistSpecialties?.map(ns => ns.specialty.name) ?? [];
    const displaySpecialties = specialties.slice(0, 2);
    const remaining = specialties.length - 2;

    return (
        <div className="bg-white rounded-3xl border-2 border-[#f0e6cc] hover:border-[#C6E065] hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
            onClick={() => router.push(`/dashboard/nutrition/${nutritionist.id}`)}
        >
            <div className="aspect-[4/3] bg-gradient-to-br from-[#f4ebd0] to-[#e8d5a8] relative overflow-hidden">
                <img
                    src={avatarUrl}
                    alt={`${nutritionist.firstName} ${nutritionist.lastName}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {nutritionist.verificationStatus === 'approved' && (
                    <span className="absolute top-3 left-3 bg-[#C6E065] text-[#3d3522] text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full">
                        ยืนยันแล้ว
                    </span>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-bold text-[#3d3522] text-base mb-1 group-hover:text-[#4A6707] transition-colors">
                    {nutritionist.firstName} {nutritionist.lastName}
                </h3>
                {/* Specialty Tags */}
                {displaySpecialties.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {displaySpecialties.map((name) => (
                            <span key={name} className="text-[10px] font-bold bg-[#C6E065]/20 text-[#4A6707] px-2.5 py-1 rounded-full">
                                {name}
                            </span>
                        ))}
                        {remaining > 0 && (
                            <span className="text-[10px] font-bold text-[#8a7550] px-2 py-1">
                                +{remaining}
                            </span>
                        )}
                    </div>
                )}
                <div className="mt-3 pt-3 border-t border-[#f0e6cc] flex items-center justify-between">
                    <span className="text-xs text-[#8a7550]">ค่าปรึกษา</span>
                    <span className="text-sm font-black text-[#3d3522]">
                        ฿{Number(nutritionist.consultationFee).toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
}