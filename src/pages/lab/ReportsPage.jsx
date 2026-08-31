import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { PageHeader } from '../../components/common/SharedComponents';
import { labNavItems } from './LabDashboard';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Download } from 'lucide-react';

const monthlyData = [
  { month: 'May', Passed: 12, Failed: 1 },
  { month: 'Jun', Passed: 15, Failed: 2 },
  { month: 'Jul', Passed: 18, Failed: 3 },
  { month: 'Aug', Passed: 14, Failed: 2 },
];

const categoryCompliance = [
  { category: 'Moisture', rate: 94 },
  { category: 'Purity (NMR)', rate: 88 },
  { category: 'HMF Level', rate: 82 },
  { category: 'Pesticides', rate: 91 },
];

export default function ReportsPage() {
  const { addToast } = useApp();

  const handleExport = () => {
    addToast('Regulatory Analytics Report exported successfully!', 'success');
  };

  return (
    <AppLayout sidebar={<Sidebar navItems={labNavItems} roleLabel="Lab / Regulator" roleColor="#7B1FA2" />}>
      <TopNavbar title="Analytics & Compliance Reports" subtitle="System-wide Honey Quality Trends & Statistics" />
      <PageContent>
        <PageHeader 
          title="Compliance & Quality Analytics"
          description="Aggregated laboratory testing statistics and risk trends"
          action={
            <button className="btn-primary" style={{ background: '#7B1FA2', color: 'white' }} onClick={handleExport}>
              <Download size={16} /> Export PDF Report
            </button>
          }
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Monthly Passed vs Failed */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Monthly Testing Outcomes</h3>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Passed" fill="#2E7D32" />
                  <Bar dataKey="Failed" fill="#B91C2C" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Compliance Rate by Category */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Compliance Rate by Parameter (%)</h3>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryCompliance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="category" type="category" width={100} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="rate" fill="#7B1FA2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </PageContent>
    </AppLayout>
  );
}
