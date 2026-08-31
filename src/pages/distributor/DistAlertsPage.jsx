import React, { useState } from 'react';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { PageHeader, AlertCard, FilterDropdown } from '../../components/common/SharedComponents';
import { distributorNavItems } from './DistDashboard';
import { distributorAlerts } from '../../data/mockData';

export default function DistAlertsPage() {
  const [alertsList, setAlertsList] = useState(distributorAlerts);
  const [sev, setSev] = useState('');

  const filtered = alertsList.filter(a => !sev || a.severity.toLowerCase() === sev.toLowerCase());

  const handleResolve = (id) => {
    setAlertsList(prev => prev.map(a => a.id === id ? { ...a, status: 'Resolved' } : a));
  };

  return (
    <AppLayout sidebar={<Sidebar navItems={distributorNavItems} roleLabel="Distributor" roleColor="#1565C0" />}>
      <TopNavbar title="Logistics & Integrity Alerts" subtitle="Transport temperature breaches and delay warnings" />
      <PageContent>
        <PageHeader 
          title="Distributor Alerts" 
          description="Real-time shipment anomalies" 
          action={<FilterDropdown value={sev} onChange={setSev} options={['Warning', 'Info', 'Critical']} label="Severity" />}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(alert => (
            <AlertCard key={alert.id} alert={alert} onResolve={handleResolve} />
          ))}
        </div>
      </PageContent>
    </AppLayout>
  );
}
