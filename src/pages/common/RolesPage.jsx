import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const roles = [
  { key: 'beekeeper', label: 'Beekeeper', icon: '🐝', color: '#F4B400', path: '/beekeeper/dashboard', desc: 'Monitor hive health and create traceable honey batches.', bg: '#FFF9E6' },
  { key: 'processor', label: 'Processor', icon: '⚗️', color: '#2E7D32', path: '/processor/dashboard', desc: 'Verify incoming batches and manage processing activities.', bg: '#E8F5E9' },
  { key: 'distributor', label: 'Distributor', icon: '🚚', color: '#1565C0', path: '/distributor/dashboard', desc: 'Track honey shipments and verify product integrity.', bg: '#E3F2FD' },
  { key: 'lab', label: 'Lab / Regulator', icon: '🔬', color: '#7B1FA2', path: '/lab/dashboard', desc: 'Analyze suspicious batches and manage laboratory compliance.', bg: '#F3E5F5' },
  { key: 'consumer', label: 'Consumer', icon: '👤', color: '#E65100', path: '/consumer/home', desc: 'Verify honey authenticity and discover its complete journey.', bg: '#FBE9E7' },
];

const journey = [
  { icon: '🐝', label: 'Hive' },
  { icon: '🍯', label: 'Processing' },
  { icon: '🚚', label: 'Distribution' },
  { icon: '🔬', label: 'Testing' },
  { icon: '🏠', label: 'Consumer' },
];

export default function RolesPage() {
  const navigate = useNavigate();
  const { login, addToast } = useApp();

  const handleEnter = (role) => {
    login(role.key);
    addToast(`Welcome! Logged in as ${role.label}`, 'success');
    navigate(role.path);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8E7', padding: '40px 20px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>🍯</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#161616', letterSpacing: '-0.5px', marginBottom: 10 }}>BeeHoney Platform</h1>
          <p style={{ color: '#8A8A8A', fontSize: 16 }}>Select your role to enter the platform</p>
        </div>

        {/* Journey */}
        <div style={{ background: 'white', borderRadius: 16, padding: '20px 28px', marginBottom: 40, border: '1px solid #E8E0D0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#8A8A8A', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16 }}>Honey Journey</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {journey.map((step, i) => (
              <React.Fragment key={i}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFF9E6', border: '2px solid #F4B400', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{step.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#252525' }}>{step.label}</div>
                </div>
                {i < journey.length - 1 && <div style={{ color: '#F4B400', fontSize: 18, fontWeight: 700 }}>→</div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Role Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {roles.map(role => (
            <div key={role.key} className="card card-clickable" style={{ padding: 28 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: role.bg, border: `2px solid ${role.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>{role.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 17, color: '#161616', marginBottom: 8 }}>{role.label}</h3>
              <p style={{ fontSize: 13, color: '#8A8A8A', marginBottom: 20, lineHeight: 1.6 }}>{role.desc}</p>
              <button
                className="btn-primary"
                style={{ background: role.color, width: '100%', justifyContent: 'center', color: role.key === 'beekeeper' ? '#161616' : 'white' }}
                onClick={() => handleEnter(role)}
              >
                Enter Dashboard →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
