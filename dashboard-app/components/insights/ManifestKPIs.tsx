
"use client";
import React from 'react';
import { FileText, Scale } from 'lucide-react';
import styles from './Insights.module.css';

interface DataRow {
    name: string;
    manifests_total: number;
    manifests_open: number;
    kgs_per_manifest: number;
    type: string;
}

interface ManifestKPIsProps {
    data: DataRow[];
}

export default function ManifestKPIs({ data }: ManifestKPIsProps) {
    // Determine context (Total or filtered)
    // If no specific filter (or ALL), assume data passed is the full set, we find TOTAL row.
    // If filtered, we aggregate branches.

    // For simplicity, let's aggregate whatever is passed to be robust
    const relevantData = data.filter(d => d.type === 'Branch');

    // Metrics
    const totalManifests = relevantData.reduce((acc, c) => acc + c.manifests_total, 0);
    const openManifests = relevantData.reduce((acc, c) => acc + c.manifests_open, 0);
    // Weighted avg for efficiency? Or sum KGs / sum Manifests?
    // Let's use avg of column kgs_per_manifest for simplicity or recalculate
    // Recalculate is safer:
    // Actually we don't have raw KGs per manifest for each row easily summable to get global avg without weights.
    // Let's us weighted avg.
    const totalKGs = relevantData.reduce((acc, c) => acc + (c.kgs_per_manifest * c.manifests_total), 0);
    const avgKGPerManifest = totalManifests > 0 ? totalKGs / totalManifests : 0;

    // Open %
    const openPct = totalManifests > 0 ? (openManifests / totalManifests) * 100 : 0;

    return (
        <div className={styles.kpiRow}>
            <div className={styles.miniCard}>
                <div className={styles.iconBox} style={{ background: '#e0f2fe', color: '#0ea5e9' }}>
                    <FileText size={20} />
                </div>
                <div>
                    <p className={styles.label}>Manifest Efficiency</p>
                    <p className={styles.value}>{avgKGPerManifest.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className={styles.unit}>kg / manifest</span></p>
                </div>
            </div>

            <div className={styles.miniCard}>
                <div className={styles.iconBox} style={{ background: openPct > 5 ? '#fee2e2' : '#dcfce7', color: openPct > 5 ? '#ef4444' : '#166534' }}>
                    <Scale size={20} />
                </div>
                <div>
                    <p className={styles.label}>Open Manifests</p>
                    <p className={styles.value}>{openManifests} <span className={styles.unit}>({openPct.toFixed(1)}%)</span></p>
                </div>
            </div>
        </div>
    );
}
