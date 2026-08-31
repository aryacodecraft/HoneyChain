import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { DashboardCard, StatusBadge, TrustScoreCard, PageHeader } from '../../components/common/SharedComponents';
import { Home, CheckSquare, Activity, History, Bell, User, CheckCircle, AlertTriangle, XCircle, Package } from 'lucide-react';
import { processorAlerts } from '../../data/mockData';

export const processorNavItems = [
  { to: '/processor/dashboard', label: 'Dashboard', icon: Home },
  { to: '/processor/verify-batch', label: 'Verify Batch', icon: CheckSquare },
  { to: '/processor/activity', label: 'Add Activity', icon: Activity },
  { to: '/processor/history', label: 'Processing History', icon: History },
  { to: '/processor/alerts', label: 'Alerts', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function ProcDashboard() {
  const { batches } = useApp();
  const navigate = useNavigate();

  const accepted = batches.filter(b => b.processorStatus === 'Accepted').length;
  const rejected = batches.filter(b => b.processorStatus === 'Rejected').length;
  const pending = batches.filter(b => b.processorStatus === 'Pending' || b.processorStatus === 'Under Review').length;

  return (
    <AppLayout sidebar={<Sidebar navItems={processorNavItems} roleLabel="Processor" roleColor="#2E7D32" />}>
      <TopNavbar title="Processor Dashboard" subtitle="Batch Intake, Heating, Filtering & Verification Operations" />
      <PageContent>
        <PageHeader 
          title="Processing Operations" 
          description="Manage incoming batches and quality decision checks" 
          action={
            <button className="btn-primary" style={{ background: '#2E7D32', color: 'white' }} onClick={() => navigate('/processor/verify-batch')}>
              <CheckSquare size={18} /> Verify Incoming Batch
            </button>
          }
        />

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
          <DashboardCard title="Total Incoming Batches" value={batches.length} subtitle="From Verified Hives" icon={Package} iconBg="#E8F5E9" iconColor="#2E7D32" />
          <DashboardCard title="Accepted Batches" value={accepted} subtitle="Quality Cleared" icon={CheckCircle} iconBg="#E8F5E9" iconColor="#2E7D32" />
          <DashboardCard title="Pending Decisions" value={pending} subtitle="Requires Review" icon={AlertTriangle} iconBg="#FFF9E6" iconColor="#D4A000" />
          <DashboardCard title="Rejected Batches" value={rejected} subtitle="Non-compliant" icon={XCircle} iconBg="#FDECEA" iconColor="#B91C2C" />
        </div>

        {/* Incoming Batches Table */}
        <div className="card" style={{ padding: 24, marginBottom: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Recent Incoming Batches</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E8E0D0', textAlign: 'left', color: '#8A8A8A' }}>
                  <th style={{ padding: '10px 12px' }}>Batch ID</th>
                  <th style={{ padding: '10px 12px' }}>Source Hive</th>
                  <th style={{ padding: '10px 12px' }}>Harvest Date</th>
                  <th style={{ padding: '10px 12px' }}>Trust Score</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                  <th style={{ padding: '10px 12px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {batches.map(batch => (
                  <tr key={batch.id} style={{ borderBottom: '1px solid #E8E0D0' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 700 }}>{batch.id}</td>
                    <td style={{ padding: '14px 12px' }}>{batch.hiveName} ({batch.hiveId})</td>
                    <td style={{ padding: '14px 12px' }}>{batch.harvestDate}</td>
                    <td style={{ padding: '14px 12px' }}><TrustScoreCard score={batch.trustScore} size="sm" /></td>
                    <td style={{ padding: '14px 12px' }}><StatusBadge status={batch.processorStatus || batch.status} /></td>
                    <td style={{ padding: '14px 12px' }}>
                      <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => navigate(`/processor/decision/${batch.id}`)}>
                        Review Decision
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Processor Alerts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {processorAlerts.map(alert => (
              <div key={alert.id} style={{ padding: 14, borderRadius: 10, background: alert.severity === 'Critical' ? '#FDECEA' : '#FFF9E6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{alert.issue}</div>
                  <div style={{ fontSize: 12, color: '#8A8A8A' }}>Batch: {alert.batchId} • {new Date(alert.date).toLocaleString()}</div>
                </div>
                <StatusBadge status={alert.status} />
              </div>
            ))}
          </div>
        </div>
      </PageContent>
    </AppLayout>
  );
}
