import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { PageHeader, StatusBadge, TrustScoreCard, SearchBar, FilterDropdown } from '../../components/common/SharedComponents';
import { beekeeperNavItems } from './BKDashboard';
import { Eye, Package } from 'lucide-react';

export default function BatchHistoryPage() {
  const { batches } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = batches.filter(b => {
    const matchesSearch = !search || b.id.toLowerCase().includes(search.toLowerCase()) || b.hiveId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || b.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout sidebar={<Sidebar navItems={beekeeperNavItems} roleLabel="Beekeeper" roleColor="#F4B400" />}>
      <TopNavbar title="Honey Batch History" subtitle="Traceability & Harvest Logs" />
      <PageContent>
        <PageHeader 
          title="Harvest Batch History"
          description="Track all honey batches created from your hives"
          action={
            <div style={{ display: 'flex', gap: 12 }}>
              <SearchBar value={search} onChange={setSearch} placeholder="Search Batch ID..." />
              <FilterDropdown value={statusFilter} onChange={setStatusFilter} options={['Delivered', 'Processing', 'Under Review', 'Rejected', 'Pending']} label="Status" />
            </div>
          }
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map(batch => (
            <div key={batch.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <TrustScoreCard score={batch.trustScore} size="sm" />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#161616' }}>{batch.id}</span>
                      <StatusBadge status={batch.status} />
                    </div>
                    <div style={{ fontSize: 13, color: '#8A8A8A', marginTop: 4 }}>
                      Hive: {batch.hiveName} ({batch.hiveId}) • Harvested: {batch.harvestDate} • Quantity: {batch.quantity} kg
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button className="btn-secondary" style={{ fontSize: 13 }} onClick={() => navigate(`/processor/batch/${batch.id}`)}>
                    <Eye size={15} /> View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageContent>
    </AppLayout>
  );
}
