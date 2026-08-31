import React, { createContext, useContext, useState } from 'react';
import { batches as initialBatches, alerts as initialAlerts, hives as initialHives, labResults as initialLabResults, shipments as initialShipments } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [batches, setBatches] = useState(initialBatches);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [hives] = useState(initialHives);
  const [labResults, setLabResults] = useState(initialLabResults);
  const [shipments] = useState(initialShipments);
  const [currentUser, setCurrentUser] = useState(null);
  const [scannedHistory, setScannedHistory] = useState([
    { batchId: 'BH-2026-001', status: 'Delivered', trustScore: 92, scanDate: '2026-08-26' },
  ]);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const createBatch = (newBatch) => {
    setBatches(prev => [newBatch, ...prev]);
    addToast(`Batch ${newBatch.id} created successfully!`, 'success');
  };

  const updateBatchStatus = (batchId, updates) => {
    setBatches(prev => prev.map(b => b.id === batchId ? { ...b, ...updates } : b));
  };

  const resolveAlert = (alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Resolved' } : a));
    addToast('Alert marked as resolved.', 'success');
  };

  const addLabResult = (result) => {
    setLabResults(prev => [result, ...prev]);
    addToast('Test result saved successfully!', 'success');
  };

  const addScannedProduct = (batchId, trustScore, status) => {
    const exists = scannedHistory.find(s => s.batchId === batchId);
    if (!exists) {
      setScannedHistory(prev => [{ batchId, trustScore, status, scanDate: new Date().toISOString().split('T')[0] }, ...prev]);
    }
  };

  const login = (role) => {
    const users = {
      beekeeper: { name: 'Rohan Mehta', email: 'rohan@beehoney.in', role: 'Beekeeper', avatar: 'RM' },
      processor: { name: 'Swati Patel', email: 'swati@beehoney.in', role: 'Processor', avatar: 'SP' },
      distributor: { name: 'Manoj Logistics', email: 'manoj@beehoney.in', role: 'Distributor', avatar: 'ML' },
      lab: { name: 'Dr. Anjali Singh', email: 'anjali@beehoney.in', role: 'Lab / Regulator', avatar: 'AS' },
      consumer: { name: 'Priya Sharma', email: 'priya@gmail.com', role: 'Consumer', avatar: 'PS' },
    };
    setCurrentUser(users[role]);
  };

  const logout = () => setCurrentUser(null);

  return (
    <AppContext.Provider value={{
      batches, setBatches, hives, alerts, setAlerts, labResults, shipments,
      currentUser, login, logout, toasts, addToast, removeToast,
      createBatch, updateBatchStatus, resolveAlert, addLabResult,
      scannedHistory, addScannedProduct,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
