import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { TrustScoreCard, StatusBadge } from '../../components/common/SharedComponents';
import { ArrowLeft, History, ChevronRight } from 'lucide-react';

export default function ConsumerHistory() {
  const navigate = useNavigate();
  const { scannedHistory } = useApp();

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8E7', padding: '20px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button className="btn-secondary" style={{ padding: '8px 12px' }} onClick={() => navigate('/consumer/home')}>
            <ArrowLeft size={18} />
          </button>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#161616' }}>Scan History</h2>
        </div>

        {scannedHistory.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center', color: '#8A8A8A' }}>
            No scanned products in your history yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {scannedHistory.map((item, idx) => (
              <div 
                key={idx} 
                className="card card-clickable" 
                style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => navigate(`/consumer/product/${item.batchId}`)}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17, color: '#161616' }}>{item.batchId}</div>
                  <div style={{ fontSize: 12, color: '#8A8A8A', marginTop: 2 }}>Scan Date: {item.scanDate}</div>
                  <div style={{ marginTop: 6 }}><StatusBadge status={item.status} /></div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <TrustScoreCard score={item.trustScore} size="sm" />
                  <ChevronRight size={18} color="#8A8A8A" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
