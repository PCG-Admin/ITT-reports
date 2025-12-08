
"use client";
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styles from '../ChartStyles.module.css';

interface DataRow {
    name: string;
    total_activities: number; // Y Axis
    fail_pct: number;
    total_kgs: number; // Z Axis (Bubble Size)
    type: string;
}

interface WorkloadBubbleProps {
    data: DataRow[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className={styles.customTooltip}>
                <p className={styles.tooltipHeader}>{data.name}</p>
                <div className={styles.tooltipRow}>Activities: {data.total_activities}</div>
                <div className={styles.tooltipRow}>Volume: {data.total_kgs.toLocaleString()} kg</div>
                <div className={styles.tooltipRow} style={{ color: data.fail_pct > 5 ? '#ef4444' : '#10b981' }}>Fail Rate: {data.fail_pct.toFixed(2)}%</div>
            </div>
        );
    }
    return null;
};

export default function WorkloadBubble({ data }: WorkloadBubbleProps) {
    const chartData = data
        .filter(d => d.type === 'Branch' && d.total_activities > 0)

    return (
        <div className={styles.chartContainer} style={{ minHeight: '350px' }}>
            <div className={styles.chartHeader}>
                <div>
                    <h3 className={styles.chartTitle}>Workload vs. Performance</h3>
                    <p className={styles.chartSubtitle}>Activities (Y) vs Volume (Size) vs Fails (Color logic)</p>
                </div>
            </div>

            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="category" dataKey="name" name="Branch" allowDuplicatedCategory={false} hide />
                        {/* Actually bubble chart usually has 2 continuous axes. Let's do Activities vs Fail Rate? 
                            Prompt requested: Activities ↔ Fail rate ↔ KGs. 
                            Let's map: X=Activities, Y=Fail Rate, Z=KGs
                        */}
                        <XAxis
                            type="number"
                            dataKey="total_activities"
                            name="Activities"
                            unit=""
                            stroke="#94a3b8"
                            tickFormatter={(v) => v.toLocaleString()}
                        />
                        <YAxis
                            type="number"
                            dataKey="fail_pct"
                            name="Fail Rate"
                            unit="%"
                            stroke="#94a3b8"
                        />
                        <ZAxis type="number" dataKey="total_kgs" range={[50, 400]} name="Volume" />
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter name="Branches" data={chartData} fill="#8884d8">
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fail_pct > 8 ? '#ef4444' : entry.fail_pct > 4 ? '#eab308' : '#3b82f6'} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
