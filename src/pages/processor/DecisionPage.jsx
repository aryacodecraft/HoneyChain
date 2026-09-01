import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { PageHeader, StatusBadge, RiskBadge, TrustScoreCard, ConfirmationModal } from '../../components/common/SharedComponents';
import { processorNavItems } from './ProcDashboard';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function DecisionPage() {
  const { id } = useParams();
  const { batches, updateBatchStatus, addToast } = useApp();
  const navigate = useNavigate();

  const batch = batches.find(b => b.id === id) || batches[0];

  const [modalType, setModalType] = useState(null); // 'accept' | 'reject' | null

  const handleDecision = (accepted) => {
    const newStatus = accepted ? 'Accepted' : 'Rejected';
    const newStageStatus = accepted ? 'done' : 'rejected';

    const updatedTimeline = batch.timeline.map(t => {
      if (t.stage === 'Verified') return { ...t, status: newStageStatus, description: accepted ? 'Verified and accepted by processor.' : 'Rejected by processor due to anomalies.' };
      return t;
    });

    updateBatchStatus(batch.id, {
      processorStatus: newStatus,
      status: accepted ? 'Processing' : 'Rejected',
      timeline: updatedTimeline,
    });

    addToast(`Batch ${batch.id} has been ${newStatus.toUpperCase()}`, accepted ? 'success' : 'error');
    setModalType(null);
    navigate('/processor/dashboard');
  };

  return (
    <AppLayout sidebar={<Sidebar navItems={processorNavItems} roleLabel="Processor" roleColor="#2E7D32" />}>
      <TopNavbar title={`Processor Decision Gate - ${batch.id}`} subtitle="Final Intake Verification & Quality Signoff" />
      <PageContent>
        <PageHeader title={`Intake Decision: Batch ${batch.id}`} description={`Source: ${batch.hiveName} (${batch.hiveId})`} />

        <div className="card" style={{ padding: 28, marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20, marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800 }}>Batch Summary Audit</h2>
              <div style={{ fontSize: 14, color: '#8A8A8A', marginTop: 4 }}>Harvest Date: {batch.harvestDate} • Quantity: {batch.quantity} kg</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <RiskBadge level={batch.riskLevel} />
              <TrustScoreCard score={batch.trustScore} size="md" />
            </div>
          </div>

          <div style={{ background: '#FFF9E6', padding: 18, borderRadius: 12, marginBottom: 24 }}>
            <h4 style={{ fontWeight: 700, fontSize: 14, color: '#161616', marginBottom: 4 }}>AI Recommendation & Insight</h4>
            <p style={{ fontSize: 14, color: '#4A4A4A' }}>{batch.aiInsight}</p>
          </div>

          {batch.anomalies && batch.anomalies.length > 0 && (
            <div style={{ background: '#FDECEA', padding: 18, borderRadius: 12, marginBottom: 24, border: '1px solid #B91C2C30' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#B91C2C', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <AlertTriangle size={18} /> Flagged Telemetry Anomalies
              </div>
              <ul style={{ paddingLeft: 20, fontSize: 13, color: '#B91C2C' }}>
                {batch.anomalies.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          )}

          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            <button className="btn-success" style={{ flex: 1, justifyContent: 'center', padding: 14, fontSize: 15 }} onClick={() => setModalType('accept')}>
              <CheckCircle size={20} /> ACCEPT BATCH
            </button>
            <button className="btn-danger" style={{ flex: 1, justifyContent: 'center', padding: 14, fontSize: 15 }} onClick={() => setModalType('reject')}>
              <XCircle size={20} /> REJECT BATCH
            </button>
          </div>
        </div>

        <ConfirmationModal 
          isOpen={modalType === 'accept'}
          title="Confirm Batch Acceptance"
          message={`Are you sure you want to ACCEPT Batch ${batch.id}? This will authorize further processing and distribution.`}
          confirmText="Accept Batch"
          confirmClass="btn-success"
          onConfirm={() => handleDecision(true)}
          onCancel={() => setModalType(null)}
          icon={CheckCircle}
        />

        <ConfirmationModal 
          isOpen={modalType === 'reject'}
          title="Confirm Batch Rejection"
          message={`Are you sure you want to REJECT Batch ${batch.id}? This batch will be quarantined and marked as non-compliant.`}
          confirmText="Reject Batch"
          confirmClass="btn-danger"
          onConfirm={() => handleDecision(false)}
          onCancel={() => setModalType(null)}
          icon={XCircle}
        />
      </PageContent>
    </AppLayout>
  );
}
