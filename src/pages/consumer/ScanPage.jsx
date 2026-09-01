import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, Search } from 'lucide-react';

export default function ScanPage() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      navigate('/consumer/product/BH-2026-001');
    }, 1500);
  };

  const handleManual = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    navigate(`/consumer/product/${manualInput.trim()}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8E7', padding: '20px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button className="btn-secondary" style={{ padding: '8px 12px' }} onClick={() => navigate('/consumer/home')}>
            <ArrowLeft size={18} />
          </button>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#161616' }}>Scan Product QR Code</h2>
        </div>

        {/* QR Scanner Mock Box */}
        <div className="card" style={{ padding: 28, textAlign: 'center', marginBottom: 28, background: '#161616', color: 'white' }}>
          <div className="qr-scanner" style={{ width: 220, height: 220, margin: '0 auto 20px', background: '#252525', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <QrCode size={100} color="#F4B400" />
            {scanning && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F4B400', fontWeight: 700, fontSize: 14 }}>
                <span className="animate-spin" style={{ marginRight: 8 }}>⏳</span> Verifying Tag...
              </div>
            )}
          </div>

          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 20 }}>
            Position the QR code inside the frame to verify honey authenticity.
          </p>

          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 13 }} onClick={handleSimulateScan}>
            {scanning ? 'Reading...' : 'Tap to Simulate Camera Scan'}
          </button>
        </div>

        {/* Manual Fallback */}
        <div className="card" style={{ padding: 24 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Cannot scan? Enter Batch ID</h4>
          <form onSubmit={handleManual} style={{ display: 'flex', gap: 8 }}>
            <input 
              className="input-field" 
              placeholder="e.g. BH-2026-001" 
              value={manualInput} 
              onChange={e => setManualInput(e.target.value)} 
            />
            <button type="submit" className="btn-primary" style={{ padding: '10px 18px' }}>
              <Search size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
