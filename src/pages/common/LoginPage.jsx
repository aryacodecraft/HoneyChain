import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const roles = [
  { key: 'beekeeper', label: 'Beekeeper', icon: '🐝', color: '#F4B400', path: '/beekeeper/dashboard', desc: 'Monitor hive health and create traceable honey batches.' },
  { key: 'processor', label: 'Processor', icon: '⚗️', color: '#2E7D32', path: '/processor/dashboard', desc: 'Verify incoming batches and manage processing activities.' },
  { key: 'distributor', label: 'Distributor', icon: '🚚', color: '#1565C0', path: '/distributor/dashboard', desc: 'Track honey shipments and verify product integrity.' },
  { key: 'lab', label: 'Lab / Regulator', icon: '🔬', color: '#7B1FA2', path: '/lab/dashboard', desc: 'Analyze suspicious batches and manage laboratory compliance.' },
  { key: 'consumer', label: 'Consumer', icon: '👤', color: '#E65100', path: '/consumer/home', desc: 'Verify honey authenticity and discover its complete journey.' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, addToast } = useApp();
  const navigate = useNavigate();

  const handleRoleLogin = (roleKey, path) => {
    setLoading(true);
    login(roleKey);
    setTimeout(() => {
      setLoading(false);
      addToast(`Welcome! Logged in as ${roles.find(r => r.key === roleKey)?.label}`, 'success');
      navigate(path);
    }, 600);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) { addToast('Please fill in all fields.', 'warning'); return; }
    navigate('/roles');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF8E7 0%, #FFF0CC 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden' }}>
      {/* Subtle hex pattern */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='92' viewBox='0 0 80 92'%3E%3Cpath d='M40 0L80 20v52L40 92 0 72V20L40 0z' fill='%23F4B400' fill-opacity='1'/%3E%3C/svg%3E")`, backgroundSize: '80px' }} />

      <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: '#F4B400', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(244,180,0,0.3)' }}>🍯</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#161616', letterSpacing: '-0.5px' }}>BeeHoney</div>
          <div style={{ fontSize: 14, color: '#8A8A8A', marginTop: 6 }}>From Hive to Your Table — Trusted & Traced</div>
        </div>

        {/* Login Card */}
        <div style={{ background: 'white', borderRadius: 20, padding: '32px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1px solid #E8E0D0', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Sign In</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Email</label>
              <input className="input-field" type="email" placeholder="you@beehoney.in" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Password</label>
              <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 13 }}>
              {loading ? <span className="animate-spin">⏳</span> : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Role Quick Login */}
        <div style={{ background: 'white', borderRadius: 20, padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #E8E0D0' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#8A8A8A', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16 }}>Demo — Continue As</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {roles.map(role => (
              <button
                key={role.key}
                onClick={() => handleRoleLogin(role.key, role.path)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', border: '1.5px solid #E8E0D0', borderRadius: 12, background: '#FFFDF7', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = role.color; e.currentTarget.style.background = `${role.color}10`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E0D0'; e.currentTarget.style.background = '#FFFDF7'; }}
              >
                <span style={{ fontSize: 20 }}>{role.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#161616' }}>{role.label}</div>
                  <div style={{ fontSize: 11, color: '#8A8A8A' }}>{role.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
