import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

import {
  AppLayout,
  Sidebar,
  TopNavbar,
  PageContent,
} from '../../components/layouts/Layout';

import {
  DashboardCard,
  StatusBadge,
  TrustScoreCard,
  PageHeader,
} from '../../components/common/SharedComponents';

import {
  Home,
  CheckSquare,
  Activity,
  History,
  Bell,
  User,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Package,
} from 'lucide-react';

import { processorAlerts } from '../../data/mockData';

export const processorNavItems = [
  {
    to: '/processor/dashboard',
    label: 'Dashboard',
    icon: Home,
  },
  {
    to: '/processor/verify-batch',
    label: 'Verify Batch',
    icon: CheckSquare,
  },
  {
    to: '/processor/activity',
    label: 'Add Activity',
    icon: Activity,
  },
  {
    to: '/processor/history',
    label: 'Processing History',
    icon: History,
  },
  {
    to: '/processor/alerts',
    label: 'Alerts',
    icon: Bell,
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: User,
  },
];

export default function ProcDashboard() {
  const { batches = [] } = useApp();
  const navigate = useNavigate();

  const getBatchId = (batch) => {
    return batch?.batchId || batch?.id || batch?._id || 'UNKNOWN';
  };

  const getHiveId = (batch) => {
    if (!batch?.hiveId) {
      return 'Unknown Hive';
    }

    if (typeof batch.hiveId === 'object') {
      return (
        batch.hiveId.hiveId ||
        batch.hiveId._id ||
        'Unknown Hive'
      );
    }

    return batch.hiveId;
  };

  const getHiveName = (batch) => {
    if (!batch?.hiveId) {
      return 'Unknown Hive';
    }

    if (typeof batch.hiveId === 'object') {
      return (
        batch.hiveId.name ||
        batch.hiveId.hiveId ||
        'Unknown Hive'
      );
    }

    return batch.hiveName || batch.hiveId;
  };

  const getQuantity = (batch) => {
    if (!batch?.quantity) {
      return '—';
    }

    if (typeof batch.quantity === 'object') {
      const value = batch.quantity.value;
      const unit = batch.quantity.unit || 'kg';

      if (value === undefined) {
        return '—';
      }

      return `${value} ${unit}`;
    }

    return `${batch.quantity} kg`;
  };

  const getStatus = (batch) => {
    return (
      batch?.processorStatus ||
      batch?.status ||
      'Pending'
    );
  };

  const getTrustScore = (batch) => {
    return typeof batch?.trustScore === 'number'
      ? batch.trustScore
      : 0;
  };

  const accepted = batches.filter(
    (batch) =>
      batch?.processorStatus === 'Accepted'
  ).length;

  const rejected = batches.filter(
    (batch) =>
      batch?.processorStatus === 'Rejected'
  ).length;

  const pending = batches.filter(
    (batch) => {
      const status =
        batch?.processorStatus ||
        batch?.status;

      return (
        status === 'Pending' ||
        status === 'Under Review' ||
        status === 'created'
      );
    }
  ).length;

  return (
    <AppLayout
      sidebar={
        <Sidebar
          navItems={processorNavItems}
          roleLabel="Processor"
          roleColor="#2E7D32"
        />
      }
    >
      <TopNavbar
        title="Processor Dashboard"
        subtitle="Batch Intake, Heating, Filtering & Verification Operations"
      />

      <PageContent>

        <PageHeader
          title="Processing Operations"
          description="Manage incoming batches and quality decision checks"
          action={
            <button
              className="btn-primary"
              style={{
                background: '#2E7D32',
                color: 'white',
              }}
              onClick={() =>
                navigate('/processor/verify-batch')
              }
            >
              <CheckSquare size={18} />
              Verify Incoming Batch
            </button>
          }
        />

        {/* STAT CARDS */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
            marginBottom: 28,
          }}
        >
          <DashboardCard
            title="Total Incoming Batches"
            value={batches.length}
            subtitle="From Verified Hives"
            icon={Package}
            iconBg="#E8F5E9"
            iconColor="#2E7D32"
          />

          <DashboardCard
            title="Accepted Batches"
            value={accepted}
            subtitle="Quality Cleared"
            icon={CheckCircle}
            iconBg="#E8F5E9"
            iconColor="#2E7D32"
          />

          <DashboardCard
            title="Pending Decisions"
            value={pending}
            subtitle="Requires Review"
            icon={AlertTriangle}
            iconBg="#FFF9E6"
            iconColor="#D4A000"
          />

          <DashboardCard
            title="Rejected Batches"
            value={rejected}
            subtitle="Non-compliant"
            icon={XCircle}
            iconBg="#FDECEA"
            iconColor="#B91C2C"
          />
        </div>

        {/* BATCH TABLE */}

        <div
          className="card"
          style={{
            padding: 24,
            marginBottom: 32,
          }}
        >
          <h3
            style={{
              fontSize: 18,
              fontWeight: 800,
              marginBottom: 16,
            }}
          >
            Recent Incoming Batches
          </h3>

          <div style={{ overflowX: 'auto' }}>

            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 14,
              }}
            >

              <thead>
                <tr
                  style={{
                    borderBottom:
                      '2px solid #E8E0D0',
                    textAlign: 'left',
                    color: '#8A8A8A',
                  }}
                >
                  <th style={{ padding: '10px 12px' }}>
                    Batch ID
                  </th>

                  <th style={{ padding: '10px 12px' }}>
                    Source Hive
                  </th>

                  <th style={{ padding: '10px 12px' }}>
                    Harvest Date
                  </th>

                  <th style={{ padding: '10px 12px' }}>
                    Quantity
                  </th>

                  <th style={{ padding: '10px 12px' }}>
                    Trust Score
                  </th>

                  <th style={{ padding: '10px 12px' }}>
                    Status
                  </th>

                  <th style={{ padding: '10px 12px' }}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>

                {batches.length === 0 ? (

                  <tr key="no-batches">
                    <td
                      colSpan="7"
                      style={{
                        padding: 30,
                        textAlign: 'center',
                        color: '#8A8A8A',
                      }}
                    >
                      No batches available.
                    </td>
                  </tr>

                ) : (

                  batches.map((batch, index) => {

                    const batchId =
                      getBatchId(batch);

                    const hiveId =
                      getHiveId(batch);

                    const hiveName =
                      getHiveName(batch);

                    const quantity =
                      getQuantity(batch);

                    const status =
                      getStatus(batch);

                    const trustScore =
                      getTrustScore(batch);

                    return (
                      <tr
                        key={
                          batch?._id ||
                          batch?.batchId ||
                          batch?.id ||
                          `batch-${index}`
                        }
                        style={{
                          borderBottom:
                            '1px solid #E8E0D0',
                        }}
                      >

                        {/* BATCH ID */}

                        <td
                          style={{
                            padding: '14px 12px',
                            fontWeight: 700,
                          }}
                        >
                          {batchId}
                        </td>

                        {/* HIVE */}

                        <td
                          style={{
                            padding: '14px 12px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 600,
                            }}
                          >
                            {hiveName}
                          </div>

                          <div
                            style={{
                              fontSize: 11,
                              color: '#8A8A8A',
                              marginTop: 3,
                            }}
                          >
                            {hiveId}
                          </div>
                        </td>

                        {/* DATE */}

                        <td
                          style={{
                            padding: '14px 12px',
                          }}
                        >
                          {batch?.harvestDate
                            ? new Date(
                                batch.harvestDate
                              ).toLocaleDateString()
                            : '—'}
                        </td>

                        {/* QUANTITY */}

                        <td
                          style={{
                            padding: '14px 12px',
                          }}
                        >
                          {quantity}
                        </td>

                        {/* TRUST */}

                        <td
                          style={{
                            padding: '14px 12px',
                          }}
                        >
                          <TrustScoreCard
                            score={trustScore}
                            size="sm"
                          />
                        </td>

                        {/* STATUS */}

                        <td
                          style={{
                            padding: '14px 12px',
                          }}
                        >
                          <StatusBadge
                            status={status}
                          />
                        </td>

                        {/* ACTION */}

                        <td
                          style={{
                            padding: '14px 12px',
                          }}
                        >
                          <button
                            className="btn-secondary"
                            style={{
                              padding: '4px 10px',
                              fontSize: 12,
                            }}
                            onClick={() =>
                              navigate(
                                `/processor/decision/${batchId}`
                              )
                            }
                          >
                            Review Decision
                          </button>
                        </td>

                      </tr>
                    );
                  })

                )}

              </tbody>

            </table>

          </div>
        </div>

        {/* ALERTS */}

        <div
          className="card"
          style={{
            padding: 24,
          }}
        >
          <h3
            style={{
              fontSize: 18,
              fontWeight: 800,
              marginBottom: 16,
            }}
          >
            Processor Alerts
          </h3>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >

            {processorAlerts.map(
              (alert, index) => (

                <div
                  key={
                    alert?.id ||
                    alert?._id ||
                    alert?.batchId ||
                    `alert-${index}`
                  }
                  style={{
                    padding: 14,
                    borderRadius: 10,
                    background:
                      alert?.severity === 'Critical'
                        ? '#FDECEA'
                        : '#FFF9E6',
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    alignItems: 'center',
                  }}
                >

                  <div>

                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      {alert?.issue || 'Processor alert'}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: '#8A8A8A',
                      }}
                    >
                      Batch:{' '}
                      {alert?.batchId || '—'}
                      {' • '}
                      {alert?.date
                        ? new Date(
                            alert.date
                          ).toLocaleString()
                        : '—'}
                    </div>

                  </div>

                  <StatusBadge
                    status={
                      alert?.status ||
                      'Pending'
                    }
                  />

                </div>

              )
            )}

          </div>
        </div>

      </PageContent>
    </AppLayout>
  );
}