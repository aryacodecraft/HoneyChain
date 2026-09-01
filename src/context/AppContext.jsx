import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getMyHives,
  getMyBatches,
  loginUser,
  createHoneyBatch,
} from "../services/api";

import {
  batches as initialBatches,
  alerts as initialAlerts,
  labResults as initialLabResults,
  shipments as initialShipments,
} from "../data/mockData";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [batches, setBatches] = useState([]);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [hives, setHives] = useState([]);
  const [labResults, setLabResults] = useState(initialLabResults);
  const [shipments] = useState(initialShipments);

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [scannedHistory, setScannedHistory] = useState([
    {
      batchId: "BH-2026-001",
      status: "Delivered",
      trustScore: 92,
      scanDate: "2026-08-26",
    },
  ]);

  const [toasts, setToasts] = useState([]);

  // ======================================================
  // LOAD DATA FROM BACKEND
  // ======================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const loadBackendData = async () => {
      try {
        const [hiveResult, batchResult] = await Promise.all([
          getMyHives(),
          getMyBatches(),
        ]);

        console.log("Hives from MongoDB:", hiveResult);
        console.log("Batches from MongoDB:", batchResult);

        setHives(hiveResult.data || []);
        setBatches(batchResult.data || []);
      } catch (error) {
        console.error(
          "Failed to load backend data:",
          error
        );
      }
    };

    loadBackendData();
  }, []);

  // ======================================================
  // TOASTS
  // ======================================================

  const addToast = (message, type = "success") => {
    const id = Date.now();

    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
      },
    ]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.filter((toast) => toast.id !== id)
      );
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) =>
      prev.filter((toast) => toast.id !== id)
    );
  };

  // ======================================================
  // CREATE BATCH
  // ======================================================

  const createBatch = async (batchData) => {
    try {
      console.log("Sending batch to backend:", batchData);

      const result = await createHoneyBatch(batchData);

      console.log(
        "Batch created successfully:",
        result
      );

      if (result.data) {
        setBatches((prev) => [
          result.data,
          ...prev,
        ]);
      }

      addToast(
        `Batch ${batchData.batchId} created successfully!`,
        "success"
      );

      return result.data;
    } catch (error) {
      console.error(
        "Failed to create batch:",
        error
      );

      addToast(
        error.message || "Failed to create batch.",
        "error"
      );

      throw error;
    }
  };

  // ======================================================
  // UPDATE BATCH
  // ======================================================

  const updateBatchStatus = (
    batchId,
    updates
  ) => {
    setBatches((prev) =>
      prev.map((batch) =>
        batch.batchId === batchId
          ? {
              ...batch,
              ...updates,
            }
          : batch
      )
    );
  };

  // ======================================================
  // ALERTS
  // ======================================================

  const resolveAlert = (alertId) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: "Resolved",
            }
          : alert
      )
    );

    addToast(
      "Alert marked as resolved.",
      "success"
    );
  };

  // ======================================================
  // LAB
  // ======================================================

  const addLabResult = (result) => {
    setLabResults((prev) => [
      result,
      ...prev,
    ]);

    addToast(
      "Test result saved successfully!",
      "success"
    );
  };

  // ======================================================
  // SCANNED PRODUCTS
  // ======================================================

  const addScannedProduct = (
    batchId,
    trustScore,
    status
  ) => {
    const exists = scannedHistory.find(
      (item) => item.batchId === batchId
    );

    if (!exists) {
      setScannedHistory((prev) => [
        {
          batchId,
          trustScore,
          status,
          scanDate:
            new Date()
              .toISOString()
              .split("T")[0],
        },
        ...prev,
      ]);
    }
  };

  // ======================================================
  // LOGIN
  // ======================================================

  const login = async (
    email,
    password
  ) => {
    const result = await loginUser(
      email,
      password
    );

    const user = result.data.user;
    const token = result.data.token;

    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    setCurrentUser(user);

    // Load fresh data immediately after login
    try {
      const [hiveResult, batchResult] =
        await Promise.all([
          getMyHives(),
          getMyBatches(),
        ]);

      setHives(
        hiveResult.data || []
      );

      setBatches(
        batchResult.data || []
      );
    } catch (error) {
      console.error(
        "Failed to load user data after login:",
        error
      );
    }

    return user;
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setCurrentUser(null);
    setHives([]);
    setBatches([]);
  };

  return (
    <AppContext.Provider
      value={{
        batches,
        setBatches,

        hives,
        setHives,

        alerts,
        setAlerts,

        labResults,
        shipments,

        currentUser,

        login,
        logout,

        toasts,
        addToast,
        removeToast,

        createBatch,
        updateBatchStatus,

        resolveAlert,
        addLabResult,

        scannedHistory,
        addScannedProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () =>
  useContext(AppContext);