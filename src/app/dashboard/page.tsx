'use client';

import { CtScanAnalyzer } from '@/components/dashboard/ct-scan-analyzer';
import { BloodReportAnalyzer } from '@/components/dashboard/blood-report-analyzer';
import { HealthInsights } from '@/components/dashboard/health-insights';
import { useDashboard } from '@/components/dashboard/dashboard-provider';

export default function DashboardPage() {
  const { ctScanResult, bloodReport, analysisStates } = useDashboard();
  const insightsAvailable = ctScanResult && bloodReport;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-3">
          <CtScanAnalyzer />
        </div>
        <div className="lg:col-span-4">
          <BloodReportAnalyzer />
        </div>
      </div>
      {(insightsAvailable || analysisStates.insights === 'loading') && (
        <div className="grid gap-4">
          <HealthInsights />
        </div>
      )}
    </>
  );
}
