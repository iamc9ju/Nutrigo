'use client';

import { Carrot, Apple, Banana, Cherry, Citrus, Leaf, Grape } from 'lucide-react';

export default function BackgroundPattern() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.1]">
            {/* We create a repeated tile using a flex wrap container that overflows */}
            <div className="flex flex-wrap gap-32 p-12 -ml-12 -mt-12 w-[150%] h-[150%] transform -rotate-12">
                {Array.from({ length: 60 }).map((_, i) => (
                    <div key={i} className="flex gap-32 items-center">
                        <Carrot className="w-16 h-16 text-[#e8914f]" />
                        <Apple className="w-14 h-14 text-[#e06c75]" />
                        <Leaf className="w-12 h-12 text-[#98c379]" />
                        <Citrus className="w-14 h-14 text-[#d19a66]" />
                        <Cherry className="w-12 h-12 text-[#e06c75]" />
                        <Banana className="w-14 h-14 text-[#e5c07b]" />
                        <Grape className="w-12 h-12 text-[#c678dd]" />
                    </div>
                ))}
            </div>
        </div>
    );
}
