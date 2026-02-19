    'use client'
    import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
    import { useState } from 'react';

    export default function QueryProvider({ children }: { children: React.ReactNode }) {
        const [queryClient] = useState(() => new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 60 * 1000,  // ข้อมูลจะสดอยู่ 1 นาที (ไม่เรียกซ้ำถ้าเพิ่งโหลด)
                    retry: 1,
                }
            }
        }));

        return (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
    }