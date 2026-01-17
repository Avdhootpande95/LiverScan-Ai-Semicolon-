import type { BloodTestKey } from "./constants";

export type CTScanClassification =
  | 'No tumor detected'
  | 'Possible benign tumor'
  | 'Possible malignant tumor'
  | 'Uncertain / Needs Review';

export interface CTScanResult {
  classification: CTScanClassification;
  confidence: number;
  heatmapUrl: string; // Mock URL, simulated with CSS
}

export type BloodReportResult = {
  test: BloodTestKey;
  value: number;
  unit: string;
  range: string;
  status: 'Normal' | 'Borderline' | 'Abnormal';
}

export type BloodReport = BloodReportResult[];
