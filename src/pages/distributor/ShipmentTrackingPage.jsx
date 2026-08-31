import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { PageHeader, StatusBadge } from '../../components/common/SharedComponents';
import { distributorNavItems } from './DistDashboard';
import { shipments as mockShipments } from '../../data/mockData';
import { MapPin, Truck, CheckCircle, Clock } from 'lucide-react';

export default function ShipmentTrackingPage() {
  const navigate = useNavigate();
  const [selectedShipment, setSelectedShipment] = useState(mockShipments[0]);

  return (
    <AppLayout sidebar={<Sidebar navItems={distributorNavItems} roleLabel="Distributor" roleColor="#1565C0" />}>
      <TopNavbar title="Shipment Tracking & Route Monitor" subtitle="Live GPS & Checkpoint Telemetry" />
      <PageContent>
        <PageHeader title="Shipment Route Tracker" description="Real-time location updates and transit history" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Shipment List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mockShipments.map(shp => (
              <div 
                key={shp.id} 
                className="card card-clickable" 
                style={{ padding: 20, border: selectedShipment.id === shp.id ? '2px solid #1565C0' : '1px solid #E8E0D0' }}
                onClick={() => setSelectedShipment(shp)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{shp.id}</div>
                  <StatusBadge status={shp.status} />
                </div>
                <div style={{ fontSize: 13, color: '#8A8A8A' }}>Batch: {shp.batchId}</div>
                <div style={{ fontSize: 13, color: '#4A4A4A', marginTop: 6 }}>
                  {shp.origin} → {shp.destination}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Route Stepper */}
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800 }}>{selectedShipment.id}</h3>
                <div style={{ fontSize: 13, color: '#8A8A8A' }}>Carrier: {selectedShipment.carrier} • Driver: {selectedShipment.driver}</div>
              </div>
              <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => navigate(`/distributor/batch/${selectedShipment.batchId}`)}>
                Batch Details →
              </button>
            </div>

            <div style={{ background: '#FFF9E6', padding: 14, borderRadius: 10, marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
              <div><span style={{ fontSize: 11, color: '#8A8A8A' }}>Current Location:</span> <div style={{ fontWeight: 700 }}>{selectedShipment.currentLocation}</div></div>
              <div><span style={{ fontSize: 11, color: '#8A8A8A' }}>Transit Temp:</span> <div style={{ fontWeight: 700 }}>{selectedShipment.temperature}°C</div></div>
              <div><span style={{ fontSize: 11, color: '#8A8A8A' }}>ETA:</span> <div style={{ fontWeight: 700 }}>{selectedShipment.estimatedDelivery}</div></div>
            </div>

            {/* Stepper Timeline */}
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Route Checkpoints</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {selectedShipment.route.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: 28, height: 28, borderRadius: '50%', 
                    background: step.status === 'Completed' ? '#2E7D32' : step.status === 'Current' ? '#F4B400' : '#E8E0D0',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 
                  }}>
                    {step.status === 'Completed' ? '✓' : idx + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#161616' }}>{step.location}</div>
                    <div style={{ fontSize: 12, color: '#8A8A8A' }}>{step.time || 'Scheduled Stop'}</div>
                    <div style={{ marginTop: 2 }}><StatusBadge status={step.status} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageContent>
    </AppLayout>
  );
}
