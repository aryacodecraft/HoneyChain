import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastNotification = () => {
  const { toasts, removeToast } = useApp();
  const icons = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info };
  return (
    <div className="toast-container">
      {toasts.map(toast => {
        const Icon = icons[toast.type] || Info;
        return (
          <div key={toast.id} className={`toast toast-${toast.type} animate-toast`}>
            <Icon size={18} />
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-2 opacity-70 hover:opacity-100">
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  const map = {
    'Healthy': 'badge-green', 'Verified': 'badge-green', 'Accepted': 'badge-green',
    'Delivered': 'badge-green', 'Passed': 'badge-green', 'Resolved': 'badge-green',
    'Safe': 'badge-green', 'Active': 'badge-green',
    'Alert': 'badge-red', 'Rejected': 'badge-red', 'Failed': 'badge-red',
    'Suspicious': 'badge-red', 'Critical': 'badge-red', 'Tampering': 'badge-red',
    'Pending': 'badge-yellow', 'Processing': 'badge-yellow', 'In Transit': 'badge-yellow',
    'Warning': 'badge-yellow', 'Under Review': 'badge-yellow', 'Preparing': 'badge-yellow',
    'Info': 'badge-blue', 'Normal': 'badge-blue', 'N/A': 'badge-gray',
  };
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
};

export const RiskBadge = ({ level }) => {
  const map = { 'Low': 'badge-green', 'Medium': 'badge-yellow', 'High': 'badge-red', 'Critical': 'badge-red' };
  return <span className={`badge ${map[level] || 'badge-gray'}`}>{level} Risk</span>;
};

export const TrustScoreCard = ({ score, size = 'md' }) => {
  const color = score >= 80 ? '#2E7D32' : score >= 60 ? '#D4A000' : '#B91C2C';
  const label = score >= 80 ? 'Safe & Verified' : score >= 60 ? 'Moderate Risk' : 'High Risk';
  const dim = size === 'lg' ? 140 : size === 'sm' ? 80 : 110;
  const border = size === 'lg' ? 7 : 5;
  return (
    <div style={{ width: dim, height: dim, borderRadius: '50%', border: `${border}px solid ${color}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: `${color}10` }}>
      <div style={{ fontSize: size === 'lg' ? 28 : size === 'sm' ? 18 : 22, fontWeight: 800, color }}>{score}</div>
      <div style={{ fontSize: size === 'lg' ? 10 : 8, color, textAlign: 'center', fontWeight: 600, lineHeight: 1.2 }}>{label}</div>
    </div>
  );
};

export const ConfirmationModal = ({ isOpen, title, message, confirmText, confirmClass, onConfirm, onCancel, icon: Icon }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {Icon && (
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FFF9E6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Icon size={28} color="#F4B400" />
          </div>
        )}
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{title}</h2>
        <p style={{ color: '#8A8A8A', marginBottom: 28, lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className={confirmClass || 'btn-primary'} onClick={onConfirm}>{confirmText || 'Confirm'}</button>
        </div>
      </div>
    </div>
  );
};

export const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => (
  <div style={{ position: 'relative' }}>
    <input
      className="input-field"
      style={{ paddingLeft: 38, minWidth: 220 }}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
    <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8A8A8A' }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
  </div>
);

export const FilterDropdown = ({ value, onChange, options, label = 'Filter' }) => (
  <select className="input-field" style={{ minWidth: 150 }} value={value} onChange={e => onChange(e.target.value)}>
    <option value="">{label}: All</option>
    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
  </select>
);

export const EmptyState = ({ icon: Icon, title, description }) => (
  <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8A8A8A' }}>
    {Icon && <Icon size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />}
    <div style={{ fontWeight: 600, fontSize: 16, color: '#252525', marginBottom: 8 }}>{title}</div>
    <div style={{ fontSize: 14 }}>{description}</div>
  </div>
);

export const PageHeader = ({ title, description, action }) => (
  <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: '#161616', marginBottom: 4 }}>{title}</h1>
      {description && <p style={{ color: '#8A8A8A', fontSize: 14 }}>{description}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const DashboardCard = ({ title, value, subtitle, icon: Icon, iconBg = '#FFF9E6', iconColor = '#F4B400', trend }) => (
  <div className="card" style={{ padding: '20px 24px' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: '#8A8A8A' }}>{title}</div>
      {Icon && (
        <div style={{ width: 40, height: 40, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={iconColor} />
        </div>
      )}
    </div>
    <div style={{ fontSize: 32, fontWeight: 800, color: '#161616', lineHeight: 1 }}>{value}</div>
    {subtitle && <div style={{ marginTop: 6, fontSize: 12, color: '#8A8A8A' }}>{subtitle}</div>}
    {trend && <div style={{ marginTop: 8, fontSize: 12, color: trend > 0 ? '#2E7D32' : '#B91C2C', fontWeight: 600 }}>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week</div>}
  </div>
);

export const AlertCard = ({ alert, onResolve }) => {
  const color = alert.severity === 'Critical' ? '#B91C2C' : alert.severity === 'Warning' ? '#D4A000' : '#1565C0';
  const bg = alert.severity === 'Critical' ? '#FDECEA' : alert.severity === 'Warning' ? '#FFF9E6' : '#E3F2FD';
  return (
    <div className="card" style={{ padding: '16px 20px', borderLeft: `4px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color, background: bg, padding: '2px 8px', borderRadius: 99 }}>{alert.severity}</span>
            <span style={{ fontSize: 12, color: '#8A8A8A' }}>{alert.hiveId || alert.batchId}</span>
          </div>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{alert.issue}</div>
          <div style={{ fontSize: 12, color: '#8A8A8A' }}>{new Date(alert.detectedTime || alert.date).toLocaleString()}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <StatusBadge status={alert.status} />
          {alert.status !== 'Resolved' && onResolve && (
            <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => onResolve(alert.id)}>Resolve</button>
          )}
        </div>
      </div>
    </div>
  );
};

export const Timeline = ({ items }) => (
  <div style={{ padding: '8px 0' }}>
    {items.map((item, i) => {
      const isDone = item.status === 'done';
      const isActive = item.status === 'active';
      const isRejected = item.status === 'rejected';
      const color = isRejected ? '#B91C2C' : isDone ? '#2E7D32' : isActive ? '#F4B400' : '#D0D0D0';
      return (
        <div key={i} className="timeline-item" style={{ paddingLeft: 32 }}>
          <div className="timeline-dot" style={{ background: color, color: 'white', width: 22, height: 22 }}>
            {isDone && <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>}
            {isActive && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
            {isRejected && <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>}
            {item.status === 'pending' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#D0D0D0' }} />}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: isDone || isActive ? '#161616' : '#8A8A8A' }}>{item.stage}</div>
            <div style={{ fontSize: 12, color: '#8A8A8A', marginTop: 2 }}>{item.date || 'Pending'}</div>
            <div style={{ fontSize: 13, color: '#4A4A4A', marginTop: 4, lineHeight: 1.5 }}>{item.description}</div>
          </div>
        </div>
      );
    })}
  </div>
);

export const LoadingSkeleton = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
    {[1,2,3,4].map(i => (
      <div key={i} className="card" style={{ padding: 24, height: 120 }}>
        <div style={{ background: '#f0ebe0', borderRadius: 6, height: 12, width: '60%', marginBottom: 16 }} />
        <div style={{ background: '#f0ebe0', borderRadius: 6, height: 24, width: '40%' }} />
      </div>
    ))}
  </div>
);
