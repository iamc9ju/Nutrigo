import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  description?: string;
  icon?: ReactNode;
  colorClass?: string;
  children?: ReactNode;
}

export default function StatCard({
  title,
  value,
  unit,
  description,
  icon,
  children,
}: StatCardProps) {
  return (
    <div className="bg-white p-5 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between h-full hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-[#3d3522] text-sm font-bold">{title}</h3>
        {icon}
      </div>

      <div className="mb-2">
        <span className="text-3xl font-black text-[#3d3522] tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-gray-400 text-sm ml-1 font-medium">{unit}</span>
        )}
      </div>
      {children}
      {description && (
        <p className="text-[10px] text-gray-400 font-medium mt-2">
          {description}
        </p>
      )}
    </div>
  );
}
