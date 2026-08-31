import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { PageHeader, StatusBadge, TrustScoreCard } from '../../components/common/SharedComponents';
import { processorNavItems } from './ProcDashboard';
import { CheckSquare, Scan, Eye, Gavel } from 'lucide-react';

export default function VerifyBatchPage() {
  const { batches } = useApp();
  const navigate = useNavigate();

  const [batchIdInput, setBatchIdInput] = useState('BH-2026-002');
  const [scanning, setScanning] = useState(false);
  const [verifiedBatch, setVerifiedBatch] = useState(null);

  const handleVerify = (idToVerify) => {
    const targetId = idToVerify || batchIdInput;
    const found = batches.find(b => b.id.toLowerCase() === targetId.trim().toLowerCase());
    setVerifiedBatch(found || null);
  };

  const handleScanMock = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setBatchIdInput('BH-2026-002');
      handleVerify('BH-2026-002');
    }, 1200);
  };

  return (
    <AppLayout sidebar={<Sidebar navItems={processorNavItems} roleLabel="Processor" roleColor="#2E7D32" />}>
      <TopNavbar title="Verify Incoming Honey Batch" subtitle="Authenticity & Telemetry Inspection" />
      <PageContent>
        <PageHeader title="Batch Intake Verification" description="Scan QR or enter Batch ID to pull hive telemetry and trust records" />

        {/* Input & QR Scan section */}
        <div className="card" style={{ padding: 28, marginBottom: 28, maxWidth: 600 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Enter Batch ID</label>
            <div style={{ display: 'flex', gap: 12 }}>
              <input className="input-field" value={batchIdInput} onChange={e => setBatchIdInput(e.target.value)} placeholder="e.g. BH-2026-001" />
              <button className="btn-primary" style={{ background: '#2E7D32', color: 'white' }} onClick={() => handleVerify()}>
                Verify
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', margin: '20px 0', position: 'relative' }}>
            <hr style={{ border: 'none', borderTop: '1px solid #E8E0D0' }} />
            <span style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '0 12px', fontSize: 12, color: '#8A8A8A' }}>OR</span>
          </div>

          <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: 12 }} onClick={handleScanMock}>
            <Scan size={18} /> {scanning ? 'Scanning QR Code...' : 'Simulate QR Code Scan'}
          </button>
        </div>

        {/* Verification Result */}
        {verifiedBatch && (
          <div className="card animate-fade-in" style={{ padding: 28, borderLeft: `6px solid ${verifiedBatch.trustScore >= 80 ? '#2E7D32' : '#D4A000'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 12, color: '#8A8A8A' }}>Intake Result</div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: '#161616' }}>Batch {verifiedBatch.id}</h2>
                <div style={{ fontSize: 14, color: '#4A4A4A', marginTop: 4 }}>
                  Source: {verifiedBatch.hiveName} ({verifiedBatch.hiveId}) • Beekeeper: {verifiedBatch.beekeeper}
                </div>
              </div>
              <TrustScoreCard score={verifiedBatch.trustScore} size="md" />
            </div>

            <div style={{ background: '#FFF9E6', padding: 16, borderRadius: 12, marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#161616' }}>AI Telemetry Assessment</div>
              <p style={{ fontSize: 13, color: '#4A4A4A', marginTop: 4 }}>{verifiedBatch.aiInsight}</p>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-secondary" onClick={() => navigate(`/processor/batch/${verifiedBatch.id}`)}>
                <Eye size={16} /> View Full Batch Details
              </button>
              <button className="btn-primary" style={{ background: '#2E7D32', color: 'white' }} onClick={() => navigate(`/processor/decision/${verifiedBatch.id}`)}>
                <Gavel size={16} /> Make Acceptance Decision
              </button>
            </div>
          </div>
        )}
      </PageContent>
    </AppLayout>
  );
}
