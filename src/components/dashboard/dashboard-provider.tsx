"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { BloodReport, CTScanResult } from '@/lib/types';

type AnalysisState = 'idle' | 'loading' | 'success' | 'error';

interface DashboardContextType {
  ctScanResult: CTScanResult | null;
  setCtScanResult: React.Dispatch<React.SetStateAction<CTScanResult | null>>;
  bloodReport: BloodReport | null;
  setBloodReport: React.Dispatch<React.SetStateAction<BloodReport | null>>;
  analysisStates: {
    ct: AnalysisState;
    blood: AnalysisState;
    insights: AnalysisState;
  };
  setAnalysisState: (
    type: 'ct' | 'blood' | 'insights',
    state: AnalysisState
  ) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [ctScanResult, setCtScanResult] = useState<CTScanResult | null>(null);
  const [bloodReport, setBloodReport] = useState<BloodReport | null>(null);
  const [analysisStates, setAnalysisStates] = useState({
    ct: 'idle' as AnalysisState,
    blood: 'idle' as AnalysisState,
    insights: 'idle' as AnalysisState,
  });

  const setAnalysisState = (
    type: 'ct' | 'blood' | 'insights',
    state: AnalysisState
  ) => {
    setAnalysisStates((prev) => ({ ...prev, [type]: state }));
  };

  return (
    <DashboardContext.Provider
      value={{
        ctScanResult,
        setCtScanResult,
        bloodReport,
        setBloodReport,
        analysisStates,
        setAnalysisState,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
