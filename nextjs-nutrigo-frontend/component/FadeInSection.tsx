"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface FadeInSectionProps {
    children: ReactNode;
    className?: string;
}

export default function FadeInSection({ children, className = "" }: FadeInSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.02 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div style={{ perspective: "1200px" }}>
            <div
                ref={ref}
                className={`${className}`}
                style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible
                        ? "translateY(0) scale(1) rotateX(0deg)"
                        : "translateY(120px) scale(0.9) rotateX(8deg)",
                    filter: isVisible ? "blur(0px)" : "blur(10px)",
                    transition: "all 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    transformOrigin: "center top",
                }}
            >
                {children}
            </div>
        </div>
    );
}
