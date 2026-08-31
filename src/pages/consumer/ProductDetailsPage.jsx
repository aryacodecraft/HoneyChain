import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { TrustScoreCard, Timeline, StatusBadge } from '../../components/common/SharedComponents';
import { ArrowLeft, Shield, CheckCircle, MapPin, Calendar, User, Share2, QrCode } from 'lucide-react';

export default function ProductDetailsPage() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const { batches, addScannedProduct, addToast } = useApp();

  const batch = batches.find(b => b.id.toLowerCase() === batchId?.toLowerCase()) || batches[0];

  useEffect(() => {
    if (batch) {
      addScannedProduct(batch.id, batch.trustScore, batch.status);
    }
  }, [batch?.id]);

  if (!batch) {
    return (
      <div style={{ padding: 40, textAlign: 'center', background: '#FFF8E7', minHeight: '100vh' }}>
        <h2>Product Batch Not Found</h2>
        <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/consumer/home')}>
          Back to Home
        </button>
      </div>
    );
  }

  const handleShare = () => {
    addToast('Product verification link copied!', 'success');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8E7', paddingBottom: 40 }}>
      {/* Header */}
      <header style={{ background: 'white', padding: '14px 20px', borderBottom: '1px solid #E8E0D0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <button className="btn-secondary" style={{ padding: '6px 12px' }} onClick={() => navigate('/consumer/home')}>
          <ArrowLeft size={18} />
        </button>
        <span style={{ fontWeight: 800, fontSize: 16 }}>Batch {batch.id}</span>
        <button className="btn-secondary" style={{ padding: '6px 12px' }} onClick={handleShare}>
          <Share2 size={16} />
        </button>
      </header>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px' }}>
        {/* SECTION 3: Large Trust Score */}
        <div className="card" style={{ padding: 28, textAlign: 'center', marginBottom: 20, background: 'linear-gradient(180deg, #FFFDF7 0%, #FFF9E6 100%)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8A8A8A', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16 }}>
            Honey Trust Index & Authenticity
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <TrustScoreCard score={batch.trustScore} size="lg" />
          </div>
          <div style={{ fontSize: 13, color: '#4A4A4A', maxWidth: 360, margin: '0 auto' }}>
            Verified on BeeHoney Public Ledger. All sensor telemetry and quality assays verified.
          </div>
        </div>

        {/* SECTION 1: Source */}
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🐝</span> Origin & Beekeeper Source
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MapPin size={16} color="#F4B400" />
              <div><strong style={{ color: '#8A8A8A', fontSize: 12, display: 'block' }}>Origin Location</strong> {batch.location}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Calendar size={16} color="#F4B400" />
              <div><strong style={{ color: '#8A8A8A', fontSize: 12, display: 'block' }}>Harvest Date</strong> {batch.harvestDate}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <User size={16} color="#F4B400" />
              <div><strong style={{ color: '#8A8A8A', fontSize: 12, display: 'block' }}>Registered Beekeeper</strong> {batch.beekeeper} ({batch.hiveName})</div>
            </div>
          </div>
        </div>

        {/* SECTION 4: What This Means */}
        <div className="card" style={{ padding: 24, marginBottom: 20, background: '#FFFDF7' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10, color: '#161616' }}>What This Means For You</h3>
          <p style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 1.6 }}>{batch.aiInsight}</p>
        </div>

        {/* SECTION 2: Journey */}
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Complete Verified Journey</h3>
          <Timeline items={batch.timeline} />
        </div>

        {/* SECTION 5: Security */}
        <div className="card" style={{ padding: 20, textAlign: 'center', background: '#E8F5E9', border: '1px solid #2E7D3230', marginBottom: 24 }}>
          <Shield size={28} color="#2E7D32" style={{ margin: '0 auto 8px' }} />
          <div style={{ fontWeight: 700, fontSize: 14, color: '#2E7D32' }}>Secure Data Integrity Protected</div>
          <div style={{ fontSize: 12, color: '#2E7D32', marginTop: 4 }}>
            Verified data is securely recorded and protected from unauthorized changes.
          </div>
        </div>

        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }} onClick={() => navigate('/consumer/scan')}>
          <QrCode size={18} /> Scan Another Product
        </button>
      </div>
    </div>
  );
}
