import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { PageHeader, ConfirmationModal, StatusBadge } from '../../components/common/SharedComponents';
import { beekeeperNavItems } from './BKDashboard';
import { PlusCircle, CheckCircle, Package } from 'lucide-react';

export default function CreateBatchPage() {
  const { hives, batches, createBatch } = useApp();
  const navigate = useNavigate();

  const [hiveId, setHiveId] = useState(hives[0]?.id || 'HIVE-001');
  const [quantity, setQuantity] = useState(40);
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [showModal, setShowModal] = useState(false);

  const selectedHive = hives.find(h => h.id === hiveId) || hives[0];

  const generatedBatchId = `BH-2026-00${batches.length + 1}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirmCreate = () => {
    setShowModal(false);
    const newBatch = {
      id: generatedBatchId,
      hiveId: selectedHive.id,
      hiveName: selectedHive.name,
      location: selectedHive.location,
      beekeeper: 'Rohan Mehta',
      harvestDate: harvestDate,
      quantity: Number(quantity),
      unit: 'kg',
      status: 'Pending',
      processorStatus: 'Pending',
      labStatus: 'Pending',
      distributorStatus: 'Pending',
      trustScore: 88,
      riskLevel: 'Low',
      createdAt: new Date().toISOString(),
      temperature: selectedHive.temperature,
      humidity: selectedHive.humidity,
      weight: selectedHive.weight,
      aiInsight: `Batch harvested from ${selectedHive.name} under stable sensor conditions.`,
      anomalies: [],
      timeline: [
        { stage: 'Harvested', date: harvestDate, status: 'done', description: `Honey harvested from ${selectedHive.id} (${quantity} kg).` },
        { stage: 'Verified', date: '', status: 'pending', description: 'Pending processor verification.' },
        { stage: 'Processing', date: '', status: 'pending', description: 'Pending.' },
        { stage: 'Quality Tested', date: '', status: 'pending', description: 'Pending.' },
        { stage: 'Distributed', date: '', status: 'pending', description: 'Pending.' },
      ],
      processingActivities: [],
      labTests: [],
      shipmentHistory: [],
      integrityStatus: 'Pending',
      complianceStatus: 'Pending',
      complianceReason: 'Awaiting lab testing',
    };

    createBatch(newBatch);
    navigate('/beekeeper/batch-history');
  };

  return (
    <AppLayout sidebar={<Sidebar navItems={beekeeperNavItems} roleLabel="Beekeeper" roleColor="#F4B400" />}>
      <TopNavbar title="Harvest & Create Honey Batch" subtitle="Initialize Traceability Identity" />
      <PageContent>
        <PageHeader title="Create Traceable Batch" description="Assign hive origin telemetry and generate unique Batch ID" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
          <div className="card" style={{ padding: 28 }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Generated Batch ID</label>
                <input className="input-field" value={generatedBatchId} disabled style={{ background: '#FFF9E6', fontWeight: 700 }} />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Source Hive</label>
                <select className="input-field" value={hiveId} onChange={e => setHiveId(e.target.value)}>
                  {hives.map(h => (
                    <option key={h.id} value={h.id}>{h.name} ({h.id}) — {h.location}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Harvest Quantity (kg)</label>
                <input type="number" className="input-field" value={quantity} onChange={e => setQuantity(e.target.value)} required min="1" />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Harvest Date</label>
                <input type="date" className="input-field" value={harvestDate} onChange={e => setHarvestDate(e.target.value)} required />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Harvest Notes & Flora Type</label>
                <textarea className="input-field" rows="3" placeholder="e.g. Wildflower floral origin, moisture acceptable..." value={notes} onChange={e => setNotes(e.target.value)} />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
                <PlusCircle size={18} /> Initialize & Submit Batch
              </button>
            </form>
          </div>

          {/* Hive Status Snapshot */}
          <div className="card" style={{ padding: 28, background: '#FFFDF7' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Origin Hive Snapshot</h3>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{selectedHive.name}</div>
              <div style={{ fontSize: 12, color: '#8A8A8A' }}>Location: {selectedHive.location}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ background: '#FFF9E6', padding: 12, borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: '#8A8A8A' }}>Temp at Harvest</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{selectedHive.temperature}°C</div>
              </div>
              <div style={{ background: '#E3F2FD', padding: 12, borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: '#8A8A8A' }}>Humidity</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{selectedHive.humidity}%</div>
              </div>
            </div>

            <div style={{ fontSize: 13, color: '#4A4A4A', background: '#F5F5F5', padding: 14, borderRadius: 10 }}>
              <strong>Status:</strong> <StatusBadge status={selectedHive.status === 'healthy' ? 'Healthy' : 'Alert'} />
              <p style={{ marginTop: 6, fontSize: 12 }}>{selectedHive.behaviour}</p>
            </div>
          </div>
        </div>

        <ConfirmationModal 
          isOpen={showModal}
          title="Confirm Batch Creation"
          message={`Are you sure you want to register Batch ${generatedBatchId} from ${selectedHive.name} with quantity ${quantity} kg?`}
          confirmText="Yes, Create Batch"
          onConfirm={handleConfirmCreate}
          onCancel={() => setShowModal(false)}
          icon={Package}
        />
      </PageContent>
    </AppLayout>
  );
}
