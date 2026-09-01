import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { PageHeader, StatusBadge, TrustScoreCard, Timeline } from '../../components/common/SharedComponents';
import { labNavItems } from './LabDashboard';
import { FlaskConical, AlertTriangle } from 'lucide-react';

export default function BatchAnalysisPage() {
  const { id } = useParams();
  const { batches, labResults } = useApp();
  const navigate = useNavigate();

  const batch = batches.find(b => b.id === id) || batches[0];
  const tests = labResults.filter(r => r.batchId === batch.id);

  return (
    <AppLayout sidebar={<Sidebar navItems={labNavItems} roleLabel="Lab / Regulator" roleColor="#7B1FA2" />}>
      <TopNavbar title={`Laboratory Deep-Dive - ${batch.id}`} subtitle="Comprehensive Chemical & Telemetry Analysis" />
      <PageContent>
        <PageHeader 
          title={`Lab Analysis: ${batch.id}`}
          description={`Hive Origin: ${batch.hiveName} (${batch.hiveId})`}
          action={
            <button className="btn-primary" style={{ background: '#7B1FA2', color: 'white' }} onClick={() => navigate(`/lab/test-entry/${batch.id}`)}>
              <FlaskConical size={16} /> Log Chemical Test Result
            </button>
          }
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 28 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Batch Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <div><strong>Harvest Date:</strong> {batch.harvestDate}</div>
              <div><strong>Quantity:</strong> {batch.quantity} {batch.unit}</div>
              <div><strong>Beekeeper:</strong> {batch.beekeeper}</div>
              <div><strong>Status:</strong> <StatusBadge status={batch.status} /></div>
            </div>
          </div>

          <div className="card" style={{ padding: 24, background: '#FFF9E6' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: '#161616' }}>AI & Telemetry Diagnostics</h3>
            <p style={{ fontSize: 14, color: '#4A4A4A', marginBottom: 12 }}>{batch.aiInsight}</p>
            {batch.anomalies && batch.anomalies.length > 0 && (
              <div style={{ color: '#B91C2C', fontSize: 13, fontWeight: 600 }}>
                <strong>Anomalies:</strong> {batch.anomalies.join(' • ')}
              </div>
            )}
          </div>

          <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 13, color: '#8A8A8A', marginBottom: 10 }}>Trust Score Assessment</div>
            <TrustScoreCard score={batch.trustScore} size="lg" />
          </div>
        </div>

        {/* Existing Lab Tests Table */}
        <div className="card" style={{ padding: 24, marginBottom: 28 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Laboratory Test Records ({tests.length})</h3>
          {tests.length === 0 ? (
            <div style={{ color: '#8A8A8A', fontSize: 14 }}>No laboratory tests recorded yet for this batch.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E8E0D0', textAlign: 'left', color: '#8A8A8A' }}>
                    <th style={{ padding: '10px 12px' }}>Test Type</th>
                    <th style={{ padding: '10px 12px' }}>Analyst</th>
                    <th style={{ padding: '10px 12px' }}>Date</th>
                    <th style={{ padding: '10px 12px' }}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((t, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #E8E0D0' }}>
                      <td style={{ padding: '12px', fontWeight: 700 }}>{t.testType}</td>
                      <td style={{ padding: '12px' }}>{t.analyst}</td>
                      <td style={{ padding: '12px' }}>{t.date}</td>
                      <td style={{ padding: '12px' }}><StatusBadge status={t.result || t.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Batch Lifecycle History</h3>
          <Timeline items={batch.timeline} />
        </div>
      </PageContent>
    </AppLayout>
  );
}
