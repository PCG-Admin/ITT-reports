
"use client";
import React from 'react';
import styles from './Insights.module.css';

interface DataRow {
    name: string;
    verbals_collected_pct: number;
    pods_collected_pct: number;
    total_fails: number;
    type: string;
}

interface BranchClassificationProps {
    data: DataRow[];
}

export default function BranchClassification({ data }: BranchClassificationProps) {
    const branches = data.filter(d => d.type === 'Branch');

    // Logic:
    // Top: >98% PODs AND >98% Verbals AND <5 Fails
    // Critical: <95% PODs OR >20 Fails
    // Warning: Between

    const topPerformers = branches.filter(d => d.pods_collected_pct > 98 && d.verbals_collected_pct > 98 && d.total_fails < 5);
    const critical = branches.filter(d => d.pods_collected_pct < 95 || d.total_fails > 20);
    // Limit display
    const showTop = topPerformers.slice(0, 5);
    const showCritical = critical.sort((a, b) => b.total_fails - a.total_fails).slice(0, 5);

    return (
        <div className={styles.classificationCard}>
            <h3 className={styles.classTitle}>Branch Status Classification</h3>

            <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>🏆 Top Performers</p>
                <div className={styles.tagContainer}>
                    {showTop.length > 0 ? showTop.map(b => (
                        <span key={b.name} className={`${styles.tag} ${styles.tagTop}`}>{b.name}</span>
                    )) : <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>None qualified</span>}
                </div>
            </div>

            <div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>🚨 Critical Attention Needed</p>
                <div className={styles.tagContainer}>
                    {showCritical.length > 0 ? showCritical.map(b => (
                        <span key={b.name} className={`${styles.tag} ${styles.tagCritical}`}>{b.name}</span>
                    )) : <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>All good</span>}
                </div>
            </div>
        </div>
    );
}
