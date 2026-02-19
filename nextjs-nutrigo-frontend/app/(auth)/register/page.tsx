'use client';

import api from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Eye, EyeOff, CheckCircle2, Stethoscope, Phone } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface ApiErrorResponse {
    message: string;
    error?: string;
    statusCode?: number;
}

interface RegisterForm {
    firstName: string;
    lastName: string;
    role: 'patient' | 'nutritionist' | 'admin';
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
}


interface RegisterResponse {
    message: string;
    userId: string;
}


export default function RegisterPage() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
        defaultValues: {
            role: 'patient',
            phone: ''
        }
    });
    const selectedRole = watch('role');
    const password = watch('password');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();



    const onSubmit = async (data: RegisterForm) => {
        if (isLoading) return;
        const { confirmPassword, ...payload } = data;
        setIsLoading(true);
        setError('');

        try {
            await api.post<RegisterResponse>('/auth/register', payload);
            await Swal.fire({
                icon: 'success',
                title: 'สมัครสมาชิกสำเร็จ!',
                text: 'ยินดีต้อนรับสมาชิกใหม่ของเรา',
                timer: 1500,
                showConfirmButton: false,
                color: '#3d3522',
                confirmButtonColor: '#C6E065'
            });
            router.push('/login?registered=true');
        } catch (err) {
            if (axios.isAxiosError<ApiErrorResponse>(err)) {
                setError(
                    err.response?.data?.message ?? 'สมัครสมาชิกไม่สำเร็จ'
                )
            } else {
                setError('เกิดข้อผิดพลาดที่ไม่คาดคิด')
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* --- ส่วนเลือก Role (เพิ่มใหม่ตรงนี้) --- */}

            <div className="mb-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 bg-[#C6E065] rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-xl">🍽️</span>
                    </div>
                    <span className="font-black text-[#3d3522] text-lg tracking-wide">NutriGo</span>
                </div>
                <h2 className="text-4xl font-black text-[#3d3522] leading-tight mb-2">
                    สมัครสมาชิก
                </h2>
                <p className="text-[#8a7550]">กรอกข้อมูลด้านล่างเพื่อสร้างบัญชีใหม่</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-500 px-4 py-3 rounded-2xl text-sm mb-4 border border-red-100 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                </div>
            )}



            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" >
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-bold text-[#8a7550] uppercase tracking-[0.15em] mb-1.5 block">ชื่อ</label>
                        <div className="relative">
                            <User className="absolute left-4 top-[14px] w-5 h-5 text-[#c9b88a]" />
                            <input
                                {...register('firstName', { required: 'กรุณากรอกชื่อ' })}
                                className="w-full pl-12 pr-4 py-[13px] bg-white rounded-2xl border-2 border-[#f0e6cc] focus:border-[#C6E065] focus:shadow-[0_0_0_3px_rgba(198,224,101,0.15)] outline-none transition-all text-[#3d3522] font-medium placeholder-[#c9b88a] shadow-[0_2px_8px_rgba(180,160,110,0.08)]"
                                placeholder="ชื่อจริง"
                            />
                        </div>
                        {errors.firstName && <p className="text-red-400 text-xs mt-1 ml-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs font-bold text-[#8a7550] uppercase tracking-[0.15em] mb-1.5 block">นามสกุล</label>
                        <div className="relative">
                            <input
                                {...register('lastName', { required: 'กรุณากรอกนามสกุล' })}
                                className="w-full px-4 py-[13px] bg-white rounded-2xl border-2 border-[#f0e6cc] focus:border-[#C6E065] focus:shadow-[0_0_0_3px_rgba(198,224,101,0.15)] outline-none transition-all text-[#3d3522] font-medium placeholder-[#c9b88a] shadow-[0_2px_8px_rgba(180,160,110,0.08)]"
                                placeholder="นามสกุล"
                            />
                        </div>
                        {errors.lastName && <p className="text-red-400 text-xs mt-1 ml-1">{errors.lastName.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-[#8a7550] uppercase tracking-[0.15em] mb-1.5 block">อีเมล</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-[14px] w-5 h-5 text-[#c9b88a]" />
                        <input
                            {...register('email', {
                                required: 'กรุณากรอกอีเมล',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'รูปแบบอีเมลไม่ถูกต้อง'
                                }
                            })}
                            className="w-full pl-12 pr-4 py-[13px] bg-white rounded-2xl border-2 border-[#f0e6cc] focus:border-[#C6E065] focus:shadow-[0_0_0_3px_rgba(198,224,101,0.15)] outline-none transition-all text-[#3d3522] font-medium placeholder-[#c9b88a] shadow-[0_2px_8px_rgba(180,160,110,0.08)]"
                            placeholder="you@example.com"
                        />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="text-xs font-bold text-[#8a7550] uppercase tracking-[0.15em] mb-1.5 block">เบอร์โทรศัพท์</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-[14px] w-5 h-5 text-[#c9b88a]" />
                        <input
                            {...register('phone', {
                                required: 'กรุณากรอกเบอร์โทรศัพท์',
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก'
                                }
                            })}
                            className="w-full pl-12 pr-4 py-[13px] bg-white rounded-2xl border-2 border-[#f0e6cc] focus:border-[#C6E065] focus:shadow-[0_0_0_3px_rgba(198,224,101,0.15)] outline-none transition-all text-[#3d3522] font-medium placeholder-[#c9b88a] shadow-[0_2px_8px_rgba(180,160,110,0.08)]"
                            placeholder="08XXXXXXXX"
                        />
                    </div>
                    {errors.phone && <p className="text-red-400 text-xs mt-1 ml-1">{errors.phone.message}</p>}
                </div>

                <div>
                    <label className="text-xs font-bold text-[#8a7550] uppercase tracking-[0.15em] mb-1.5 block">รหัสผ่าน</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-[14px] w-5 h-5 text-[#c9b88a]" />
                        <input
                            {...register('password', {
                                required: 'กรุณากรอกรหัสผ่าน',
                                minLength: {
                                    value: 8,
                                    message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'
                                }
                            })}
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            className="w-full pl-12 pr-12 py-[13px] bg-white rounded-2xl border-2 border-[#f0e6cc] focus:border-[#C6E065] focus:shadow-[0_0_0_3px_rgba(198,224,101,0.15)] outline-none transition-all text-[#3d3522] font-medium placeholder-[#c9b88a] shadow-[0_2px_8px_rgba(180,160,110,0.08)]"
                            placeholder="อย่างน้อย 8 ตัวอักษร"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-[14px] text-[#c9b88a] hover:text-[#4A6707] transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password.message}</p>}
                </div>

                <div>
                    <label className="text-xs font-bold text-[#8a7550] uppercase tracking-[0.15em] mb-1.5 block">ยืนยันรหัสผ่าน</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-[14px] w-5 h-5 text-[#c9b88a]" />
                        <input
                            {...register('confirmPassword', {
                                required: 'กรุณายืนยันรหัสผ่าน',
                                validate: value => value === password || 'รหัสผ่านไม่ตรงกัน'
                            })}
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="w-full pl-12 pr-12 py-[13px] bg-white rounded-2xl border-2 border-[#f0e6cc] focus:border-[#C6E065] focus:shadow-[0_0_0_3px_rgba(198,224,101,0.15)] outline-none transition-all text-[#3d3522] font-medium placeholder-[#c9b88a] shadow-[0_2px_8px_rgba(180,160,110,0.08)]"
                            placeholder="กรอกรหัสผ่านอีกครั้ง"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-[14px] text-[#c9b88a] hover:text-[#4A6707] transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 ml-1">{errors.confirmPassword.message}</p>}
                </div>
                <div>
                    <label className="text-xs font-bold text-[#8a7550] uppercase tracking-[0.15em] mb-3 block">
                        เลือกประเภทบัญชี
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        {/* 1. ปุ่ม Patient */}
                        <label
                            className={`relative cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center gap-3 transition-all duration-200 group
                    ${selectedRole === 'patient'
                                    ? 'bg-[#fcfeda] border-[#C6E065] shadow-[0_0_0_3px_rgba(198,224,101,0.25)]'
                                    : 'bg-white border-[#f0e6cc] hover:border-[#dcd0b0] hover:bg-[#faf8f2]'
                                }`}
                        >
                            <input
                                type="radio"
                                value="patient"
                                {...register('role', { required: 'กรุณาเลือกประเภทบัญชี' })}
                                className="hidden"
                            />
                            <div className={`p-3 rounded-full transition-colors ${selectedRole === 'patient' ? 'bg-[#C6E065] text-[#3d3522]' : 'bg-[#f4ebd0] text-[#8a7550]'}`}>
                                <User className="w-6 h-6" />
                            </div>
                            <span className={`font-bold text-sm ${selectedRole === 'patient' ? 'text-[#3d3522]' : 'text-[#8a7550]'}`}>
                                สมาชิกทั่วไป
                            </span>

                            {/* ไอคอนติ๊กถูกมุมขวาบน (จะโผล่มาเมื่อเลือก) */}
                            {selectedRole === 'patient' && (
                                <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-[#4A6707]" />
                            )}
                        </label>

                        {/* 2. ปุ่ม Nutritionist */}
                        <label
                            className={`relative cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center gap-3 transition-all duration-200 group
                    ${selectedRole === 'nutritionist'
                                    ? 'bg-[#fcfeda] border-[#C6E065] shadow-[0_0_0_3px_rgba(198,224,101,0.25)]'
                                    : 'bg-white border-[#f0e6cc] hover:border-[#dcd0b0] hover:bg-[#faf8f2]'
                                }`}
                        >
                            <input
                                type="radio"
                                value="nutritionist"
                                {...register('role', { required: 'กรุณาเลือกประเภทบัญชี' })}
                                className="hidden"
                            />
                            <div className={`p-3 rounded-full transition-colors ${selectedRole === 'nutritionist' ? 'bg-[#C6E065] text-[#3d3522]' : 'bg-[#f4ebd0] text-[#8a7550]'}`}>
                                <Stethoscope className="w-6 h-6" />
                            </div>
                            <span className={`font-bold text-sm ${selectedRole === 'nutritionist' ? 'text-[#3d3522]' : 'text-[#8a7550]'}`}>
                                นักโภชนาการ
                            </span>

                            {selectedRole === 'nutritionist' && (
                                <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-[#4A6707]" />
                            )}
                        </label>
                    </div>
                    {errors.role && <p className="text-red-400 text-xs mt-2 ml-1 text-center">{errors.role.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-[#3d3522] text-white font-bold rounded-2xl text-base hover:bg-[#2c2518] active:scale-[0.97] transition-all shadow-lg hover:shadow-xl group"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            กำลังสร้างบัญชี...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            สมัครสมาชิก
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                    )}
                </button>
            </form>

            <div className="flex items-center gap-4 mt-5">
                <div className="flex-1 h-px bg-[#e8d5a8]/40"></div>
                <span className="text-xs text-[#c9b88a] font-medium">หรือ</span>
                <div className="flex-1 h-px bg-[#e8d5a8]/40"></div>
            </div>


            <p className="mt-4 text-center text-[#8a7550] text-sm">
                มีบัญชีอยู่แล้ว?{' '}
                <Link href="/login" className="text-[#4A6707] font-bold hover:underline">เข้าสู่ระบบ</Link>
            </p>
        </>
    );
}
