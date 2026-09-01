import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { PageHeader, AlertCard, FilterDropdown, SearchBar } from '../../components/common/SharedComponents';
import { beekeeperNavItems } from './BKDashboard';

export default function AlertsPage() {
  const { alerts, resolveAlert } = useApp();
  const [severityFilter, setSeverityFilter] = useState('');
  const [search, setSearch] = useState('');

  const filtered = alerts.filter(a => {
    const matchesSev = !severityFilter || a.severity.toLowerCase() === severityFilter.toLowerCase();
    const matchesSearch = !search || (a.hiveId && a.hiveId.toLowerCase().includes(search.toLowerCase())) || a.issue.toLowerCase().includes(search.toLowerCase());
    return matchesSev && matchesSearch;
  });

  const activeCount = alerts.filter(a => a.status !== 'Resolved').length;

  return (
    <AppLayout sidebar={<Sidebar navItems={beekeeperNavItems} roleLabel="Beekeeper" roleColor="#F4B400" />}>
      <TopNavbar title="Hive Telemetry Alerts" subtitle="Real-time warning notifications" />
      <PageContent>
        <PageHeader 
          title={`Hive Alerts (${activeCount} Active)`}
          description="Acknowledge and resolve sensor warnings"
          action={
            <div style={{ display: 'flex', gap: 12 }}>
              <SearchBar value={search} onChange={setSearch} placeholder="Search hive or issue..." />
              <FilterDropdown value={severityFilter} onChange={setSeverityFilter} options={['Critical', 'Warning', 'Info']} label="Severity" />
            </div>
          }
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center', color: '#8A8A8A' }}>
              No alerts match your filter criteria.
            </div>
          ) : (
            filtered.map(alert => (
              <AlertCard key={alert.id} alert={alert} onResolve={resolveAlert} />
            ))
          )}
        </div>
      </PageContent>
    </AppLayout>
  );
}
