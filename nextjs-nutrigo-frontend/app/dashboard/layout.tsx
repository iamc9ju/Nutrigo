'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import Sidebar from '@/component/dashboard/Sidebar';
import RightPanel from '@/component/dashboard/RightPanel';
import BackgroundPattern from '@/component/dashboard/BackgroundPattern';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { checkAuth, isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            checkAuth();
        }
    }, [isAuthenticated, checkAuth]);

    return (
        <div className="min-h-screen bg-[#FFFBF2] relative overflow-hidden">
            <BackgroundPattern />

            <Sidebar />
            <main className="ml-64 mr-0 xl:mr-80 min-h-screen p-8 transition-all duration-300 relative z-10">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
            <RightPanel />
        </div>
    );
}