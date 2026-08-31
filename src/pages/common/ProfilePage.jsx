import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { TopNavbar, AppLayout, Sidebar, PageContent } from '../../components/layouts/Layout';
import { User, Mail, Shield, Bell, LogOut, Edit } from 'lucide-react';

export default function ProfilePage({ navItems, roleLabel, roleColor }) {
  const { currentUser, logout, addToast } = useApp();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully.', 'info');
    navigate('/login');
  };

  const handleSave = () => {
    setEditing(false);
    addToast('Profile updated successfully!', 'success');
  };

  const sidebar = navItems ? <Sidebar navItems={navItems} roleLabel={roleLabel} roleColor={roleColor} /> : null;

  return (
    <AppLayout sidebar={sidebar}>
      <TopNavbar title="My Profile" subtitle="Manage your account settings" />
      <PageContent>
        <div style={{ maxWidth: 600 }}>
          {/* Avatar Card */}
          <div className="card" style={{ padding: 32, marginBottom: 20, textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#F4B400', color: '#161616', fontWeight: 800, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              {currentUser?.avatar || 'U'}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{currentUser?.name}</div>
            <div style={{ fontSize: 14, color: '#8A8A8A', marginTop: 4 }}>{currentUser?.role}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, background: '#E8F5E9', color: '#2E7D32', padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>
              <span>●</span> Active Account
            </div>
          </div>

          {/* Info Card */}
          <div className="card" style={{ padding: 28, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontWeight: 700, fontSize: 16 }}>Account Information</h3>
              <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => setEditing(!editing)}>
                <Edit size={14} /> {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                { icon: User, label: 'Full Name', value: editing ? <input className="input-field" value={name} onChange={e => setName(e.target.value)} style={{ maxWidth: 300 }} /> : currentUser?.name },
                { icon: Mail, label: 'Email Address', value: currentUser?.email },
                { icon: Shield, label: 'Role', value: currentUser?.role },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FFF9E6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={17} color="#F4B400" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: '#8A8A8A', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
            {editing && (
              <div style={{ marginTop: 20 }}>
                <button className="btn-primary" onClick={handleSave}>Save Changes</button>
              </div>
            )}
          </div>

          {/* Preferences */}
          <div className="card" style={{ padding: 28, marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Preferences</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Bell size={17} color="#F4B400" />
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>Push Notifications</div>
                  <div style={{ fontSize: 12, color: '#8A8A8A' }}>Receive alerts for hive events and batch updates</div>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                style={{ width: 44, height: 24, borderRadius: 99, background: notifications ? '#F4B400' : '#D0D0D0', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}
              >
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: notifications ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
              </button>
            </div>
          </div>

          {/* Logout */}
          <button className="btn-danger" style={{ width: '100%', justifyContent: 'center', padding: 14 }} onClick={handleLogout}>
            <LogOut size={17} /> Logout
          </button>
        </div>
      </PageContent>
    </AppLayout>
  );
}
