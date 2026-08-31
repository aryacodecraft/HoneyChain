import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastNotification } from './components/common/SharedComponents';

// Common Pages
import LoginPage from './pages/common/LoginPage';
import RolesPage from './pages/common/RolesPage';
import ProfilePage from './pages/common/ProfilePage';

// Beekeeper Pages
import BKDashboard from './pages/beekeeper/BKDashboard';
import HiveDetails from './pages/beekeeper/HiveDetails';
import InsightsPage from './pages/beekeeper/InsightsPage';
import AlertsPage from './pages/beekeeper/AlertsPage';
import CreateBatchPage from './pages/beekeeper/CreateBatchPage';
import BatchHistoryPage from './pages/beekeeper/BatchHistoryPage';

// Processor Pages
import ProcDashboard from './pages/processor/ProcDashboard';
import VerifyBatchPage from './pages/processor/VerifyBatchPage';
import BatchDetailsPage from './pages/processor/BatchDetailsPage';
import ActivityPage from './pages/processor/ActivityPage';
import ProcessingHistoryPage from './pages/processor/ProcessingHistoryPage';
import ProcAlertsPage from './pages/processor/ProcAlertsPage';
import DecisionPage from './pages/processor/DecisionPage';

// Distributor Pages
import DistDashboard from './pages/distributor/DistDashboard';
import ShipmentTrackingPage from './pages/distributor/ShipmentTrackingPage';
import DistBatchDetails from './pages/distributor/DistBatchDetails';
import IntegrityCheckPage from './pages/distributor/IntegrityCheckPage';
import DistAlertsPage from './pages/distributor/DistAlertsPage';

// Lab Pages
import LabDashboard from './pages/lab/LabDashboard';
import SuspiciousBatchesPage from './pages/lab/SuspiciousBatchesPage';
import BatchAnalysisPage from './pages/lab/BatchAnalysisPage';
import TestEntryPage from './pages/lab/TestEntryPage';
import ResultsPage from './pages/lab/ResultsPage';
import CompliancePage from './pages/lab/CompliancePage';
import ReportsPage from './pages/lab/ReportsPage';

// Consumer Pages
import ConsumerHome from './pages/consumer/ConsumerHome';
import ScanPage from './pages/consumer/ScanPage';
import ProductDetailsPage from './pages/consumer/ProductDetailsPage';
import ConsumerHistory from './pages/consumer/ConsumerHistory';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ToastNotification />
        <Routes>
          {/* Default */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Beekeeper */}
          <Route path="/beekeeper/dashboard" element={<BKDashboard />} />
          <Route path="/beekeeper/hive/:id" element={<HiveDetails />} />
          <Route path="/beekeeper/insights" element={<InsightsPage />} />
          <Route path="/beekeeper/alerts" element={<AlertsPage />} />
          <Route path="/beekeeper/create-batch" element={<CreateBatchPage />} />
          <Route path="/beekeeper/batch-history" element={<BatchHistoryPage />} />

          {/* Processor */}
          <Route path="/processor/dashboard" element={<ProcDashboard />} />
          <Route path="/processor/verify-batch" element={<VerifyBatchPage />} />
          <Route path="/processor/batch/:id" element={<BatchDetailsPage />} />
          <Route path="/processor/activity" element={<ActivityPage />} />
          <Route path="/processor/history" element={<ProcessingHistoryPage />} />
          <Route path="/processor/alerts" element={<ProcAlertsPage />} />
          <Route path="/processor/decision/:id" element={<DecisionPage />} />

          {/* Distributor */}
          <Route path="/distributor/dashboard" element={<DistDashboard />} />
          <Route path="/distributor/shipment-tracking" element={<ShipmentTrackingPage />} />
          <Route path="/distributor/batch/:id" element={<DistBatchDetails />} />
          <Route path="/distributor/integrity-check" element={<IntegrityCheckPage />} />
          <Route path="/distributor/alerts" element={<DistAlertsPage />} />

          {/* Lab */}
          <Route path="/lab/dashboard" element={<LabDashboard />} />
          <Route path="/lab/suspicious-batches" element={<SuspiciousBatchesPage />} />
          <Route path="/lab/batch-analysis/:id" element={<BatchAnalysisPage />} />
          <Route path="/lab/test-entry/:id" element={<TestEntryPage />} />
          <Route path="/lab/results" element={<ResultsPage />} />
          <Route path="/lab/compliance" element={<CompliancePage />} />
          <Route path="/lab/reports" element={<ReportsPage />} />

          {/* Consumer */}
          <Route path="/consumer/home" element={<ConsumerHome />} />
          <Route path="/consumer/scan" element={<ScanPage />} />
          <Route path="/consumer/product/:batchId" element={<ProductDetailsPage />} />
          <Route path="/consumer/history" element={<ConsumerHistory />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
