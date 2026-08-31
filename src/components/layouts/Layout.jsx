import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Menu, X, Bell, User, ChevronDown, LogOut } from 'lucide-react';

export const Sidebar = ({ navItems, roleLabel, roleColor = '#F4B400' }) => {
  const { currentUser } = useApp();
  return (
    <aside className="sidebar" style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'auto' }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F4B400', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🍯</div>
          <div style={{ fontWeight: 800, fontSize: 18, color: 'white', letterSpacing: '-0.3px' }}>BeeHoney</div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, color: roleColor, background: `${roleColor}22`, padding: '3px 8px', borderRadius: 6, display: 'inline-block', letterSpacing: 0.5, textTransform: 'uppercase' }}>
          {roleLabel}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            {item.icon && <item.icon size={17} />}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User */}
      {currentUser && (
        <div style={{ padding: '16px 16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#F4B400', color: '#161616', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {currentUser.avatar}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{currentUser.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{currentUser.role}</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export const TopNavbar = ({ title, subtitle }) => {
  const { currentUser, logout, addToast } = useApp();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully.', 'info');
    navigate('/login');
  };

  return (
    <header style={{ background: 'white', borderBottom: '1px solid #E8E0D0', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(8px)' }}>
      <div>
        {title && <div style={{ fontSize: 17, fontWeight: 700, color: '#161616' }}>{title}</div>}
        {subtitle && <div style={{ fontSize: 12, color: '#8A8A8A' }}>{subtitle}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button style={{ width: 36, height: 36, borderRadius: 10, background: '#FFF8E7', border: '1px solid #E8E0D0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
          <Bell size={17} color="#8A8A8A" />
          <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#B91C2C', border: '2px solid white' }} />
        </button>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: '1px solid #E8E0D0', borderRadius: 10, padding: '6px 12px', cursor: 'pointer' }}
          >
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#F4B400', color: '#161616', fontWeight: 700, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {currentUser?.avatar || 'U'}
            </div>
            <div style={{ textAlign: 'left', display: 'none' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{currentUser?.name}</div>
            </div>
            <ChevronDown size={14} color="#8A8A8A" />
          </button>
          {showMenu && (
            <div style={{ position: 'absolute', right: 0, top: '110%', background: 'white', border: '1px solid #E8E0D0', borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.1)', minWidth: 180, zIndex: 200, overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #E8E0D0' }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{currentUser?.name}</div>
                <div style={{ fontSize: 12, color: '#8A8A8A' }}>{currentUser?.role}</div>
              </div>
              <button onClick={() => { navigate('/profile'); setShowMenu(false); }} style={{ width: '100%', padding: '11px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 10, color: '#252525' }}>
                <User size={15} /> Profile
              </button>
              <button onClick={handleLogout} style={{ width: '100%', padding: '11px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 10, color: '#B91C2C' }}>
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export const AppLayout = ({ sidebar, children }) => (
  <div style={{ display: 'flex', minHeight: '100vh', background: '#FFF8E7' }}>
    {sidebar}
    <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
      {children}
    </main>
  </div>
);

export const PageContent = ({ children }) => (
  <div style={{ padding: '28px 32px', maxWidth: 1400, margin: '0 auto' }}>
    {children}
  </div>
);
