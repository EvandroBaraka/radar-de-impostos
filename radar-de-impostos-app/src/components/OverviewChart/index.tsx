import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";

interface OverviewChartProps {
    data: {
        name: string;
        gastos: number;
        impostos: number;
    }[];
}

export function OverviewChart({ data }: OverviewChartProps) {
    return (
        <div className="lg:col-span-2 bg-[#0f172a]/50 border border-[#334155] rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-6">
                Evolução dos Gastos vs Impostos
            </h3>
            <div className="h-87.5 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient
                                id="colorGastos"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                            <linearGradient
                                id="colorImpostos"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#ef4444"
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#ef4444"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#1e293b"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="name"
                            stroke="#475569"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#475569"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `R$ ${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#0f172a",
                                borderColor: "#334155",
                                borderRadius: "8px",
                                color: "#fff",
                            }}
                            itemStyle={{ color: "#fff" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="gastos"
                            name="Gastos"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorGastos)"
                        />
                        <Area
                            type="monotone"
                            dataKey="impostos"
                            name="Impostos"
                            stroke="#ef4444"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorImpostos)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
