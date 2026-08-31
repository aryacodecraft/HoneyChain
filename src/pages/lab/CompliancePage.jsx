import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { PageHeader, StatusBadge, SearchBar, FilterDropdown } from '../../components/common/SharedComponents';
import { labNavItems } from './LabDashboard';

export default function CompliancePage() {
  const { batches } = useApp();
  const [search, setSearch] = useState('');
  const [filterComp, setFilterComp] = useState('');

  const filtered = batches.filter(b => {
    const statusStr = b.complianceStatus || 'Pending';
    const matchesSearch = !search || b.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !filterComp || statusStr.toLowerCase() === filterComp.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <AppLayout sidebar={<Sidebar navItems={labNavItems} roleLabel="Lab / Regulator" roleColor="#7B1FA2" />}>
      <TopNavbar title="Regulatory Compliance Verification" subtitle="FSSAI & Export Quality Compliance Status" />
      <PageContent>
        <PageHeader 
          title="Batch Regulatory Compliance Status"
          description="Official regulatory status for commercial distribution"
          action={
            <div style={{ display: 'flex', gap: 12 }}>
              <SearchBar value={search} onChange={setSearch} placeholder="Search Batch ID..." />
              <FilterDropdown value={filterComp} onChange={setFilterComp} options={['Passed', 'Failed', 'Under Review', 'Pending']} label="Status" />
            </div>
          }
        />

        <div className="card" style={{ padding: 24 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E8E0D0', textAlign: 'left', color: '#8A8A8A' }}>
                  <th style={{ padding: '10px 12px' }}>Batch ID</th>
                  <th style={{ padding: '10px 12px' }}>Source Hive</th>
                  <th style={{ padding: '10px 12px' }}>Trust Score</th>
                  <th style={{ padding: '10px 12px' }}>Regulatory Status</th>
                  <th style={{ padding: '10px 12px' }}>Reason / Notes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #E8E0D0' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 700 }}>{b.id}</td>
                    <td style={{ padding: '14px 12px' }}>{b.hiveName} ({b.hiveId})</td>
                    <td style={{ padding: '14px 12px', fontWeight: 700 }}>{b.trustScore}/100</td>
                    <td style={{ padding: '14px 12px' }}>
                      <StatusBadge status={b.complianceStatus || 'Pending'} />
                    </td>
                    <td style={{ padding: '14px 12px', color: '#616161' }}>{b.complianceReason || 'Awaiting comprehensive test completion.'}</td>
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
