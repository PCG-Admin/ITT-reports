
"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import styles from './ChartStyles.module.css';

interface DataRow {
    name: string;
    verbals_collected_pct: number;
    pods_collected_pct: number;
    type: string;
}

interface PerformanceTrendProps {
    data: DataRow[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className={styles.customTooltip}>
                <p className={styles.tooltipHeader}>{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className={styles.tooltipRow}>
                        <div className={styles.tooltipDot} style={{ background: entry.color }} />
                        <span>{entry.name}: </span>
                        <span style={{ fontWeight: 600, marginLeft: 4 }}>{entry.value.toFixed(2)}%</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function PerformanceTrend({ data }: PerformanceTrendProps) {
    const chartData = data
        .filter(d => d.type === 'Region' && d.name !== 'TOTAL')
        .sort((a, b) => b.verbals_collected_pct - a.verbals_collected_pct);

    return (
        <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
                <div>
                    <h3 className={styles.chartTitle}>Region Performance Comparison</h3>
                    <p className={styles.chartSubtitle}>Verbal vs POD Collection %</p>
                </div>
            </div>

            <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={2}>
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
                            domain={[90, 100]}
                            stroke="#64748b"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />

                        <ReferenceLine y={98} label="Target 98%" stroke="#10b981" strokeDasharray="3 3" />

                        <Bar
                            dataKey="verbals_collected_pct"
                            name="Verbals %"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1500}
                        />
                        <Bar
                            dataKey="pods_collected_pct"
                            name="PODs %"
                            fill="#f59e0b" // Warm amber to clearly differentiate from Verbals bar
                            radius={[4, 4, 0, 0]}
                            animationDuration={1500}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
