
"use client";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Text, ReferenceLine } from 'recharts';
import styles from './ChartStyles.module.css';

interface DataRow {
    name: string;
    total_kgs: number;
    fail_pct: number;
    type: string;
}

interface EfficiencyChartProps {
    data: DataRow[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className={styles.customTooltip}>
                <p className={styles.tooltipHeader}>{data.name}</p>
                <div className={styles.tooltipRow}>
                    <span>Volume: </span>
                    <span style={{ fontWeight: 600 }}>{data.total_kgs.toLocaleString()} kg</span>
                </div>
                <div className={styles.tooltipRow}>
                    <span>Fail Rate: </span>
                    <span style={{ fontWeight: 600, color: data.fail_pct > 5 ? '#ef4444' : '#10b981' }}>{data.fail_pct.toFixed(2)}%</span>
                </div>
            </div>
        );
    }
    return null;
};

export default function EfficiencyChart({ data }: EfficiencyChartProps) {
    const chartData = data
        .filter(d => d.type === 'Branch' && d.total_kgs > 0);

    const avgFail = 5; // illustrative threshold
    const maxFail = Math.max(...chartData.map(d => d.fail_pct)) + 2;
    const maxVol = Math.max(...chartData.map(d => d.total_kgs)) * 1.1;

    return (
        <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
                <div>
                    <h3 className={styles.chartTitle}>Efficiency Matrix</h3>
                    <p className={styles.chartSubtitle}>Volume vs. Error Rate Analysis</p>
                </div>
            </div>

            <div style={{ width: '100%', height: 350, position: 'relative' }}>
                <ResponsiveContainer>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                            type="number"
                            dataKey="total_kgs"
                            name="Volume"
                            unit="kg"
                            stroke="#94a3b8"
                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                            domain={[0, maxVol]}
                        />
                        <YAxis
                            type="number"
                            dataKey="fail_pct"
                            name="Fail Rate"
                            unit="%"
                            stroke="#94a3b8"
                            domain={[0, maxFail]}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />

                        {/* Quadrant Lines */}
                        <ReferenceLine y={avgFail} stroke="#cbd5e1" strokeDasharray="3 3" />
                        <ReferenceLine x={maxVol / 2} stroke="#cbd5e1" strokeDasharray="3 3" />

                        {/* Background Shading for High Fail Quadrant (Top Right) */}
                        <ReferenceLine
                            segment={[{ x: maxVol / 2, y: avgFail }, { x: maxVol, y: avgFail }]}
                            stroke="none"
                        />

                        <Scatter
                            name="Branches"
                            data={chartData}
                            fill="#3b82f6"
                            shape="circle"
                        />
                    </ScatterChart>
                </ResponsiveContainer>

                {/* Overlay Labels (Absolute positioned for simplicity over SVG text) */}
                <div style={{ position: 'absolute', top: 20, right: 30, color: '#ef4444', fontSize: '0.7rem', fontWeight: 600, background: 'rgba(254, 226, 226, 0.5)', padding: '2px 6px', borderRadius: 4 }}>
                    ATTENTION REQUIRED
                </div>
                <div style={{ position: 'absolute', bottom: 40, right: 30, color: '#10b981', fontSize: '0.7rem', fontWeight: 600, background: 'rgba(220, 252, 231, 0.5)', padding: '2px 6px', borderRadius: 4 }}>
                    HIGH PERFORMANCE
                </div>
            </div>
        </div>
    );
}
