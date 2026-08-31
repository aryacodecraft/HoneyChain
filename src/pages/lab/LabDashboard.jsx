import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { DashboardCard, StatusBadge, TrustScoreCard, PageHeader } from '../../components/common/SharedComponents';
import { Home, AlertTriangle, FileText, Shield, BarChart2, User, CheckCircle, XCircle, FlaskConical } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const labNavItems = [
  { to: '/lab/dashboard', label: 'Dashboard', icon: Home },
  { to: '/lab/suspicious-batches', label: 'Suspicious Batches', icon: AlertTriangle },
  { to: '/lab/results', label: 'Test Results', icon: FileText },
  { to: '/lab/compliance', label: 'Compliance', icon: Shield },
  { to: '/lab/reports', label: 'Reports & Analytics', icon: BarChart2 },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function LabDashboard() {
  const { batches, labResults } = useApp();
  const navigate = useNavigate();

  const flagged = batches.filter(b => b.trustScore < 80 || b.riskLevel !== 'Low');
  const passed = labResults.filter(r => r.status === 'Passed').length;
  const failed = labResults.filter(r => r.status === 'Failed').length;

  const pieData = [
    { name: 'Low Risk', value: batches.filter(b => b.riskLevel === 'Low').length, color: '#2E7D32' },
    { name: 'Medium Risk', value: batches.filter(b => b.riskLevel === 'Medium').length, color: '#F4B400' },
    { name: 'High Risk', value: batches.filter(b => b.riskLevel === 'High').length, color: '#B91C2C' },
  ];

  return (
    <AppLayout sidebar={<Sidebar navItems={labNavItems} roleLabel="Lab / Regulator" roleColor="#7B1FA2" />}>
      <TopNavbar title="Laboratory & Regulator Dashboard" subtitle="Chemical Analysis & Regulatory Compliance System" />
      <PageContent>
        <PageHeader 
          title="Laboratory Overview"
          description="Scientific quality verification, adulteration testing, and regulatory signoffs"
          action={
            <button className="btn-primary" style={{ background: '#7B1FA2', color: 'white' }} onClick={() => navigate('/lab/suspicious-batches')}>
              <AlertTriangle size={18} /> Inspect Flagged Batches
            </button>
          }
        />

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
          <DashboardCard title="Flagged Batches" value={flagged.length} subtitle="Requires Lab Analysis" icon={AlertTriangle} iconBg="#FDECEA" iconColor="#B91C2C" />
          <DashboardCard title="High Risk" value={1} subtitle="Severe Anomaly" icon={XCircle} iconBg="#FDECEA" iconColor="#B91C2C" />
          <DashboardCard title="Tests Passed" value={passed} subtitle="Chemical Parameters OK" icon={CheckCircle} iconBg="#E8F5E9" iconColor="#2E7D32" />
          <DashboardCard title="Tests Failed" value={failed} subtitle="Adulterant / HMF Alert" icon={FlaskConical} iconBg="#FDECEA" iconColor="#B91C2C" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 32 }}>
          {/* Flagged Batches Table */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>High Risk & Flagged Batches</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {flagged.map(b => (
                <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, background: '#FFFDF7', border: '1px solid #E8E0D0', borderRadius: 12 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: '#161616' }}>{b.id}</div>
                    <div style={{ fontSize: 12, color: '#8A8A8A' }}>Hive: {b.hiveId} • Risk: {b.riskLevel}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <TrustScoreCard score={b.trustScore} size="sm" />
                    <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => navigate(`/lab/batch-analysis/${b.id}`)}>
                      Analyze →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, alignSelf: 'flex-start' }}>Batch Risk Distribution</h3>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </PageContent>
    </AppLayout>
  );
}
