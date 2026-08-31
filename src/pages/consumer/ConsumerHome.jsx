import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { QrCode, Search, Shield, History, ArrowRight } from 'lucide-react';
import { TrustScoreCard, StatusBadge } from '../../components/common/SharedComponents';

const journeySteps = [
  { icon: '🐝', label: 'Hive' },
  { icon: '🍯', label: 'Harvest' },
  { icon: '⚗️', label: 'Processing' },
  { icon: '🔬', label: 'Testing' },
  { icon: '🏠', label: 'Your Home' },
];

export default function ConsumerHome() {
  const navigate = useNavigate();
  const { scannedHistory } = useApp();
  const [manualBatchId, setManualBatchId] = useState('');

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!manualBatchId.trim()) return;
    navigate(`/consumer/product/${manualBatchId.trim()}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8E7', paddingBottom: 40 }}>
      {/* Consumer Header */}
      <header style={{ background: 'white', padding: '16px 24px', borderBottom: '1px solid #E8E0D0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/consumer/home')}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: '#F4B400', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🍯</div>
          <span style={{ fontWeight: 900, fontSize: 20, color: '#161616' }}>BeeHoney</span>
        </div>

        <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: 13 }} onClick={() => navigate('/consumer/history')}>
          <History size={16} /> Scan History
        </button>
      </header>

      <div style={{ maxWidth: 500, margin: '0 auto', padding: '24px 20px' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', margin: '20px 0 32px' }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#161616', letterSpacing: '-0.5px', lineHeight: 1.15, marginBottom: 12 }}>
            Know Your Honey.
          </h1>
          <p style={{ color: '#8A8A8A', fontSize: 15, lineHeight: 1.6 }}>
            Discover where your honey came from and verify its complete journey from hive to your hands.
          </p>
        </div>

        {/* Scan CTA Card */}
        <div className="card" style={{ padding: 28, textAlign: 'center', marginBottom: 32, background: 'linear-gradient(180deg, #FFFDF7 0%, #FFF9E6 100%)', border: '2px solid #F4B40040' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F4B400', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(244,180,0,0.3)' }}>
            <QrCode size={32} color="#161616" />
          </div>
          
          <button 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 16, borderRadius: 12, marginBottom: 20 }}
            onClick={() => navigate('/consumer/scan')}
          >
            SCAN PRODUCT QR CODE
          </button>

          <form onSubmit={handleManualSearch}>
            <div style={{ fontSize: 12, color: '#8A8A8A', marginBottom: 8, fontWeight: 600 }}>OR ENTER BATCH ID MANUALLY</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input 
                className="input-field" 
                placeholder="e.g. BH-2026-001" 
                value={manualBatchId} 
                onChange={e => setManualBatchId(e.target.value)} 
                style={{ background: 'white' }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '10px 18px' }}>
                <Search size={16} />
              </button>
            </div>
          </form>
        </div>

        {/* Horizontal Journey Visualization */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8A8A8A', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 }}>
            Verified Supply Chain Journey
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto', paddingBottom: 10 }}>
            {journeySteps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 70, textAlign: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'white', border: '1px solid #E8E0D0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 6 }}>
                    {step.icon}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#4A4A4A' }}>{step.label}</span>
                </div>
                {idx < journeySteps.length - 1 && <span style={{ color: '#F4B400', fontWeight: 800 }}>→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Recent Scans */}
        {scannedHistory.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#8A8A8A', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 }}>
              Recently Verified
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {scannedHistory.map((item, idx) => (
                <div key={idx} className="card card-clickable" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => navigate(`/consumer/product/${item.batchId}`)}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: '#161616' }}>{item.batchId}</div>
                    <div style={{ fontSize: 12, color: '#8A8A8A' }}>Scanned on {item.scanDate}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <TrustScoreCard score={item.trustScore} size="sm" />
                    <ArrowRight size={18} color="#8A8A8A" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footnote Security Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 40, color: '#8A8A8A', fontSize: 12 }}>
          <Shield size={16} color="#2E7D32" /> Verified by BeeHoney Secure Network
        </div>
      </div>
    </div>
  );
}
