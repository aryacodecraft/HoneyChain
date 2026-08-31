import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { PageHeader, StatusBadge, SearchBar, FilterDropdown } from '../../components/common/SharedComponents';
import { labNavItems } from './LabDashboard';

export default function ResultsPage() {
  const { labResults } = useApp();
  const [search, setSearch] = useState('');
  const [filterRes, setFilterRes] = useState('');

  const filtered = labResults.filter(r => {
    const matchesSearch = !search || r.batchId.toLowerCase().includes(search.toLowerCase()) || r.testType.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !filterRes || r.result.toLowerCase() === filterRes.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <AppLayout sidebar={<Sidebar navItems={labNavItems} roleLabel="Lab / Regulator" roleColor="#7B1FA2" />}>
      <TopNavbar title="Laboratory Test Results Database" subtitle="Master Registry of Chemical & Adulteration Assays" />
      <PageContent>
        <PageHeader 
          title="All Laboratory Test Results"
          description="Complete log of moisture, purity, HMF, and pesticide assays"
          action={
            <div style={{ display: 'flex', gap: 12 }}>
              <SearchBar value={search} onChange={setSearch} placeholder="Search Batch ID or assay..." />
              <FilterDropdown value={filterRes} onChange={setFilterRes} options={['Passed', 'Failed', 'Pending']} label="Outcome" />
            </div>
          }
        />

        <div className="card" style={{ padding: 24 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E8E0D0', textAlign: 'left', color: '#8A8A8A' }}>
                  <th style={{ padding: '10px 12px' }}>Result ID</th>
                  <th style={{ padding: '10px 12px' }}>Batch ID</th>
                  <th style={{ padding: '10px 12px' }}>Assay Type</th>
                  <th style={{ padding: '10px 12px' }}>Analyst</th>
                  <th style={{ padding: '10px 12px' }}>Date</th>
                  <th style={{ padding: '10px 12px' }}>Outcome</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(res => (
                  <tr key={res.id} style={{ borderBottom: '1px solid #E8E0D0' }}>
                    <td style={{ padding: '12px', fontWeight: 700 }}>{res.id}</td>
                    <td style={{ padding: '12px' }}>{res.batchId}</td>
                    <td style={{ padding: '12px' }}>{res.testType}</td>
                    <td style={{ padding: '12px' }}>{res.analyst}</td>
                    <td style={{ padding: '12px' }}>{res.date}</td>
                    <td style={{ padding: '12px' }}><StatusBadge status={res.result || res.status} /></td>
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
