
"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styles from './ChartStyles.module.css';

interface DataRow {
    name: string;
    total_kgs: number;
    type: string;
}

interface RegionalChartProps {
    data: DataRow[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className={styles.customTooltip}>
                <p className={styles.tooltipHeader}>{label}</p>
                <div className={styles.tooltipRow}>
                    <span className={styles.tooltipDot} style={{ background: '#3b82f6' }} />
                    <span>{payload[0].value.toLocaleString()} KGs</span>
                </div>
            </div>
        );
    }
    return null;
};

export default function RegionalChart({ data }: RegionalChartProps) {
    const chartData = data
        .filter(d => d.type === 'Region' && d.name !== 'TOTAL')
        .sort((a, b) => b.total_kgs - a.total_kgs);

    const maxValue = Math.max(...chartData.map(d => d.total_kgs));

    return (
        <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
                <div>
                    <h3 className={styles.chartTitle}>Total KGs by Region</h3>
                    <p className={styles.chartSubtitle}>Regional volume distribution</p>
                </div>
            </div>

            <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="name"
                            stroke="#64748b"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            stroke="#64748b"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12 }}
                            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                        <Bar
                            dataKey="total_kgs"
                            radius={[6, 6, 0, 0]}
                            animationDuration={1500}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.total_kgs === maxValue ? 'url(#goldGradient)' : 'url(#blueGradient)'}
                                />
                            ))}
                        </Bar>

                        <defs>
                            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8} />
                            </linearGradient>
                            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#eab308" stopOpacity={1} />
                                <stop offset="100%" stopColor="#facc15" stopOpacity={0.8} />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
