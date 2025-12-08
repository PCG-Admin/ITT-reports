
"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from '../ChartStyles.module.css';

interface DataRow {
    name: string;
    pods_outstanding: number;
    pods_outstanding_1week: number;
    age_analysis: number; // assuming this is "older" or similar metric from excel
    type: string;
}

interface AgeBreakdownProps {
    data: DataRow[];
}

export default function AgeBreakdown({ data }: AgeBreakdownProps) {
    // Aggregate by Region
    const regions = data.filter(d => d.type === 'Region' && d.name !== 'TOTAL');

    // Map data to display current vs 1week vs aged
    const chartData = regions.map(r => ({
        name: r.name,
        current: r.pods_outstanding,
        weekOld: r.pods_outstanding_1week,
        aged: r.age_analysis // from excel "Age Analysis" column, assume it means old outstanding
    }));

    return (
        <div className={styles.chartContainer} style={{ minHeight: '350px' }}>
            <div className={styles.chartHeader}>
                <div>
                    <h3 className={styles.chartTitle}>POD Age Analysis</h3>
                    <p className={styles.chartSubtitle}>Outstanding PODs by age bucket</p>
                </div>
            </div>

            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#64748b" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                        <Legend />
                        <Bar dataKey="current" name="Current" stackId="a" fill="#3b82f6" />
                        <Bar dataKey="weekOld" name="1 Week" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="aged" name="Aged (>1w)" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '10px', textAlign: 'center' }}>
                💡 Insight: High red bars indicate backlogs in processing aged documentation.
            </div>
        </div>
    );
}
