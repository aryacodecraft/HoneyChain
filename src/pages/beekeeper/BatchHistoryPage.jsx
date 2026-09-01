import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

import {
  AppLayout,
  Sidebar,
  TopNavbar,
  PageContent
} from '../../components/layouts/Layout';

import {
  PageHeader,
  StatusBadge,
  TrustScoreCard,
  SearchBar,
  FilterDropdown
} from '../../components/common/SharedComponents';

import { beekeeperNavItems } from './BKDashboard';
import { Eye } from 'lucide-react';

export default function BatchHistoryPage() {
  const { batches } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  /*
   * MongoDB batch structure:
   *
   * {
   *   batchId: "BH-2026-005",
   *   hiveId: {
   *      hiveId: "HIVE-001",
   *      location: {...},
   *      ...
   *   },
   *   quantity: {
   *      value: 40,
   *      unit: "kg"
   *   }
   * }
   *
   * The old UI expected:
   *
   * batch.id
   * batch.hiveId as a string
   * batch.quantity as a number
   *
   * So we normalize the data before displaying it.
   */

  const normalizedBatches = (batches || []).map((batch) => {
    // -----------------------------
    // Batch ID
    // -----------------------------
    const batchId =
      batch.batchId ||
      batch.id ||
      batch._id ||
      'Unknown Batch';

    // -----------------------------
    // Hive
    // -----------------------------
    let hiveId = 'Unknown Hive';
    let hiveName = 'Hive';

    if (typeof batch.hiveId === 'object' && batch.hiveId !== null) {
      hiveId =
        batch.hiveId.hiveId ||
        batch.hiveId._id ||
        'Unknown Hive';

      hiveName =
        batch.hiveId.hiveId ||
        'Hive';
    } else if (batch.hiveId) {
      hiveId = String(batch.hiveId);
      hiveName = String(batch.hiveId);
    }

    // -----------------------------
    // Quantity
    // -----------------------------
    let quantityValue = 0;
    let quantityUnit = 'kg';

    if (
      typeof batch.quantity === 'object' &&
      batch.quantity !== null
    ) {
      quantityValue =
        batch.quantity.value ?? 0;

      quantityUnit =
        batch.quantity.unit || 'kg';
    } else {
      quantityValue =
        batch.quantity ?? 0;

      quantityUnit =
        batch.unit || 'kg';
    }

    // -----------------------------
    // Status
    // -----------------------------
    const status =
      batch.status ||
      'created';

    // -----------------------------
    // Trust score
    // -----------------------------
    const trustScore =
      typeof batch.trustScore === 'number'
        ? batch.trustScore
        : 0;

    return {
      ...batch,

      displayId: String(batchId),
      displayHiveId: String(hiveId),
      displayHiveName: String(hiveName),

      displayQuantity: quantityValue,
      displayUnit: quantityUnit,

      displayStatus: String(status),
      displayTrustScore: trustScore
    };
  });

  // ---------------------------------------
  // Search + Status Filter
  // ---------------------------------------

  const filtered = normalizedBatches.filter((batch) => {
    const searchText =
      search.trim().toLowerCase();

    const matchesSearch =
      !searchText ||
      batch.displayId
        .toLowerCase()
        .includes(searchText) ||
      batch.displayHiveId
        .toLowerCase()
        .includes(searchText) ||
      batch.displayHiveName
        .toLowerCase()
        .includes(searchText);

    const matchesStatus =
      !statusFilter ||
      batch.displayStatus
        .toLowerCase() ===
        statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

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
        title="Honey Batch History"
        subtitle="Traceability & Harvest Logs"
      />

      <PageContent>

        {/* -------------------------------- */}
        {/* Page Header */}
        {/* -------------------------------- */}

        <PageHeader
          title="Harvest Batch History"
          description="Track all honey batches created from your hives"
          action={
            <div
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap'
              }}
            >
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search Batch ID..."
              />

              <FilterDropdown
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  'created',
                  'Delivered',
                  'Processing',
                  'Under Review',
                  'Rejected',
                  'Pending'
                ]}
                label="Status"
              />
            </div>
          }
        />

        {/* -------------------------------- */}
        {/* No Batches */}
        {/* -------------------------------- */}

        {filtered.length === 0 && (
          <div
            className="card"
            style={{
              padding: 40,
              textAlign: 'center'
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#161616',
                marginBottom: 8
              }}
            >
              No batches found
            </div>

            <div
              style={{
                fontSize: 13,
                color: '#8A8A8A'
              }}
            >
              {batches && batches.length > 0
                ? 'Try changing your search or status filter.'
                : 'Create a honey batch to see it here.'}
            </div>
          </div>
        )}

        {/* -------------------------------- */}
        {/* Batch List */}
        {/* -------------------------------- */}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}
        >
          {filtered.map((batch) => (
            <div
              key={batch.displayId}
              className="card"
              style={{
                padding: 20
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 16
                }}
              >

                {/* -------------------------------- */}
                {/* Batch Information */}
                {/* -------------------------------- */}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16
                  }}
                >

                  <TrustScoreCard
                    score={batch.displayTrustScore}
                    size="sm"
                  />

                  <div>

                    {/* Batch ID + Status */}

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        flexWrap: 'wrap'
                      }}
                    >
                      <span
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: '#161616'
                        }}
                      >
                        {batch.displayId}
                      </span>

                      <StatusBadge
                        status={batch.displayStatus}
                      />
                    </div>

                    {/* Main Details */}

                    <div
                      style={{
                        fontSize: 13,
                        color: '#8A8A8A',
                        marginTop: 6
                      }}
                    >
                      Hive:{' '}
                      {batch.displayHiveName}
                      {' ('}
                      {batch.displayHiveId}
                      {')'}

                      {' • '}

                      Harvested:{' '}
                      {batch.harvestDate || 'N/A'}

                      {' • '}

                      Quantity:{' '}
                      {batch.displayQuantity}{' '}
                      {batch.displayUnit}
                    </div>

                    {/* Floral Source */}

                    {batch.floralSource && (
                      <div
                        style={{
                          fontSize: 12,
                          color: '#6A6A6A',
                          marginTop: 6
                        }}
                      >
                        Floral Source:{' '}
                        {batch.floralSource}
                      </div>
                    )}

                    {/* Harvest Location */}

                    {batch.harvestLocation && (
                      <div
                        style={{
                          fontSize: 12,
                          color: '#6A6A6A',
                          marginTop: 4
                        }}
                      >
                        Location:{' '}
                        {batch.harvestLocation.district ||
                          batch.harvestLocation.state ||
                          'N/A'}
                      </div>
                    )}

                  </div>
                </div>

                {/* -------------------------------- */}
                {/* View Details */}
                {/* -------------------------------- */}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}
                >
                  <button
                    className="btn-secondary"
                    style={{
                      fontSize: 13
                    }}
                    onClick={() =>
                      navigate(
                        `/processor/batch/${batch.displayId}`
                      )
                    }
                  >
                    <Eye size={15} />
                    View Details
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </PageContent>
    </AppLayout>
  );
}