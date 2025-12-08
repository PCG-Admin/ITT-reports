
"use client";
import { useState } from 'react';
import styles from './LeagueTable.module.css';
import { ArrowUpDown, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DataRow {
    name: string;
    total_verbals: number;
    verbals_outstanding: number;
    verbals_collected_pct: number;
    pods_outstanding: number;
    pods_collected_pct: number;
    total_fails: number;
    total_kgs: number;
    type: string;
    region_group?: string;
}

interface LeagueTableProps {
    data: DataRow[];
}

export default function LeagueTable({ data }: LeagueTableProps) {
    const [sortField, setSortField] = useState<keyof DataRow>('total_kgs');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const handleSort = (field: keyof DataRow) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const sortedData = [...data].sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];

        // Handle undefined values
        if (valA === undefined && valB === undefined) return 0;
        if (valA === undefined) return sortDirection === 'asc' ? 1 : -1;
        if (valB === undefined) return sortDirection === 'asc' ? -1 : 1;

        if (typeof valA === 'string' && typeof valB === 'string') {
            return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        // Handle numbers
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const getHeatmapColor = (value: number, type: 'verbal' | 'pod') => {
        const target = type === 'verbal' ? 98 : 99;
        if (value >= target) return styles.success;
        if (value >= target - 2) return styles.warning;
        return styles.danger;
    };

    const SortIcon = ({ field }: { field: keyof DataRow }) => {
        if (sortField !== field) return <ArrowUpDown size={14} style={{ opacity: 0.3 }} />;
        return sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('name')}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                Branch / Region <SortIcon field="name" />
                            </div>
                        </th>
                        <th onClick={() => handleSort('total_verbals')}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                Total Verbals <SortIcon field="total_verbals" />
                            </div>
                        </th>
                        <th onClick={() => handleSort('verbals_collected_pct')} style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                                Verbal % <SortIcon field="verbals_collected_pct" />
                            </div>
                        </th>
                        <th onClick={() => handleSort('pods_collected_pct')} style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                                POD % <SortIcon field="pods_collected_pct" />
                            </div>
                        </th>
                        <th onClick={() => handleSort('total_fails')}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                Fails <SortIcon field="total_fails" />
                            </div>
                        </th>
                        <th onClick={() => handleSort('total_kgs')}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                Total KGs <SortIcon field="total_kgs" />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <AnimatePresence initial={false}>
                        {sortedData.map((row) => (
                            <motion.tr
                                key={row.name}
                                className={row.type === 'Region' ? styles.regionRow : styles.branchRow}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                layout
                            >
                                <td className={styles.nameCell}>
                                    {row.name}
                                    {row.type === 'Branch' && row.total_fails > 10 && (
                                        <AlertCircle size={12} color="#ef4444" style={{ display: 'inline', marginLeft: 6 }} />
                                    )}
                                </td>
                                <td>{row.total_verbals.toLocaleString()}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <span className={`${styles.badge} ${getHeatmapColor(row.verbals_collected_pct, 'verbal')}`}>
                                        {row.verbals_collected_pct.toFixed(2)}%
                                    </span>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <span className={`${styles.badge} ${getHeatmapColor(row.pods_collected_pct, 'pod')}`}>
                                        {row.pods_collected_pct.toFixed(2)}%
                                    </span>
                                </td>
                                <td>
                                    <span style={{ fontWeight: row.total_fails > 0 ? 600 : 400, color: row.total_fails > 0 ? '#ef4444' : 'inherit' }}>
                                        {row.total_fails}
                                    </span>
                                </td>
                                <td className={styles.kgs}>
                                    {row.total_kgs.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </td>
                            </motion.tr>
                        ))}
                    </AnimatePresence>
                </tbody>
            </table>
        </div>
    );
}
