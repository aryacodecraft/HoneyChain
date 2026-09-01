import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { PageHeader, StatusBadge, SearchBar } from '../../components/common/SharedComponents';
import { processorNavItems } from './ProcDashboard';

export default function ProcessingHistoryPage() {
  const { batches } = useApp();
  const [search, setSearch] = useState('');

  const allLogs = batches.flatMap(b => 
    (b.processingActivities || []).map(act => ({
      ...act,
      batchId: b.id,
      hiveName: b.hiveName,
    }))
  );

  const filtered = allLogs.filter(log => 
    !search || log.batchId.toLowerCase().includes(search.toLowerCase()) || log.activity.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout sidebar={<Sidebar navItems={processorNavItems} roleLabel="Processor" roleColor="#2E7D32" />}>
      <TopNavbar title="Processing Logs & Audit History" subtitle="Full Activity Log of All Batch Operations" />
      <PageContent>
        <PageHeader 
          title="Processing Audit Trail"
          description="Log history of temperature treatment, filtration, and glass packaging"
          action={<SearchBar value={search} onChange={setSearch} placeholder="Search Batch ID or activity..." />}
        />

        <div className="card" style={{ padding: 24 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E8E0D0', textAlign: 'left', color: '#8A8A8A' }}>
                  <th style={{ padding: '10px 12px' }}>Batch ID</th>
                  <th style={{ padding: '10px 12px' }}>Activity</th>
                  <th style={{ padding: '10px 12px' }}>Date / Time</th>
                  <th style={{ padding: '10px 12px' }}>Operator</th>
                  <th style={{ padding: '10px 12px' }}>Notes</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #E8E0D0' }}>
                    <td style={{ padding: '12px', fontWeight: 700 }}>{log.batchId}</td>
                    <td style={{ padding: '12px' }}>{log.activity}</td>
                    <td style={{ padding: '12px' }}>{log.date}</td>
                    <td style={{ padding: '12px' }}>{log.operator}</td>
                    <td style={{ padding: '12px', color: '#616161' }}>{log.notes}</td>
                    <td style={{ padding: '12px' }}><StatusBadge status={log.status || 'Completed'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageContent>
    </AppLayout>
  );
}
