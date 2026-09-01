import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { PageHeader } from '../../components/common/SharedComponents';
import { processorNavItems } from './ProcDashboard';
import { Activity, CheckCircle } from 'lucide-react';

export default function ActivityPage() {
  const { batches, updateBatchStatus, addToast } = useApp();

  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || 'BH-2026-001');
  const [activityType, setActivityType] = useState('Heating');
  const [notes, setNotes] = useState('');
  const [operator, setOperator] = useState('Swati Patel');

  const handleSubmit = (e) => {
    e.preventDefault();
    const batch = batches.find(b => b.id === selectedBatchId);
    if (!batch) return;

    const newActivity = {
      activity: activityType,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      operator: operator,
      notes: notes || 'Standard processing routine executed',
      status: 'Completed',
    };

    const updatedActivities = [...(batch.processingActivities || []), newActivity];
    updateBatchStatus(selectedBatchId, { processingActivities: updatedActivities });

    addToast(`Added ${activityType} activity to Batch ${selectedBatchId}`, 'success');
    setNotes('');
  };

  return (
    <AppLayout sidebar={<Sidebar navItems={processorNavItems} roleLabel="Processor" roleColor="#2E7D32" />}>
      <TopNavbar title="Log Processing Activity" subtitle="Record Heating, Filtering, and Packaging Logs" />
      <PageContent>
        <PageHeader title="Log Processing Activity" description="Add physical processing records to honey batch history" />

        <div className="card" style={{ padding: 28, maxWidth: 600 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Select Batch</label>
              <select className="input-field" value={selectedBatchId} onChange={e => setSelectedBatchId(e.target.value)}>
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.id} — {b.hiveName} ({b.status})</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Processing Activity</label>
              <select className="input-field" value={activityType} onChange={e => setActivityType(e.target.value)}>
                <option value="Heating">Controlled Heating (Max 45°C)</option>
                <option value="Filtering">Double Mesh Filtering</option>
                <option value="Packaging">Sterile Packaging & Bottling</option>
                <option value="Moisture Reduction">Dehumidification / Moisture Reduction</option>
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Operator Name</label>
              <input className="input-field" value={operator} onChange={e => setOperator(e.target.value)} required />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Activity Notes & Parameters</label>
              <textarea className="input-field" rows="3" placeholder="e.g., Heated to 44°C for 25 min, 200 micron mesh used..." value={notes} onChange={e => setNotes(e.target.value)} />
            </div>

            <button type="submit" className="btn-primary" style={{ background: '#2E7D32', color: 'white', width: '100%', justifyContent: 'center', padding: 12 }}>
              <Activity size={18} /> Record Activity Log
            </button>
          </form>
        </div>
      </PageContent>
    </AppLayout>
  );
}
