import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { PageHeader, StatusBadge } from '../../components/common/SharedComponents';
import { distributorNavItems } from './DistDashboard';
import { ShieldCheck, Scan, CheckCircle, AlertTriangle } from 'lucide-react';

export default function IntegrityCheckPage() {
  const { batches } = useApp();

  const [inputBatchId, setInputBatchId] = useState('BH-2026-001');
  const [scanning, setScanning] = useState(false);
  const [checkResult, setCheckResult] = useState(null);

  const handleCheck = (idToCheck) => {
    const id = idToCheck || inputBatchId;
    const found = batches.find(b => b.id.toLowerCase() === id.trim().toLowerCase());
    setCheckResult(found || null);
  };

  const handleScanMock = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setInputBatchId('BH-2026-001');
      handleCheck('BH-2026-001');
    }, 1200);
  };

  const isVerified = checkResult && (checkResult.integrityStatus === 'Verified' || checkResult.status === 'Delivered');

  return (
    <AppLayout sidebar={<Sidebar navItems={distributorNavItems} roleLabel="Distributor" roleColor="#1565C0" />}>
      <TopNavbar title="Product Tamper & Integrity Check" subtitle="Verify Seals & Transit Telemetry Logs" />
      <PageContent>
        <PageHeader title="Product Integrity Verification" description="Scan QR or enter Batch ID to verify tamper-evident seal logs" />

        <div className="card" style={{ padding: 28, marginBottom: 28, maxWidth: 600 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Batch ID Input</label>
            <div style={{ display: 'flex', gap: 12 }}>
              <input className="input-field" value={inputBatchId} onChange={e => setInputBatchId(e.target.value)} placeholder="BH-2026-001" />
              <button className="btn-primary" style={{ background: '#1565C0', color: 'white' }} onClick={() => handleCheck()}>
                Check Integrity
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', margin: '20px 0', position: 'relative' }}>
            <hr style={{ border: 'none', borderTop: '1px solid #E8E0D0' }} />
            <span style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '0 12px', fontSize: 12, color: '#8A8A8A' }}>OR</span>
          </div>

          <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: 12 }} onClick={handleScanMock}>
            <Scan size={18} /> {scanning ? 'Scanning Tag...' : 'Simulate RFID / QR Seal Scan'}
          </button>
        </div>

        {/* Results Banner */}
        {checkResult && (
          <div className="card animate-fade-in" style={{ padding: 28, borderLeft: `6px solid ${isVerified ? '#2E7D32' : '#B91C2C'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ 
                width: 54, height: 54, borderRadius: '50%', 
                background: isVerified ? '#E8F5E9' : '#FDECEA', 
                display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}>
                {isVerified ? <CheckCircle size={32} color="#2E7D32" /> : <AlertTriangle size={32} color="#B91C2C" />}
              </div>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: isVerified ? '#2E7D32' : '#B91C2C' }}>
                  {isVerified ? 'PRODUCT INTEGRITY VERIFIED' : 'POSSIBLE TAMPERING / DEVIATION DETECTED'}
                </h2>
                <div style={{ fontSize: 14, color: '#8A8A8A' }}>Batch: {checkResult.id} • Last Location: {checkResult.currentLocation}</div>
              </div>
            </div>

            <div style={{ background: '#FFF9E6', padding: 16, borderRadius: 12, fontSize: 14 }}>
              <div><strong>Source Hive:</strong> {checkResult.hiveName} ({checkResult.hiveId})</div>
              <div><strong>Harvest Date:</strong> {checkResult.harvestDate}</div>
              <div><strong>Cold-Chain Temp Log:</strong> {checkResult.temperature}°C (Optimal Range)</div>
              <div><strong>Integrity Status:</strong> <StatusBadge status={checkResult.integrityStatus || 'Verified'} /></div>
            </div>
          </div>
        )}
      </PageContent>
    </AppLayout>
  );
}
