import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { PageHeader, StatusBadge, TrustScoreCard, Timeline } from '../../components/common/SharedComponents';
import { processorNavItems } from './ProcDashboard';
import { Gavel, Thermometer, Droplets, Weight, AlertTriangle } from 'lucide-react';

export default function BatchDetailsPage() {
  const { id } = useParams();
  const { batches } = useApp();
  const navigate = useNavigate();

  const batch = batches.find(b => b.id === id) || batches[0];

  return (
    <AppLayout sidebar={<Sidebar navItems={processorNavItems} roleLabel="Processor" roleColor="#2E7D32" />}>
      <TopNavbar title={`Batch Audit Details - ${batch.id}`} subtitle="Complete Life Cycle & Sensor Lineage" />
      <PageContent>
        <PageHeader 
          title={`Batch ${batch.id}`}
          description={`Harvested on ${batch.harvestDate} from ${batch.hiveName}`}
          action={
            <button className="btn-primary" style={{ background: '#2E7D32', color: 'white' }} onClick={() => navigate(`/processor/decision/${batch.id}`)}>
              <Gavel size={16} /> Make Decision
            </button>
          }
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 28 }}>
          {/* Source Info */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Source & Origin</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <div><strong>Hive ID:</strong> {batch.hiveId}</div>
              <div><strong>Location:</strong> {batch.location}</div>
              <div><strong>Beekeeper:</strong> {batch.beekeeper}</div>
              <div><strong>Quantity:</strong> {batch.quantity} {batch.unit}</div>
              <div><strong>Status:</strong> <StatusBadge status={batch.processorStatus || batch.status} /></div>
            </div>
          </div>

          {/* Sensor Data */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Origin Sensor Telemetry</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div style={{ background: '#FFF9E6', padding: 12, borderRadius: 10, textAlign: 'center' }}>
                <Thermometer size={18} color="#F4B400" style={{ margin: '0 auto' }} />
                <div style={{ fontSize: 11, color: '#8A8A8A', marginTop: 4 }}>Temp</div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{batch.temperature}°C</div>
              </div>
              <div style={{ background: '#E3F2FD', padding: 12, borderRadius: 10, textAlign: 'center' }}>
                <Droplets size={18} color="#1565C0" style={{ margin: '0 auto' }} />
                <div style={{ fontSize: 11, color: '#8A8A8A', marginTop: 4 }}>Humidity</div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{batch.humidity}%</div>
              </div>
              <div style={{ background: '#E8F5E9', padding: 12, borderRadius: 10, textAlign: 'center' }}>
                <Weight size={18} color="#2E7D32" style={{ margin: '0 auto' }} />
                <div style={{ fontSize: 11, color: '#8A8A8A', marginTop: 4 }}>Weight</div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{batch.weight} kg</div>
              </div>
            </div>
          </div>

          {/* Trust Score */}
          <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 13, color: '#8A8A8A', marginBottom: 10 }}>Honey Trust Index</div>
            <TrustScoreCard score={batch.trustScore} size="lg" />
          </div>
        </div>

        {/* AI Insights & Anomalies */}
        <div className="card" style={{ padding: 24, marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>AI Quality & Anomaly Analysis</h3>
          <p style={{ fontSize: 14, color: '#4A4A4A', marginBottom: 14 }}>{batch.aiInsight}</p>

          {batch.anomalies && batch.anomalies.length > 0 && (
            <div style={{ background: '#FDECEA', padding: 14, borderRadius: 10, border: '1px solid #B91C2C30' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#B91C2C', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <AlertTriangle size={16} /> DETECTED ANOMALIES ({batch.anomalies.length})
              </div>
              <ul style={{ paddingLeft: 20, fontSize: 13, color: '#B91C2C' }}>
                {batch.anomalies.map((anom, idx) => (
                  <li key={idx}>{anom}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Batch Timeline</h3>
          <Timeline items={batch.timeline} />
        </div>
      </PageContent>
    </AppLayout>
  );
}
