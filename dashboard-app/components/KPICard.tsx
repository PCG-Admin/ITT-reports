
"use client";
import styles from './KPICard.module.css';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface KPICardProps {
    title: string;
    value: number | string;
    subtext?: string;
    trend?: 'up' | 'down' | 'neutral';
    color?: 'default' | 'success' | 'warning' | 'danger';
    icon?: React.ReactNode;
    target?: string | number;
}

// Generate dummy sparkline data deterministically based on title/value
const generateSparkData = (seed: string) => {
    // Simple pseudo-random
    const data = [];
    let start = 50;
    for (let i = 0; i < 10; i++) {
        start = start + (Math.random() - 0.5) * 20;
        data.push({ v: start });
    }
    return data;
};

export default function KPICard({ title, value, subtext, trend, color = 'default', icon, target }: KPICardProps) {
    const sparkData = generateSparkData(title);

    const getBadge = () => {
        if (color === 'success') return <span className={`${styles.badge} ${styles.badgeSuccess}`}><TrendingUp size={12} /> Performing</span>;
        if (color === 'warning') return <span className={`${styles.badge} ${styles.badgeWarning}`}><Minus size={12} /> Attention</span>;
        if (color === 'danger') return <span className={`${styles.badge} ${styles.badgeDanger}`}><TrendingDown size={12} /> Critical</span>;
        return null;
    };

    return (
        <motion.div
            className={styles.cardWrapper}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className={styles.kpiCard}>
                <div className={styles.glow} />

                <div>
                    <div className={styles.header}>
                        <span className={styles.title}>{title}</span>
                        {icon && <div className={styles.iconWrapper}>{icon}</div>}
                    </div>

                    <div className={styles.valueContainer}>
                        <h2 className={styles.value}>{value}</h2>
                        {getBadge()}
                    </div>
                </div>

                <div className={styles.footer}>
                    <div>
                        {target && <div className={styles.subtext}>Target: {target}</div>}
                        <div className={styles.subtext}>{subtext}</div>
                    </div>

                    <div className={styles.sparklineArea}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sparkData}>
                                <Line
                                    type="monotone"
                                    dataKey="v"
                                    stroke={color === 'danger' ? '#ef4444' : color === 'success' ? '#10b981' : '#3b82f6'}
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
