import React, { useState } from 'react';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { PageHeader, AlertCard, FilterDropdown } from '../../components/common/SharedComponents';
import { processorNavItems } from './ProcDashboard';
import { processorAlerts } from '../../data/mockData';

export default function ProcAlertsPage() {
  const [alertsList, setAlertsList] = useState(processorAlerts);
  const [sev, setSev] = useState('');

  const filtered = alertsList.filter(a => !sev || a.severity.toLowerCase() === sev.toLowerCase());

  const handleResolve = (id) => {
    setAlertsList(prev => prev.map(a => a.id === id ? { ...a, status: 'Resolved' } : a));
  };

  return (
    <AppLayout sidebar={<Sidebar navItems={processorNavItems} roleLabel="Processor" roleColor="#2E7D32" />}>
      <TopNavbar title="Processor Alerts & Quality Warnings" subtitle="System alerts for processing anomalies" />
      <PageContent>
        <PageHeader 
          title="Processor Alerts"
          description="High risk warnings and processing deviations"
          action={<FilterDropdown value={sev} onChange={setSev} options={['Critical', 'Warning', 'Info']} label="Severity" />}
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
