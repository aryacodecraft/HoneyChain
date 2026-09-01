import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  AppLayout,
  Sidebar,
  TopNavbar,
  PageContent
} from '../../components/layouts/Layout';
import {
  DashboardCard,
  StatusBadge,
  AlertCard,
  PageHeader
} from '../../components/common/SharedComponents';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import {
  Home,
  Eye,
  Lightbulb,
  Bell,
  PlusCircle,
  History,
  User,
  Thermometer,
  Droplets,
  Weight,
  AlertTriangle,
  CheckCircle,
  Package
} from 'lucide-react';

export const beekeeperNavItems = [
  { to: '/beekeeper/dashboard', label: 'Dashboard', icon: Home },
  { to: '/beekeeper/hive/HIVE-TEST-001', label: 'Hive Details', icon: Eye },
  { to: '/beekeeper/insights', label: 'AI Insights', icon: Lightbulb },
  { to: '/beekeeper/alerts', label: 'Alerts', icon: Bell },
  { to: '/beekeeper/create-batch', label: 'Create Batch', icon: PlusCircle },
  { to: '/beekeeper/batch-history', label: 'Batch History', icon: History },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function BKDashboard() {
  const { hives, alerts, batches } = useApp();
  const navigate = useNavigate();

  // Backend uses currentStatus instead of status
  const healthyCount = hives.filter(
    h => h.currentStatus === 'healthy'
  ).length;

  const alertCount = hives.filter(
    h => h.currentStatus === 'alert' ||
         h.currentStatus === 'warning'
  ).length;

  const hive1 = hives[0];

  // Backend currently provides current metrics,
  // not historical temperature/humidity arrays.
  const chartData = hive1
    ? [
        {
          time: 'Now',
          temp: hive1.currentMetrics?.temperature ?? 0,
          humidity: hive1.currentMetrics?.humidity ?? 0,
        },
      ]
    : [];

  return (
    <AppLayout
      sidebar={
        <Sidebar
          navItems={beekeeperNavItems}
          roleLabel="Beekeeper"
          roleColor="#F4B400"
        />
      }
    >
      <TopNavbar
        title="Beekeeper Dashboard"
        subtitle="Smart Hive Monitoring & Production Management"
      />

      <PageContent>

        <PageHeader
          title="Overview"
          description="Real-time telemetry and harvest status"
          action={
            <button
              className="btn-primary"
              onClick={() => navigate('/beekeeper/create-batch')}
            >
              <PlusCircle size={18} />
              Create New Batch
            </button>
          }
        />

        {/* Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
            marginBottom: 28
          }}
        >
          <DashboardCard
            title="Total Monitored Hives"
            value={hives.length}
            subtitle="Active Smart Sensors"
            icon={Home}
            iconBg="#FFF9E6"
            iconColor="#F4B400"
          />

          <DashboardCard
            title="Healthy Hives"
            value={healthyCount}
            subtitle="Optimal temperature & weight"
            icon={CheckCircle}
            iconBg="#E8F5E9"
            iconColor="#2E7D32"
          />

          <DashboardCard
            title="Hives Requiring Attention"
            value={alertCount}
            subtitle="Parameter anomalies detected"
            icon={AlertTriangle}
            iconBg="#FDECEA"
            iconColor="#B91C2C"
          />

          <DashboardCard
            title="Active Batches"
            value={batches.length}
            subtitle="Harvested & In Traceability Flow"
            icon={Package}
            iconBg="#E3F2FD"
            iconColor="#1565C0"
          />
        </div>

        {/* Chart & Alerts */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 24,
            marginBottom: 32
          }}
        >
          <div className="card" style={{ padding: 24 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#161616'
                  }}
                >
                  Telemetry Trend
                </h3>

                <p style={{ fontSize: 12, color: '#8A8A8A' }}>
                  Current temperature & humidity
                </p>
              </div>

              <span className="badge badge-green">
                Live Sensor Sync
              </span>
            </div>

            <div style={{ width: '100%', height: 220 }}>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0ebe0"
                    />

                    <XAxis dataKey="time" />

                    <YAxis />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="temp"
                      stroke="#F4B400"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      name="Temp (°C)"
                    />

                    <Line
                      type="monotone"
                      dataKey="humidity"
                      stroke="#1565C0"
                      strokeWidth={2}
                      dot={false}
                      name="Humidity (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#8A8A8A'
                  }}
                >
                  No sensor data available
                </div>
              )}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="card" style={{ padding: 24 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>
                Recent Telemetry Alerts
              </h3>

              <NavLink
                to="/beekeeper/alerts"
                style={{
                  fontSize: 12,
                  color: '#F4B400',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                View All ({alerts.length})
              </NavLink>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
            >
              {alerts.slice(0, 3).map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Hives */}
        <h2
          style={{
            fontSize: 20,
            fontWeight: 800,
            marginBottom: 16
          }}
        >
          My Monitored Hives
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20
          }}
        >
          {hives.map(hive => {
            const hiveId = hive.hiveId;
            const metrics = hive.currentMetrics || {};

            const location = hive.location
              ? `${hive.location.district || ''}, ${
                  hive.location.state || ''
                }`
              : 'Location unavailable';

            return (
              <div
                key={hive._id || hiveId}
                className="card card-clickable"
                style={{ padding: 24 }}
                onClick={() =>
                  navigate(`/beekeeper/hive/${hiveId}`)
                }
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 16
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 18,
                        color: '#161616'
                      }}
                    >
                      {hiveId}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: '#8A8A8A'
                      }}
                    >
                      ID: {hiveId} • {location}
                    </div>
                  </div>

                  <StatusBadge
                    status={
                      hive.currentStatus === 'healthy'
                        ? 'Healthy'
                        : 'Alert'
                    }
                  />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      '1fr 1fr 1fr',
                    gap: 10,
                    background: '#FFF9E6',
                    padding: 14,
                    borderRadius: 12,
                    marginBottom: 16
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        color: '#8A8A8A',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      <Thermometer
                        size={12}
                        color="#F4B400"
                      />
                      Temp
                    </div>

                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 15,
                        marginTop: 2
                      }}
                    >
                      {metrics.temperature ?? '--'}°C
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        color: '#8A8A8A',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      <Droplets
                        size={12}
                        color="#1565C0"
                      />
                      Humid
                    </div>

                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 15,
                        marginTop: 2
                      }}
                    >
                      {metrics.humidity ?? '--'}%
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        color: '#8A8A8A',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      <Weight
                        size={12}
                        color="#2E7D32"
                      />
                      Weight
                    </div>

                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 15,
                        marginTop: 2
                      }}
                    >
                      {metrics.weight ?? '--'}kg
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: '#4A4A4A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span
                    style={{
                      fontStyle: 'italic',
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '75%'
                    }}
                  >
                    {hive.beeSpecies || 'Smart monitored hive'}
                  </span>

                  <span
                    style={{
                      fontWeight: 700,
                      color: '#F4B400'
                    }}
                  >
                    Details →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </PageContent>
    </AppLayout>
  );
}