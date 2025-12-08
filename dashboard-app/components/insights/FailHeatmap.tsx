
"use client";
import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import styles from '../ChartStyles.module.css';

interface DataRow {
    name: string;
    total_fails: number;
    type: string;
    region_group?: string;
}

interface FailHeatmapProps {
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
                    <span>Fails: </span>
                    <span style={{ fontWeight: 600, color: '#ef4444' }}>{data.value}</span>
                </div>
            </div>
        );
    }
    return null;
};

export default function FailHeatmap({ data }: FailHeatmapProps) {
    // Filter branches with fails
    const treeData = data
        .filter(d => d.type === 'Branch' && d.total_fails > 0)
        .map(d => ({
            name: d.name,
            size: d.total_fails, // Size of box
            fill: d.total_fails > 50 ? '#b91c1c' : d.total_fails > 20 ? '#ef4444' : '#fca5a5'
        }))
        .sort((a, b) => b.size - a.size);

    return (
        <div className={styles.chartContainer} style={{ minHeight: '350px' }}>
            <div className={styles.chartHeader}>
                <div>
                    <h3 className={styles.chartTitle}>Fail Hotspots</h3>
                    <p className={styles.chartSubtitle}>Distribution of failures by volume</p>
                </div>
            </div>

            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <Treemap
                        data={treeData}
                        dataKey="size"
                        aspectRatio={4 / 3}
                        stroke="#fff"
                        animationDuration={1000}
                    >
                        <Tooltip content={<CustomTooltip />} />
                    </Treemap>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
