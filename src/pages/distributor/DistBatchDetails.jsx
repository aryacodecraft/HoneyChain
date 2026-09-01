import React from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { PageHeader, StatusBadge, TrustScoreCard, Timeline } from '../../components/common/SharedComponents';
import { distributorNavItems } from './DistDashboard';

export default function DistBatchDetails() {
  const { id } = useParams();
  const { batches } = useApp();

  const batch = batches.find(b => b.id === id) || batches[0];

  return (
    <AppLayout sidebar={<Sidebar navItems={distributorNavItems} roleLabel="Distributor" roleColor="#1565C0" />}>
      <TopNavbar title={`Distributor Batch Audit - ${batch.id}`} subtitle="Product Journey & Integrity Traceability" />
      <PageContent>
        <PageHeader title={`Batch Logistics: ${batch.id}`} description={`Current Location: ${batch.currentLocation}`} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 28 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Origin & Processor Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <div><strong>Hive:</strong> {batch.hiveName} ({batch.hiveId})</div>
              <div><strong>Beekeeper:</strong> {batch.beekeeper}</div>
              <div><strong>Processor:</strong> {batch.processorName || 'Verified Unit'}</div>
              <div><strong>Distributor Partner:</strong> {batch.distributorName || 'NaturePure Logistics'}</div>
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Integrity & Compliance</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><strong>Integrity Status:</strong> <StatusBadge status={batch.integrityStatus || 'Verified'} /></div>
              <div><strong>Compliance Rating:</strong> <StatusBadge status={batch.complianceStatus || 'Passed'} /></div>
              <div><strong>Lab Test Status:</strong> <StatusBadge status={batch.labStatus} /></div>
            </div>
          </div>

          <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 13, color: '#8A8A8A', marginBottom: 10 }}>Trust Index Score</div>
            <TrustScoreCard score={batch.trustScore} size="lg" />
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Supply Chain Journey Timeline</h3>
          <Timeline items={batch.timeline} />
        </div>
      </PageContent>
    </AppLayout>
  );
}
