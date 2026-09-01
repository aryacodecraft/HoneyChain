import React, {
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import { useApp } from "../../context/AppContext";

import {
  AppLayout,
  Sidebar,
  TopNavbar,
  PageContent,
} from "../../components/layouts/Layout";

import {
  PageHeader,
  StatusBadge,
  RiskBadge,
  TrustScoreCard,
  ConfirmationModal,
} from "../../components/common/SharedComponents";

import {
  processorNavItems,
} from "./ProcDashboard";

import {
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default function DecisionPage() {
  const { id } = useParams();

  const {
    batches,
    updateBatchStatus,
    addToast,
  } = useApp();

  const navigate = useNavigate();

  // ======================================================
  // FIND BATCH
  // ======================================================

  const batch =
    batches.find(
      (b) =>
        b.batchId === id
    ) || batches[0];

  const [
    modalType,
    setModalType,
  ] = useState(null);

  // ======================================================
  // SAFETY CHECK
  // ======================================================

  if (!batch) {
    return (
      <AppLayout
        sidebar={
          <Sidebar
            navItems={
              processorNavItems
            }
            roleLabel="Processor"
            roleColor="#2E7D32"
          />
        }
      >
        <TopNavbar
          title="Batch Not Found"
          subtitle="Processor Operations"
        />

        <PageContent>
          <PageHeader
            title="Batch Not Found"
            description="The requested batch could not be found."
          />

          <button
            className="btn-secondary"
            onClick={() =>
              navigate(
                "/processor/dashboard"
              )
            }
          >
            Back to Dashboard
          </button>
        </PageContent>
      </AppLayout>
    );
  }

  // ======================================================
  // ACCEPT / REJECT
  // ======================================================

  const handleDecision = async (
    accepted
  ) => {
    try {
      const newStatus =
        accepted
          ? "Accepted"
          : "Rejected";

      console.log(
        "Processor decision:",
        {
          batchId:
            batch.batchId,
          decision:
            newStatus,
        }
      );

      await updateBatchStatus(
        batch.batchId,
        {
          processorStatus:
            newStatus,

          reason: accepted
            ? undefined
            : "Rejected by processor",
        }
      );

      addToast(
        `Batch ${batch.batchId} has been ${newStatus.toUpperCase()}`,
        accepted
          ? "success"
          : "error"
      );

      setModalType(null);

      navigate(
        "/processor/dashboard"
      );
    } catch (error) {
      console.error(
        "Decision update failed:",
        error
      );

      setModalType(null);
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <AppLayout
      sidebar={
        <Sidebar
          navItems={
            processorNavItems
          }
          roleLabel="Processor"
          roleColor="#2E7D32"
        />
      }
    >
      <TopNavbar
        title={`Processor Decision Gate - ${batch.batchId}`}
        subtitle="Final Intake Verification & Quality Signoff"
      />

      <PageContent>
        <PageHeader
          title={`Intake Decision: Batch ${batch.batchId}`}
          description={`Source: ${
            batch.hiveId?.hiveId ||
            batch.hiveId ||
            "Unknown Hive"
          }`}
        />

        {/* ==================================================
            BATCH SUMMARY
        ================================================== */}

        <div
          className="card"
          style={{
            padding: 28,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 20,
              marginBottom: 24,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                }}
              >
                Batch Summary Audit
              </h2>

              <div
                style={{
                  fontSize: 14,
                  color: "#8A8A8A",
                  marginTop: 4,
                }}
              >
                Harvest Date:{" "}
                {batch.harvestDate}
                {" • "}
                Quantity:{" "}
                {batch.quantity?.value ??
                  batch.quantity ??
                  0}{" "}
                {batch.quantity?.unit ||
                  "kg"}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                gap: 16,
              }}
            >
              <RiskBadge
                level={
                  batch.riskLevel ||
                  "low"
                }
              />

              <TrustScoreCard
                score={
                  batch.trustScore ||
                  0
                }
                size="md"
              />
            </div>
          </div>

          {/* ==================================================
              AI INSIGHT
          ================================================== */}

          {batch.aiInsight && (
            <div
              style={{
                background:
                  "#FFF9E6",
                padding: 18,
                borderRadius: 12,
                marginBottom: 24,
              }}
            >
              <h4
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#161616",
                  marginBottom: 4,
                }}
              >
                AI Recommendation &
                Insight
              </h4>

              <p
                style={{
                  fontSize: 14,
                  color: "#4A4A4A",
                }}
              >
                {batch.aiInsight}
              </p>
            </div>
          )}

          {/* ==================================================
              ANOMALIES
          ================================================== */}

          {batch.anomalies &&
            batch.anomalies.length >
              0 && (
              <div
                style={{
                  background:
                    "#FDECEA",
                  padding: 18,
                  borderRadius: 12,
                  marginBottom: 24,
                  border:
                    "1px solid #B91C2C30",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#B91C2C",
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: 6,
                    marginBottom: 8,
                  }}
                >
                  <AlertTriangle
                    size={18}
                  />

                  Flagged Telemetry
                  Anomalies
                </div>

                <ul
                  style={{
                    paddingLeft: 20,
                    fontSize: 13,
                    color: "#B91C2C",
                  }}
                >
                  {batch.anomalies.map(
                    (a, i) => (
                      <li key={i}>
                        {a}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

          {/* ==================================================
              CURRENT STATUS
          ================================================== */}

          <div
            style={{
              marginBottom: 20,
              display: "flex",
              alignItems:
                "center",
              gap: 10,
            }}
          >
            <strong>
              Current Status:
            </strong>

            <StatusBadge
              status={
                batch.status
              }
            />
          </div>

          {/* ==================================================
              DECISION BUTTONS
          ================================================== */}

          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 12,
            }}
          >
            <button
              className="btn-success"
              style={{
                flex: 1,
                justifyContent:
                  "center",
                padding: 14,
                fontSize: 15,
              }}
              onClick={() =>
                setModalType(
                  "accept"
                )
              }
            >
              <CheckCircle
                size={20}
              />

              ACCEPT BATCH
            </button>

            <button
              className="btn-danger"
              style={{
                flex: 1,
                justifyContent:
                  "center",
                padding: 14,
                fontSize: 15,
              }}
              onClick={() =>
                setModalType(
                  "reject"
                )
              }
            >
              <XCircle
                size={20}
              />

              REJECT BATCH
            </button>
          </div>
        </div>

        {/* ==================================================
            ACCEPT MODAL
        ================================================== */}

        <ConfirmationModal
          isOpen={
            modalType ===
            "accept"
          }
          title="Confirm Batch Acceptance"
          message={`Are you sure you want to ACCEPT Batch ${batch.batchId}? This will authorize further processing and distribution.`}
          confirmText="Accept Batch"
          confirmClass="btn-success"
          onConfirm={() =>
            handleDecision(true)
          }
          onCancel={() =>
            setModalType(null)
          }
          icon={CheckCircle}
        />

        {/* ==================================================
            REJECT MODAL
        ================================================== */}

        <ConfirmationModal
          isOpen={
            modalType ===
            "reject"
          }
          title="Confirm Batch Rejection"
          message={`Are you sure you want to REJECT Batch ${batch.batchId}? This batch will be flagged and stopped from continuing through the supply chain.`}
          confirmText="Reject Batch"
          confirmClass="btn-danger"
          onConfirm={() =>
            handleDecision(false)
          }
          onCancel={() =>
            setModalType(null)
          }
          icon={XCircle}
        />
      </PageContent>
    </AppLayout>
  );
}