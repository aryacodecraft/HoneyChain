import React, {
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { useApp } from "../../context/AppContext";

import {
  AppLayout,
  Sidebar,
  TopNavbar,
  PageContent,
} from "../../components/layouts/Layout";

import {
  PageHeader,
  ConfirmationModal,
  StatusBadge,
} from "../../components/common/SharedComponents";

import { beekeeperNavItems } from "./BKDashboard";

import {
  PlusCircle,
  Package,
} from "lucide-react";

export default function CreateBatchPage() {
  const {
    hives,
    batches,
    createBatch,
  } = useApp();

  const navigate = useNavigate();

  const [hiveId, setHiveId] =
    useState(
      hives[0]?._id || ""
    );

  const [quantity, setQuantity] =
    useState(40);

  const [harvestDate, setHarvestDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [notes, setNotes] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  // ======================================================
  // SELECTED HIVE
  // ======================================================

  const selectedHive = useMemo(() => {
    return (
      hives.find(
        (hive) =>
          hive._id === hiveId
      ) || hives[0]
    );
  }, [hives, hiveId]);

  // ======================================================
  // GENERATE UNIQUE BATCH ID
  // ======================================================

  const generatedBatchId = useMemo(() => {
    const year =
      new Date().getFullYear();

    let highestNumber = 0;

    batches.forEach((batch) => {
      const id =
        batch.batchId ||
        batch.id;

      if (!id) return;

      const match = id.match(
        /BH-\d{4}-(\d+)/
      );

      if (match) {
        const number =
          parseInt(
            match[1],
            10
          );

        if (
          !Number.isNaN(number) &&
          number > highestNumber
        ) {
          highestNumber = number;
        }
      }
    });

    return `BH-${year}-${String(
      highestNumber + 1
    ).padStart(3, "0")}`;
  }, [batches]);

  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedHive) {
      alert(
        "No hive available. Please create a hive first."
      );
      return;
    }

    if (
      !quantity ||
      Number(quantity) <= 0
    ) {
      alert(
        "Enter a valid honey quantity."
      );
      return;
    }

    setShowModal(true);
  };

  // ======================================================
  // CREATE BATCH IN MONGODB
  // ======================================================

  const handleConfirmCreate =
    async () => {
      if (!selectedHive) {
        return;
      }

      setLoading(true);
      setShowModal(false);

      try {
        const batchData = {
          batchId:
            generatedBatchId,

          // IMPORTANT:
          // Backend expects MongoDB _id
          hiveId:
            selectedHive._id,

          floralSource:
            notes.trim() ||
            selectedHive.floralSource ||
            "Unknown",

          harvestDate,

          harvestLocation: {
            latitude:
              selectedHive.location
                ?.latitude,

            longitude:
              selectedHive.location
                ?.longitude,

            state:
              selectedHive.location
                ?.state,

            district:
              selectedHive.location
                ?.district,
          },

          quantity: {
            value:
              Number(quantity),

            unit: "kg",
          },
        };

        console.log(
          "Creating batch:",
          batchData
        );

        await createBatch(
          batchData
        );

        navigate(
          "/beekeeper/batch-history"
        );
      } catch (error) {
        console.error(
          "Batch creation failed:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  // ======================================================
  // NO HIVES
  // ======================================================

  if (!selectedHive) {
    return (
      <AppLayout
        sidebar={
          <Sidebar
            navItems={
              beekeeperNavItems
            }
            roleLabel="Beekeeper"
            roleColor="#F4B400"
          />
        }
      >
        <TopNavbar
          title="Harvest & Create Honey Batch"
          subtitle="Initialize Traceability Identity"
        />

        <PageContent>
          <PageHeader
            title="Create Traceable Batch"
            description="Assign hive origin telemetry and generate unique Batch ID"
          />

          <div
            className="card"
            style={{
              padding: 30,
              textAlign: "center",
            }}
          >
            <h3>
              No hives available
            </h3>

            <p
              style={{
                color: "#777",
                marginTop: 8,
                marginBottom: 20,
              }}
            >
              Create a hive before
              creating a honey batch.
            </p>

            <button
              className="btn-primary"
              onClick={() =>
                navigate(
                  "/beekeeper/dashboard"
                )
              }
            >
              Go to Dashboard
            </button>
          </div>
        </PageContent>
      </AppLayout>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <AppLayout
      sidebar={
        <Sidebar
          navItems={
            beekeeperNavItems
          }
          roleLabel="Beekeeper"
          roleColor="#F4B400"
        />
      }
    >
      <TopNavbar
        title="Harvest & Create Honey Batch"
        subtitle="Initialize Traceability Identity"
      />

      <PageContent>
        <PageHeader
          title="Create Traceable Batch"
          description="Assign hive origin telemetry and generate unique Batch ID"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 28,
          }}
        >
          {/* ==================================================
              FORM
          ================================================== */}

          <div
            className="card"
            style={{
              padding: 28,
            }}
          >
            <form
              onSubmit={handleSubmit}
            >
              {/* Batch ID */}

              <div
                style={{
                  marginBottom: 20,
                }}
              >
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Generated Batch ID
                </label>

                <input
                  className="input-field"
                  value={
                    generatedBatchId
                  }
                  disabled
                  style={{
                    background:
                      "#FFF9E6",
                    fontWeight: 700,
                  }}
                />
              </div>

              {/* Hive */}

              <div
                style={{
                  marginBottom: 20,
                }}
              >
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Source Hive
                </label>

                <select
                  className="input-field"
                  value={hiveId}
                  onChange={(event) =>
                    setHiveId(
                      event.target.value
                    )
                  }
                >
                  {hives.map(
                    (hive) => (
                      <option
                        key={hive._id}
                        value={hive._id}
                      >
                        {hive.hiveId} —{" "}
                        {
                          hive.location
                            ?.district
                        }
                        ,{" "}
                        {
                          hive.location
                            ?.state
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Quantity */}

              <div
                style={{
                  marginBottom: 20,
                }}
              >
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Harvest Quantity (kg)
                </label>

                <input
                  type="number"
                  className="input-field"
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(
                      event.target.value
                    )
                  }
                  required
                  min="1"
                />
              </div>

              {/* Date */}

              <div
                style={{
                  marginBottom: 20,
                }}
              >
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Harvest Date
                </label>

                <input
                  type="date"
                  className="input-field"
                  value={harvestDate}
                  onChange={(event) =>
                    setHarvestDate(
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              {/* Flora */}

              <div
                style={{
                  marginBottom: 24,
                }}
              >
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Harvest Notes & Flora Type
                </label>

                <textarea
                  className="input-field"
                  rows="3"
                  placeholder="e.g. Mustard, Wildflower, Eucalyptus..."
                  value={notes}
                  onChange={(event) =>
                    setNotes(
                      event.target.value
                    )
                  }
                />
              </div>

              {/* Submit */}

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{
                  width: "100%",
                  justifyContent:
                    "center",
                  padding: 12,
                  opacity:
                    loading
                      ? 0.7
                      : 1,
                }}
              >
                <PlusCircle
                  size={18}
                />

                {loading
                  ? "Creating Batch..."
                  : "Initialize & Submit Batch"}
              </button>
            </form>
          </div>

          {/* ==================================================
              HIVE SNAPSHOT
          ================================================== */}

          <div
            className="card"
            style={{
              padding: 28,
              background:
                "#FFFDF7",
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Origin Hive Snapshot
            </h3>

            <div
              style={{
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                {selectedHive.hiveId}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#8A8A8A",
                }}
              >
                Location:{" "}
                {
                  selectedHive
                    .location
                    ?.district
                }
                ,{" "}
                {
                  selectedHive
                    .location
                    ?.state
                }
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  background:
                    "#FFF9E6",
                  padding: 12,
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: "#8A8A8A",
                  }}
                >
                  Floral Source
                </div>

                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                  }}
                >
                  {
                    selectedHive.floralSource ||
                    "Not specified"
                  }
                </div>
              </div>

              <div
                style={{
                  background:
                    "#E3F2FD",
                  padding: 12,
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: "#8A8A8A",
                  }}
                >
                  Bee Species
                </div>

                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                  }}
                >
                  {
                    selectedHive.beeSpecies ||
                    "Not specified"
                  }
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: 13,
                color: "#4A4A4A",
                background: "#F5F5F5",
                padding: 14,
                borderRadius: 10,
              }}
            >
              <strong>
                Status:
              </strong>{" "}

              <StatusBadge
                status={
                  selectedHive.currentStatus ===
                  "healthy"
                    ? "Healthy"
                    : "Alert"
                }
              />

              <p
                style={{
                  marginTop: 8,
                  fontSize: 12,
                }}
              >
                Floral Source:{" "}
                {
                  selectedHive
                    .floralSource ||
                  "Not specified"
                }
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================
            CONFIRMATION MODAL
        ================================================== */}

        <ConfirmationModal
          isOpen={showModal}
          title="Confirm Batch Creation"
          message={`Are you sure you want to register Batch ${generatedBatchId} from ${selectedHive.hiveId} with quantity ${quantity} kg?`}
          confirmText="Yes, Create Batch"
          onConfirm={
            handleConfirmCreate
          }
          onCancel={() =>
            setShowModal(false)
          }
          icon={Package}
        />
      </PageContent>
    </AppLayout>
  );
}