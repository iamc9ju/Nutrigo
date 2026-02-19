'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { User, Calendar, Heart, Droplets, ChevronRight, ChevronLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import { DatePicker } from '@/components/ui/DatePicker';
import { format } from 'date-fns';

interface CompleteProfileRequest {
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
    bloodType?: string;
    chronicDiseases?: string[];
}

const genderOptions = [
    { value: 'male', label: 'ชาย', emoji: '👨' },
    { value: 'female', label: 'หญิง', emoji: '👩' },
    { value: 'other', label: 'อื่นๆ', emoji: '🧑' },
] as const;

const bloodTypeOptions = ['A', 'B', 'AB', 'O'];

const commonDiseases = [
    'เบาหวาน',
    'ความดันโลหิตสูง',
    'โรคหัวใจ',
    'ไขมันในเลือดสูง',
    'โรคไต',
    'โรคหอบหืด',
    'ภูมิแพ้',
    'โรคกระเพาะ',
];

export default function CompleteProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
    const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
    const [bloodType, setBloodType] = useState('');
    const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
    const [customDisease, setCustomDisease] = useState('');

    const [step, setStep] = useState(1);
    const totalSteps = 4;

    const toggleDisease = (disease: string) => {
        setSelectedDiseases((prev) =>
            prev.includes(disease) ? prev.filter((d) => d !== disease) : [...prev, disease]
        );
    };

    const addCustomDisease = () => {
        if (customDisease.trim() && !selectedDiseases.includes(customDisease.trim())) {
            setSelectedDiseases((prev) => [...prev, customDisease.trim()]);
            setCustomDisease('');
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload: CompleteProfileRequest = {};
            if (dateOfBirth) payload.dateOfBirth = format(dateOfBirth, 'yyyy-MM-dd');
            if (gender) payload.gender = gender;
            if (bloodType) payload.bloodType = bloodType;
            if (selectedDiseases.length > 0) payload.chronicDiseases = selectedDiseases;

            await api.post('/patients/complete-profile', payload);

            await Swal.fire({
                icon: 'success',
                title: 'บันทึกโปรไฟล์สำเร็จ!',
                text: 'ข้อมูลสุขภาพของคุณถูกบันทึกเรียบร้อยแล้ว',
                timer: 1500,
                confirmButtonColor: '#C6E065',
                color: '#3d3522',
                background: '#faf8f2',
            });

            router.push('/dashboard');
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: err.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้',
                confirmButtonColor: '#ef4444',
                color: '#3d3522',
                background: '#faf8f2',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#faf8f2]">
            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-[#3d3522] mb-2">สร้างโปรไฟล์สุขภาพ</h1>
                    <p className="text-[#8a7550]">ตอบคำถามสั้นๆ เพื่อให้เรารู้จักคุณมากขึ้น</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8 px-2">
                    <div className="flex justify-between text-sm font-bold text-[#8a7550] mb-2">
                        <span>ขั้นตอนที่ {step}</span>
                        <span>{Math.round((step / totalSteps) * 100)}%</span>
                    </div>
                    <div className="h-4 bg-[#e6dec3] rounded-full p-1 shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-[#C6E065] to-[#aacc00] rounded-full transition-all duration-500 ease-out shadow-[0_2px_4px_rgba(198,224,101,0.4)]"
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-[32px] border border-[#f0e6cc] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
                    {/* Decorative background elements (Clipped) */}
                    <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C6E065]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#8a7550]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                    </div>

                    <div className="relative z-10 p-8 min-h-[320px] flex flex-col justify-center">
                        {/* Step 1: วันเกิด */}
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-[#C6E065]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#5e7a00]">
                                        <Calendar className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-black text-[#3d3522]">วันเกิดของคุณ</h2>
                                    <p className="text-[#8a7550] mt-1">เราจะใช้ข้อมูลนี้เพื่อคำนวณแผนสุขภาพที่เหมาะสมกับวัย</p>
                                </div>

                                <div className="relative group">
                                    <DatePicker
                                        selected={dateOfBirth}
                                        onSelect={setDateOfBirth}
                                        placeholder="เลือกวันเกิดของคุณ"
                                    />
                                    <div className="mt-3 text-center text-xs text-[#8a7550]/60 font-medium">
                                        * ข้อมูลนี้จะถูกเก็บเป็นความลับ
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: เพศ */}
                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-[#C6E065]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#5e7a00]">
                                        <User className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-black text-[#3d3522]">เพศของคุณ</h2>
                                    <p className="text-[#8a7550] mt-1">เพื่อการคำนวณปริมาณพลังงานที่แม่นยำ</p>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {genderOptions.map((g) => (
                                        <button
                                            key={g.value}
                                            onClick={() => setGender(g.value)}
                                            className={`relative w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all duration-300 group
                                                ${gender === g.value
                                                    ? 'bg-[#C6E065] border-[#C6E065] shadow-[0_4px_12px_rgba(198,224,101,0.4)] scale-[1.02]'
                                                    : 'bg-[#faf8f2] border-[#f0e6cc] hover:border-[#C6E065]/50 hover:bg-[#fffff0]'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white/50 shadow-sm
                                                ${gender === g.value ? 'bg-white/80' : ''}`}
                                            >
                                                {g.emoji}
                                            </div>
                                            <span className={`text-lg font-bold ${gender === g.value ? 'text-[#3d3522]' : 'text-[#8a7550]'}`}>
                                                {g.label}
                                            </span>
                                            {gender === g.value && (
                                                <div className="absolute right-4 w-6 h-6 bg-[#3d3522] rounded-full flex items-center justify-center text-[#C6E065]">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 3: หมู่เลือด */}
                        {step === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-[#C6E065]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#5e7a00]">
                                        <Droplets className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-black text-[#3d3522]">หมู่เลือดของคุณ</h2>
                                    <p className="text-[#8a7550] mt-1">ข้อมูลนี้ช่วยให้เราแนะนำอาหารได้ดียิ่งขึ้น</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {bloodTypeOptions.map((bt) => (
                                        <button
                                            key={bt}
                                            onClick={() => setBloodType(bt)}
                                            className={`aspect-square rounded-3xl border-2 flex flex-col items-center justify-center transition-all duration-300
                                                ${bloodType === bt
                                                    ? 'bg-[#C6E065] border-[#C6E065] shadow-[0_8px_20px_rgba(198,224,101,0.4)] scale-105 rotate-1'
                                                    : 'bg-[#faf8f2] border-[#f0e6cc] hover:border-[#dcd0b0] hover:scale-105'
                                                }`}
                                        >
                                            <span className={`text-4xl font-black mb-1 ${bloodType === bt ? 'text-[#3d3522]' : 'text-[#8a7550]'}`}>
                                                {bt}
                                            </span>
                                            <span className={`text-xs font-bold uppercase tracking-wider ${bloodType === bt ? 'text-[#3d3522]/80' : 'text-[#8a7550]/60'}`}>
                                                Blood Type
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 4: โรคประจำตัว */}
                        {step === 4 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-[#C6E065]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#5e7a00]">
                                        <Heart className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-black text-[#3d3522]">โรคประจำตัว</h2>
                                    <p className="text-[#8a7550] mt-1">เลือกรายการที่ตรงกับคุณ (เลือกได้มากกว่า 1)</p>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto pr-2 -mr-2 space-y-4">
                                    <div className="flex flex-wrap gap-2.5 justify-center">
                                        {commonDiseases.map((disease) => (
                                            <button
                                                key={disease}
                                                onClick={() => toggleDisease(disease)}
                                                className={`px-5 py-3 rounded-full text-sm font-bold border-2 transition-all duration-200
                                                    ${selectedDiseases.includes(disease)
                                                        ? 'bg-[#3d3522] border-[#3d3522] text-[#C6E065] shadow-lg scale-105'
                                                        : 'bg-[#faf8f2] border-[#f0e6cc] text-[#8a7550] hover:border-[#C6E065] hover:text-[#3d3522]'
                                                    }`}
                                            >
                                                {disease}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="pt-4 border-t border-[#f0e6cc]">
                                        <p className="text-sm font-bold text-[#3d3522] mb-3 ml-1">อื่นๆ / ระบุเพิ่มเติม</p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="พิมพ์ชื่อโรค..."
                                                value={customDisease}
                                                onChange={(e) => setCustomDisease(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && addCustomDisease()}
                                                className="flex-1 px-5 py-3 bg-[#faf8f2] rounded-xl border-2 border-[#f0e6cc] focus:border-[#C6E065] outline-none text-[#3d3522] text-sm font-medium transition-all"
                                            />
                                            <button
                                                onClick={addCustomDisease}
                                                className="px-6 py-3 bg-[#C6E065] text-[#3d3522] rounded-xl font-bold text-sm hover:bg-[#b8d450] active:scale-95 transition-all"
                                            >
                                                เพิ่ม
                                            </button>
                                        </div>
                                    </div>

                                    {/* Selected Summary */}
                                    {selectedDiseases.length > 0 && (
                                        <div className="bg-[#faf8f2] rounded-2xl p-4 border border-[#f0e6cc]">
                                            <p className="text-xs text-[#8a7550] mb-2 font-bold uppercase tracking-wider">รายการที่เลือก:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedDiseases.map((d) => (
                                                    <span
                                                        key={d}
                                                        onClick={() => toggleDisease(d)}
                                                        className="px-3 py-1.5 bg-white border border-[#e6dec3] text-[#3d3522] rounded-lg text-xs font-bold cursor-pointer hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all flex items-center gap-1.5"
                                                    >
                                                        {d} <span className="text-[10px] opacity-50">✕</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-10 pt-6 border-t border-[#f0e6cc] m-4">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex items-center gap-2 px-4 py-2 text-[#8a7550] font-bold hover:text-[#3d3522] transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                ย้อนกลับ
                            </button>
                        ) : (
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="px-4 py-2 text-[#8a7550]/60 font-bold hover:text-[#8a7550] transition-colors text-sm"
                            >
                                ข้ามไปก่อน
                            </button>
                        )}

                        {step < totalSteps ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="flex items-center gap-2 px-4 py-2 text-[#8a7550] font-bold hover:text-[#3d3522] transition-colors"
                            >
                                ถัดไป
                                {/* วงกลมพื้นหลังไอคอนเพื่อเน้นลูกศร */}

                                <ChevronRight className="w-5 h-5" />

                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex items-center gap-2 px-8 py-3.5 bg-[#C6E065] text-[#3d3522] font-black rounded-2xl hover:bg-[#b8d450] hover:shadow-[0_4px_15px_rgba(198,224,101,0.5)] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        กำลังบันทึก...
                                    </span>
                                ) : (
                                    'บันทึกข้อมูลเริ่มต้น'
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Footer Link */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-xs text-[#8a7550]/50 font-bold hover:text-[#8a7550] transition-colors"
                    >
                        ข้ามการตั้งค่านี้ไปก่อน
                    </button>
                </div>
            </div>
        </div>
    );
}