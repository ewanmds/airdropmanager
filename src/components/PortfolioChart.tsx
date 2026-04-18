import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface PortfolioChartProps {
    data: { name: string; value: number; color: string }[];
}

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.07) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="rgba(255,255,255,0.9)" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700} fontFamily="JetBrains Mono, monospace">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: '#0D1526', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                <p style={{ color: payload[0].payload.color, fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{payload[0].name}</p>
                <p style={{ color: '#94A3B8', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
                    ${payload[0].value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
            </div>
        );
    }
    return null;
};

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ data }) => {
    const filteredData = data.filter(d => d.value > 0);
    const total = filteredData.reduce((s, d) => s + d.value, 0);

    if (filteredData.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-dt-muted text-sm">
                Enter points to see chart
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row items-center gap-6 h-full">
            {/* Donut chart */}
            <div className="w-full lg:w-[200px] h-full flex-shrink-0" style={{ minHeight: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={filteredData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            innerRadius={44}
                            dataKey="value"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth={2}
                        >
                            {filteredData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2 flex-1 w-full">
                {filteredData.map(entry => {
                    const pct = total > 0 ? (entry.value / total) * 100 : 0;
                    return (
                        <div key={entry.name} className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: entry.color, boxShadow: `0 0 6px ${entry.color}60` }} />
                            <span className="text-sm font-medium text-dt-secondary flex-1">{entry.name}</span>
                            <span className="text-xs font-mono text-dt-text tabular-nums">${entry.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                            <span className="text-[10px] font-bold text-dt-muted w-10 text-right tabular-nums">{pct.toFixed(1)}%</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
