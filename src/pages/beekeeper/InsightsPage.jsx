import React, { useState } from 'react';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { PageHeader, FilterDropdown } from '../../components/common/SharedComponents';
import { beekeeperNavItems } from './BKDashboard';
import { insights as mockInsights } from '../../data/mockData';
import { Lightbulb, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function InsightsPage() {
  const [riskFilter, setRiskFilter] = useState('');

  const filteredInsights = mockInsights.filter(i => 
    !riskFilter || i.riskLevel.toLowerCase() === riskFilter.toLowerCase()
  );

  return (
    <AppLayout sidebar={<Sidebar navItems={beekeeperNavItems} roleLabel="Beekeeper" roleColor="#F4B400" />}>
      <TopNavbar title="AI Anomaly & Pattern Insights" subtitle="Machine Learning Analysis of Telemetry & Hive Health" />
      <PageContent>
        <PageHeader 
          title="AI Diagnostics"
          description="Automated risk detection based on temperature, moisture, and swarm behavior patterns"
          action={
            <FilterDropdown 
              value={riskFilter} 
              onChange={setRiskFilter} 
              options={['Critical', 'Warning', 'Normal']}
              label="Risk Level"
            />
          }
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredInsights.map(insight => {
            const isCritical = insight.riskLevel === 'Critical';
            const isWarning = insight.riskLevel === 'Warning';
            const borderColor = isCritical ? '#B91C2C' : isWarning ? '#D4A000' : '#2E7D32';
            const bgHeader = isCritical ? '#FDECEA' : isWarning ? '#FFF9E6' : '#E8F5E9';

            return (
              <div key={insight.id} className="card" style={{ padding: 24, borderLeft: `6px solid ${borderColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, background: bgHeader, color: borderColor, padding: '4px 10px', borderRadius: 20 }}>
                      {insight.riskLevel.toUpperCase()} RISK (Score: {insight.riskScore}/100)
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#8A8A8A' }}>Hive: {insight.hiveId}</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#8A8A8A' }}>{new Date(insight.timestamp).toLocaleString()}</span>
                </div>

                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#161616', marginBottom: 8 }}>{insight.pattern}</h3>
                
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#8A8A8A', textTransform: 'uppercase', letterSpacing: 0.5 }}>AI Explanation</div>
                  <p style={{ fontSize: 14, color: '#252525', marginTop: 2 }}>{insight.explanation}</p>
                </div>

                <div style={{ background: '#FFFDF7', padding: 14, borderRadius: 10, border: '1px solid #E8E0D0' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#F4B400', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Lightbulb size={16} /> RECOMMENDED ACTION
                  </div>
                  <p style={{ fontSize: 13, color: '#4A4A4A', marginTop: 4, fontWeight: 500 }}>{insight.recommendation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </PageContent>
    </AppLayout>
  );
}
