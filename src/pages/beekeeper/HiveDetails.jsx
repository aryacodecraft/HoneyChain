import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { StatusBadge, PageHeader } from '../../components/common/SharedComponents';
import { beekeeperNavItems } from './BKDashboard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Thermometer, Droplets, Weight, Lightbulb, PlusCircle, MapPin, Clock } from 'lucide-react';

export default function HiveDetails() {
  const { id } = useParams();
  const { hives } = useApp();
  const navigate = useNavigate();

  const hive = hives.find(h => h.id === id) || hives[0];

  const tempChart = hive.tempHistory.map((val, i) => ({ time: `${i + 1}h`, temp: val }));
  const humidityChart = hive.humidityHistory.map((val, i) => ({ time: `${i + 1}h`, humidity: val }));
  const weightChart = hive.weightHistory.map((val, i) => ({ time: `${i + 1}h`, weight: val }));

  return (
    <AppLayout sidebar={<Sidebar navItems={beekeeperNavItems} roleLabel="Beekeeper" roleColor="#F4B400" />}>
      <TopNavbar title={`Hive Details - ${hive.name}`} subtitle={`Sensor telemetry for ${hive.id}`} />
      <PageContent>
        <PageHeader 
          title={`${hive.name} (${hive.id})`}
          description={`Location: ${hive.location} • Last Sync: ${new Date(hive.lastUpdated).toLocaleTimeString()}`}
          action={
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-secondary" onClick={() => navigate('/beekeeper/insights')}>
                <Lightbulb size={16} color="#F4B400" /> AI Insights
              </button>
              <button className="btn-primary" onClick={() => navigate('/beekeeper/create-batch')}>
                <PlusCircle size={16} /> Create Batch from Hive
              </button>
            </div>
          }
        />

        {/* Current State Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFF9E6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Thermometer size={24} color="#F4B400" />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#8A8A8A' }}>Current Temp</div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>{hive.temperature}°C</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Droplets size={24} color="#1565C0" />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#8A8A8A' }}>Current Humidity</div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>{hive.humidity}%</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Weight size={24} color="#2E7D32" />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#8A8A8A' }}>Total Hive Weight</div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>{hive.weight} kg</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 12, color: '#8A8A8A', marginBottom: 4 }}>Health Assessment</div>
            <div style={{ marginBottom: 6 }}><StatusBadge status={hive.status === 'healthy' ? 'Healthy' : 'Alert'} /></div>
            <div style={{ fontSize: 11, color: '#616161' }}>Active alerts: {hive.alerts}</div>
          </div>
        </div>

        {/* Behavior Summary */}
        <div className="card" style={{ padding: 20, marginBottom: 28, borderLeft: '4px solid #F4B400', background: '#FFFDF7' }}>
          <h4 style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: '#161616' }}>Colony Behavior Summary</h4>
          <p style={{ fontSize: 14, color: '#4A4A4A' }}>{hive.behaviour}</p>
        </div>

        {/* 3 Sensor History Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Temperature Trend (°C)</h4>
            <div style={{ width: '100%', height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tempChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis domain={[30, 42]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="temp" stroke="#F4B400" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Humidity Trend (%)</h4>
            <div style={{ width: '100%', height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={humidityChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis domain={[50, 90]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="humidity" stroke="#1565C0" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Weight Accumulation (kg)</h4>
            <div style={{ width: '100%', height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis domain={[20, 35]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#2E7D32" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </PageContent>
    </AppLayout>
  );
}
