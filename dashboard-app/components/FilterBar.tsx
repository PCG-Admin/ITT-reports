
"use client";
import styles from './FilterBar.module.css';
import { Search } from 'lucide-react';

interface FilterBarProps {
    regions: string[];
    selectedRegion: string;
    onRegionChange: (region: string) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export default function FilterBar({ regions, selectedRegion, onRegionChange, searchTerm, onSearchChange }: FilterBarProps) {
    return (
        <div className={styles.container}>
            <div className={styles.filterGroup}>
                <label className={styles.label}>Region:</label>
                <select
                    className={styles.select}
                    value={selectedRegion}
                    onChange={(e) => onRegionChange(e.target.value)}
                >
                    <option value="All">All Regions</option>
                    {regions.map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
            </div>

            <div className={styles.searchGroup}>
                <Search className={styles.searchIcon} size={18} />
                <input
                    type="text"
                    placeholder="Search branches..."
                    className={styles.input}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </div>
    );
}
