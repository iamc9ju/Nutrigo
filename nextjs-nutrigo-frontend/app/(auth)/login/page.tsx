'use client';

import api from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';

import { AxiosError } from 'axios';

interface ApiErrorResponse {
    message: string;
}
interface LoginForm {
    email: string;
    password: string;
}

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginForm>();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const login = useAuthStore((state) => state.login);
    const router = useRouter();


    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        setError('');


        try {
            const res = await api.post('/auth/login', data);

            await Swal.fire({
                icon: 'success',
                title: 'เข้าสู่ระบบสำเร็จ!',
                text: 'ยินดีต้อนรับเข้าสู่ระบบ',
                timer: 1500,
                showConfirmButton: false,
                color: '#3d3522',
                confirmButtonColor: '#C6E065'
            });

            login(res.data.user);
            if (rememberMe) {
                localStorage.setItem('savedEmail', data.email);
            } else {
                localStorage.removeItem('savedEmail');
            }

            router.push('/');
        } catch (err) {
            const error = err as AxiosError<ApiErrorResponse>;
            if (error.response) {

            }
            setError(error.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const savedEmail = localStorage.getItem('savedEmail');
        if (savedEmail) {
            setValue('email', savedEmail);
            setRememberMe(true);
        }
    }, [setValue]);

    return (
        <>
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-11 h-11 bg-[#C6E065] rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-xl">🍽️</span>
                    </div>
                    <span className="font-black text-[#3d3522] text-lg tracking-wide">NutriGo</span>
                </div>
                <h2 className="text-4xl font-black text-[#3d3522] leading-tight mb-2">
                    เข้าสู่ระบบ
                </h2>
                <p className="text-[#8a7550]">กรอกข้อมูลด้านล่างเพื่อเข้าใช้งาน</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm mb-6 border border-red-100 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" autoComplete='off'>
                <div>
                    <label className="text-xs font-bold text-[#8a7550] uppercase tracking-[0.15em] mb-2 block">อีเมล</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-[14px] w-5 h-5 text-[#c9b88a]" />
                        <input
                            {...register('email', { required: 'กรุณากรอกอีเมล' })}
                            className="w-full pl-12 pr-4 py-[13px] bg-white rounded-2xl border-2 border-[#f0e6cc] focus:border-[#C6E065] focus:shadow-[0_0_0_3px_rgba(198,224,101,0.15)] outline-none transition-all text-[#3d3522] font-medium placeholder-[#c9b88a] shadow-[0_2px_8px_rgba(180,160,110,0.08)]"
                            placeholder="you@example.com"
                            autoComplete="new-password"
                        />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email.message as string}</p>}
                </div>

                <div>
                    <label className="text-xs font-bold text-[#8a7550] uppercase tracking-[0.15em] mb-2 block">รหัสผ่าน</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-[14px] w-5 h-5 text-[#c9b88a]" />
                        <input
                            {...register('password', { required: 'กรุณากรอกรหัสผ่าน' })}
                            type={showPassword ? 'text' : 'password'}
                            className="w-full pl-12 pr-12 py-[13px] bg-white rounded-2xl border-2 border-[#f0e6cc] focus:border-[#C6E065] focus:shadow-[0_0_0_3px_rgba(198,224,101,0.15)] outline-none transition-all text-[#3d3522] font-medium placeholder-[#c9b88a] shadow-[0_2px_8px_rgba(180,160,110,0.08)]"
                            placeholder="••••••••"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-[14px] text-[#c9b88a] hover:text-[#4A6707] transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password.message as string}</p>}
                </div>

                <div className="flex justify-between items-center pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="accent-[#4A6707] w-4 h-4 rounded" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                        <span className="text-sm text-[#8a7550]">จดจำฉัน</span>
                    </label>
                    <a href="#" className="text-sm text-[#4A6707] font-semibold hover:underline">ลืมรหัสผ่าน?</a>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-[#3d3522] text-white font-bold rounded-2xl text-base hover:bg-[#2c2518] active:scale-[0.97] transition-all shadow-lg hover:shadow-xl group mt-2"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            กำลังเข้าสู่ระบบ...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            เข้าสู่ระบบ
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                    )}
                </button>
            </form>

            <div className="flex items-center gap-4 mt-8">
                <div className="flex-1 h-px bg-[#e8d5a8]/40"></div>
                <span className="text-xs text-[#c9b88a] font-medium">หรือ</span>
                <div className="flex-1 h-px bg-[#e8d5a8]/40"></div>
            </div>

            <p className="mt-6 text-center text-[#8a7550] text-sm">
                ยังไม่มีบัญชี?{' '}
                <Link href="/register" className="text-[#4A6707] font-bold hover:underline">สมัครสมาชิกเลย</Link>
            </p>
        </>
    );
}


