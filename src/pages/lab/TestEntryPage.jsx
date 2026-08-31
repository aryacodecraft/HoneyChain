import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AppLayout, Sidebar, TopNavbar, PageContent } from '../../components/layouts/Layout';
import { PageHeader, StatusBadge } from '../../components/common/SharedComponents';
import { labNavItems } from './LabDashboard';
import { FlaskConical } from 'lucide-react';

export default function TestEntryPage() {
  const { id } = useParams();
  const { batches, addLabResult, updateBatchStatus } = useApp();
  const navigate = useNavigate();

  const targetBatchId = id || batches[0]?.id || 'BH-2026-001';

  const [testType, setTestType] = useState('Moisture Content');
  const [parameter, setParameter] = useState('Water Activity');
  const [observedValue, setObservedValue] = useState('18.5%');
  const [expectedRange, setExpectedRange] = useState('<20%');
  const [result, setResult] = useState('Passed');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newResult = {
      id: `LR-${Date.now().toString().slice(-4)}`,
      batchId: targetBatchId,
      testType: testType,
      parameter: parameter,
      observedValue: observedValue,
      expectedRange: expectedRange,
      result: result,
      status: result,
      date: new Date().toISOString().split('T')[0],
      analyst: 'Dr. Anjali Singh',
      notes: notes || 'Standard laboratory assay completed.',
    };

    addLabResult(newResult);

    if (result === 'Failed') {
      updateBatchStatus(targetBatchId, { 
        labStatus: 'Failed',
        complianceStatus: 'Failed',
        status: 'Rejected',
        trustScore: 40,
        riskLevel: 'High'
      });
    } else {
      updateBatchStatus(targetBatchId, { 
        labStatus: 'Passed',
        complianceStatus: 'Passed'
      });
    }

    navigate('/lab/results');
  };

  return (
    <AppLayout sidebar={<Sidebar navItems={labNavItems} roleLabel="Lab / Regulator" roleColor="#7B1FA2" />}>
      <TopNavbar title="Laboratory Test Entry Form" subtitle="Log Official Spectrometry & Chemical Assays" />
      <PageContent>
        <PageHeader title={`Test Entry: ${targetBatchId}`} description="Record official lab findings for regulatory clearance" />

        <div className="card" style={{ padding: 28, maxWidth: 650 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Target Batch ID</label>
              <input className="input-field" value={targetBatchId} disabled style={{ background: '#FFF9E6', fontWeight: 700 }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Laboratory Assay Type</label>
              <select className="input-field" value={testType} onChange={e => setTestType(e.target.value)}>
                <option value="Moisture Content">Moisture Content (Refractometer)</option>
                <option value="Purity Test">Purity & C-4 Sugar Adulteration (NMR/IRMS)</option>
                <option value="HMF Level">Hydroxymethylfurfural (HMF Spectrophotometry)</option>
                <option value="Pesticide Screen">Pesticide & Heavy Metal Residue Screen</option>
                <option value="Pollen Profiling">Melissopalynology / Pollen Origin</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Chemical Parameter</label>
                <input className="input-field" value={parameter} onChange={e => setParameter(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Observed Value</label>
                <input className="input-field" value={observedValue} onChange={e => setObservedValue(e.target.value)} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Expected Standard Range</label>
                <input className="input-field" value={expectedRange} onChange={e => setExpectedRange(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Compliance Outcome</label>
                <select className="input-field" value={result} onChange={e => setResult(e.target.value)}>
                  <option value="Passed">PASSED — Complies with Standard</option>
                  <option value="Failed">FAILED — Non-Compliant / Contaminated</option>
                  <option value="Pending">PENDING — Requires Re-testing</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Analyst Notes & Certification</label>
              <textarea className="input-field" rows="3" placeholder="e.g. Moisture within Codex Alimentarius limits..." value={notes} onChange={e => setNotes(e.target.value)} />
            </div>

            <button type="submit" className="btn-primary" style={{ background: '#7B1FA2', color: 'white', width: '100%', justifyContent: 'center', padding: 12 }}>
              <FlaskConical size={18} /> Save & Signoff Test Result
            </button>
          </form>
        </div>
      </PageContent>
    </AppLayout>
  );
}
