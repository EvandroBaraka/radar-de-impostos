import { TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    change?: string;
    isPositive?: boolean;
    description?: string;
    icon: React.ElementType;
}

export function StatCard({
    title,
    value,
    change,
    isPositive,
    description,
    icon: Icon,
}: StatCardProps) {
    return (
        <div className="bg-[#0f172a]/50 border border-[#334155] rounded-2xl p-6 backdrop-blur-sm hover:border-white/20 transition-colors relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <span className="text-[#90a1b9] text-sm font-medium">
                    {title}
                </span>
                <div className="p-2 rounded-lg bg-[#1e293b] text-[#90a1b9] group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                </div>
            </div>
            <div className="space-y-1">
                <h2 className="text-2xl font-bold">{value}</h2>
                {change && (
                    <div
                        className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-emerald-400" : "text-rose-400"}`}
                    >
                        {isPositive ? (
                            <TrendingUp className="w-3 h-3" />
                        ) : (
                            <TrendingDown className="w-3 h-3" />
                        )}
                        {change}
                        <span className="text-[#475569] ml-1">
                            em relação ao total
                        </span>
                    </div>
                )}
                {description && (
                    <p className="text-xs text-[#475569]">{description}</p>
                )}
            </div>
        </div>
    );
}
