import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "font-bold rounded-xl cursor-pointer transition-all",
                    {

                        "bg-[#A3D133] text-black border-2  hover:-translate-y-1 hover:translate-x-0 ": variant === 'primary',


                        "bg-white text-black border-2 hover:-translate-y-1 hover:translate-x-0 ": variant === 'outline',


                        "px-4 py-2 text-sm": size === 'sm',
                        "px-6 py-3 text-base": size === 'md',
                        "px-8 py-4 text-lg": size === 'lg',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';

export default Button;
