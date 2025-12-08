
"use client";
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import rawData from './data.json';
import KPICard from '@/components/KPICard';
import LeagueTable from '@/components/LeagueTable';
import RegionalChart from '@/components/RegionalChart';
import EfficiencyChart from '@/components/EfficiencyChart';
import PerformanceTrend from '@/components/PerformanceTrend';
import FilterBar from '@/components/FilterBar';

// New Insights
import FailHeatmap from '@/components/insights/FailHeatmap';
import WorkloadBubble from '@/components/insights/WorkloadBubble';
import AgeBreakdown from '@/components/insights/AgeBreakdown';
import ManifestKPIs from '@/components/insights/ManifestKPIs';
import BranchClassification from '@/components/insights/BranchClassification';

import { Package, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Simulate smooth loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const regions = Array.from(new Set(rawData
    .filter(d => d.type === 'Branch' && d.region_group)
    .map(d => d.region_group!)
  )).sort();

  const filteredData = useMemo(() => {
    return rawData.filter(item => {
      const matchRegion = selectedRegion === "All"
        ? true
        : (item.type === 'Region' && item.name === selectedRegion) || item.region_group === selectedRegion;

      const matchSearch = searchTerm
        ? item.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      return matchRegion && matchSearch;
    });
  }, [selectedRegion, searchTerm]);

  // Metrics Logic
  const metrics = useMemo(() => {
    if (selectedRegion === 'All' && !searchTerm) {
      const totalRow = rawData.find(d => d.name === 'TOTAL');
      return {
        totalKgs: totalRow?.total_kgs || 0,
        totalVerbalsPct: totalRow?.verbals_collected_pct || 0,
        totalPodsPct: totalRow?.pods_collected_pct || 0,
        totalFails: totalRow?.total_fails || 0
      };
    }
    const branches = filteredData.filter(d => d.type === 'Branch');
    const sumTotalVerbals = branches.reduce((acc, curr) => acc + curr.total_verbals, 0);
    const sumVerbalsCollected = branches.reduce((acc, curr) => acc + (curr.total_verbals - curr.verbals_outstanding), 0);
    const avgVerbalsPct = sumTotalVerbals > 0 ? (sumVerbalsCollected / sumTotalVerbals) * 100 : 0;
    const avgPodsPct = branches.length > 0 ? branches.reduce((acc, c) => acc + c.pods_collected_pct, 0) / branches.length : 0;
    const totalKgs = branches.reduce((acc, curr) => acc + curr.total_kgs, 0);
    const totalFails = branches.reduce((acc, curr) => acc + curr.total_fails, 0);

    return { totalKgs, totalVerbalsPct: avgVerbalsPct || 0, totalPodsPct: avgPodsPct || 0, totalFails };
  }, [filteredData, selectedRegion, searchTerm]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="dashboard-container" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div className={styles.spinner}></div>
          <p style={{ color: '#64748b' }}>Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.main
      className="dashboard-container"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Daily Operations Summary</h1>
          <p className={styles.subtitle}>Logistics Performance Overview • 25 Nov 2025</p>
        </div>
        <div className={styles.status}>
          <span className={styles.pulse}></span> Live Data
        </div>
      </header>

      <motion.div variants={itemVariants}>
        <FilterBar
          regions={regions}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </motion.div>

      <motion.div className={styles.grid} variants={itemVariants}>
        <KPICard
          title="Total KGs Handled"
          value={metrics.totalKgs.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          trend="up"
          icon={<Package size={20} color="#fff" />}
          subtext={selectedRegion === 'All' ? "All Regions" : selectedRegion}
          color="default"
        />
        <KPICard
          title="POD Collection %"
          value={`${metrics.totalPodsPct.toFixed(2)}%`}
          trend="neutral"
          icon={<CheckCircle size={20} color="#fff" />}
          subtext="Daily Target"
          target="99%"
          color={metrics.totalPodsPct > 98 ? "success" : "warning"}
        />
        <KPICard
          title="Verbal Collection %"
          value={`${metrics.totalVerbalsPct.toFixed(2)}%`}
          trend="neutral"
          icon={<Activity size={20} color="#fff" />}
          subtext="Daily Target"
          target="98%"
          color={metrics.totalVerbalsPct > 98 ? "success" : "warning"}
        />
        <KPICard
          title="Total Fails"
          value={metrics.totalFails}
          trend="down"
          icon={<AlertTriangle size={20} color="#fff" />}
          subtext="Critical Items"
          color={metrics.totalFails > 100 ? "danger" : "warning"}
        />
      </motion.div>

      <div className={styles.mainContent}>
        {/* Left Column (Charts - Width 50%) */}
        <div className={styles.chartsColumn}>
          <motion.section className={styles.card} variants={itemVariants}>
            <RegionalChart data={rawData} />
          </motion.section>

          <motion.section className={styles.card} variants={itemVariants}>
            <PerformanceTrend data={rawData} />
          </motion.section>

          <motion.section className={styles.card} variants={itemVariants}>
            <AgeBreakdown data={rawData} />
          </motion.section>
        </div>

        {/* Right Column (Table & Detail - Width 50%) */}
        <div className={styles.tablesColumn}>
          {/* New KPI Tiles for Manifest */}
          <motion.div variants={itemVariants}>
            <ManifestKPIs data={filteredData} />
          </motion.div>

          <motion.section className={styles.card} variants={itemVariants}>
            <h2 className={styles.sectionTitle}>Performance League Table</h2>
            <LeagueTable data={filteredData} />
          </motion.section>

          {/* Moved Heatmap here to fill vertical space */}
          <motion.section className={styles.card} variants={itemVariants}>
            <FailHeatmap data={filteredData} />
          </motion.section>

          <motion.div variants={itemVariants}>
            <BranchClassification data={filteredData} />
          </motion.div>
        </div>
      </div>

      {/* Bottom Row - Deep Dive Analytics */}
      <div className={styles.bottomRow}>
        <motion.section className={styles.card} variants={itemVariants}>
          <WorkloadBubble data={filteredData} />
        </motion.section>
        <motion.section className={styles.card} variants={itemVariants}>
          <EfficiencyChart data={filteredData} />
        </motion.section>
      </div>

    </motion.main>
  );
}
