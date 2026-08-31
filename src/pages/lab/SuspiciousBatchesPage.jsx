import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { PageHeader, StatusBadge, RiskBadge, TrustScoreCard, SearchBar } from '../../components/common/SharedComponents';
import { labNavItems } from './LabDashboard';
import { FlaskConical, Eye, AlertTriangle } from 'lucide-react';

export default function SuspiciousBatchesPage() {
  const { batches } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const flagged = batches
    .filter(b => b.trustScore < 85 || b.riskLevel !== 'Low')
    .sort((a, b) => a.trustScore - b.trustScore);

  const filtered = flagged.filter(b => !search || b.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppLayout sidebar={<Sidebar navItems={labNavItems} roleLabel="Lab / Regulator" roleColor="#7B1FA2" />}>
      <TopNavbar title="Suspicious & High-Risk Batches" subtitle="Targeted Chemical & Adulteration Inspection Queue" />
      <PageContent>
        <PageHeader 
          title="Suspicious Batches Queue"
          description="Sorted by highest risk score for priority laboratory screening"
          action={<SearchBar value={search} onChange={setSearch} placeholder="Search Batch ID..." />}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map(batch => (
            <div key={batch.id} className="card" style={{ padding: 24, borderLeft: `6px solid ${batch.trustScore < 60 ? '#B91C2C' : '#D4A000'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: '#161616' }}>{batch.id}</h3>
                    <RiskBadge level={batch.riskLevel} />
                    <StatusBadge status={batch.labStatus} />
                  </div>
                  <div style={{ fontSize: 13, color: '#8A8A8A', marginTop: 4 }}>
                    Source: {batch.hiveName} ({batch.hiveId}) • Beekeeper: {batch.beekeeper} • Harvested: {batch.harvestDate}
                  </div>
                </div>
                <TrustScoreCard score={batch.trustScore} size="md" />
              </div>

              <div style={{ background: '#FFF9E6', padding: 14, borderRadius: 10, marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#161616' }}>AI Risk Explanation</div>
                <p style={{ fontSize: 13, color: '#4A4A4A', marginTop: 2 }}>{batch.aiInsight}</p>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button className="btn-secondary" style={{ fontSize: 13 }} onClick={() => navigate(`/lab/batch-analysis/${batch.id}`)}>
                  <Eye size={15} /> Analyze Lifecycle & Telemetry
                </button>
                <button className="btn-primary" style={{ background: '#7B1FA2', color: 'white', fontSize: 13 }} onClick={() => navigate(`/lab/test-entry/${batch.id}`)}>
                  <FlaskConical size={15} /> Enter Lab Test Result
                </button>
              </div>
            </div>
          ))}
        </div>
      </PageContent>
    </AppLayout>
  );
}
