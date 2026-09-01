import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { DashboardCard, StatusBadge, PageHeader } from '../../components/common/SharedComponents';
import { Home, Truck, ShieldCheck, Bell, User, MapPin, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { shipments as mockShipments, distributorAlerts } from '../../data/mockData';

export const distributorNavItems = [
  { to: '/distributor/dashboard', label: 'Dashboard', icon: Home },
  { to: '/distributor/shipment-tracking', label: 'Shipment Tracking', icon: Truck },
  { to: '/distributor/integrity-check', label: 'Integrity Check', icon: ShieldCheck },
  { to: '/distributor/alerts', label: 'Alerts', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function DistDashboard() {
  const navigate = useNavigate();

  const active = mockShipments.filter(s => s.status === 'In Transit' || s.status === 'Preparing').length;
  const delivered = mockShipments.filter(s => s.status === 'Delivered').length;

  return (
    <AppLayout sidebar={<Sidebar navItems={distributorNavItems} roleLabel="Distributor" roleColor="#1565C0" />}>
      <TopNavbar title="Distributor Dashboard" subtitle="Logistics Tracking & Cold-Chain Integrity" />
      <PageContent>
        <PageHeader 
          title="Supply Chain Logistics"
          description="Track honey batch transportation, location checkpoints, and tamper status"
          action={
            <button className="btn-primary" style={{ background: '#1565C0', color: 'white' }} onClick={() => navigate('/distributor/integrity-check')}>
              <ShieldCheck size={18} /> Perform Integrity Check
            </button>
          }
        />

        {/* Dashboard Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
          <DashboardCard title="Active Shipments" value={active} subtitle="In Transit Across Routes" icon={Truck} iconBg="#E3F2FD" iconColor="#1565C0" />
          <DashboardCard title="Delivered Product" value={delivered} subtitle="Retail Verification Ready" icon={CheckCircle} iconBg="#E8F5E9" iconColor="#2E7D32" />
          <DashboardCard title="Route Delays" value={1} subtitle="Traffic & Clearance" icon={Clock} iconBg="#FFF9E6" iconColor="#D4A000" />
          <DashboardCard title="Integrity Alerts" value={distributorAlerts.length} subtitle="Temperature & Sensor" icon={AlertTriangle} iconBg="#FDECEA" iconColor="#B91C2C" />
        </div>

        {/* Recent Active Shipments */}
        <div className="card" style={{ padding: 24, marginBottom: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Active Shipments</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mockShipments.map(shp => (
              <div key={shp.id} style={{ border: '1px solid #E8E0D0', borderRadius: 12, padding: 18, background: '#FFFDF7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                  <div>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#161616' }}>{shp.id}</span>
                    <span style={{ fontSize: 13, color: '#8A8A8A', marginLeft: 10 }}>Batch: {shp.batchId}</span>
                  </div>
                  <StatusBadge status={shp.status} />
                </div>

                <div style={{ fontSize: 13, color: '#4A4A4A', marginBottom: 12, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div><strong>Current Location:</strong> {shp.currentLocation}</div>
                  <div><strong>Carrier:</strong> {shp.carrier}</div>
                  <div><strong>Storage Temp:</strong> {shp.temperature}°C</div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8A8A8A', marginBottom: 4 }}>
                    <span>Route Progress</span>
                    <span>{shp.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${shp.progress}%`, background: shp.progress === 100 ? '#2E7D32' : '#1565C0' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => navigate(`/distributor/batch/${shp.batchId}`)}>
                    View Batch Logistics →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distributor Alerts */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Transport Alerts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {distributorAlerts.map(alt => (
              <div key={alt.id} style={{ padding: 14, borderRadius: 10, background: alt.severity === 'Warning' ? '#FFF9E6' : '#E3F2FD', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{alt.issue}</div>
                  <div style={{ fontSize: 12, color: '#8A8A8A' }}>Batch: {alt.batchId} • {new Date(alt.date).toLocaleString()}</div>
                </div>
                <StatusBadge status={alt.status} />
              </div>
            ))}
          </div>
        </div>
      </PageContent>
    </AppLayout>
  );
}
