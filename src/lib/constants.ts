export type BloodTestKey =
  | 'AFP'
  | 'ALT'
  | 'AST'
  | 'BilirubinTotal'
  | 'BilirubinDirect'
  | 'BilirubinIndirect'
  | 'ALP'
  | 'GGT'
  | 'TotalProtein'
  | 'Albumin'
  | 'Globulin'
  | 'AGRatio'
  | 'WBC'
  | 'RBC'
  | 'Hemoglobin'
  | 'Hematocrit';

export type BloodTest = {
  name: string;
  unit: string;
  range: { low: number; high: number };
};

export const BLOOD_TESTS: Record<BloodTestKey, BloodTest> = {
  AFP: {
    name: 'Alpha-fetoprotein',
    unit: 'ng/mL',
    range: { low: 0, high: 10 },
  },
  ALT: {
    name: 'Alanine Aminotransferase (SGPT)',
    unit: 'U/L',
    range: { low: 7, high: 56 },
  },
  AST: {
    name: 'Aspartate Aminotransferase (SGOT)',
    unit: 'U/L',
    range: { low: 10, high: 40 },
  },
  BilirubinTotal: {
    name: 'Bilirubin – Total',
    unit: 'mg/dL',
    range: { low: 0.1, high: 1.2 },
  },
  BilirubinDirect: {
    name: 'Bilirubin – Direct',
    unit: 'mg/dL',
    range: { low: 0.0, high: 0.3 },
  },
  BilirubinIndirect: {
    name: 'Bilirubin – Indirect',
    unit: 'mg/dL',
    range: { low: 0.2, high: 0.8 },
  },
  ALP: {
    name: 'Alkaline Phosphatase',
    unit: 'IU/L',
    range: { low: 44, high: 147 },
  },
  GGT: {
    name: 'Gamma-Glutamyl Transferase',
    unit: 'IU/L',
    range: { low: 0, high: 30 },
  },
  TotalProtein: {
    name: 'Total Proteins',
    unit: 'g/dL',
    range: { low: 6.0, high: 8.3 },
  },
  Albumin: {
    name: 'Serum Albumin',
    unit: 'g/dL',
    range: { low: 3.5, high: 5.5 },
  },
  Globulin: {
    name: 'Serum Globulin',
    unit: 'g/dL',
    range: { low: 2.0, high: 3.5 },
  },
  AGRatio: {
    name: 'A/G Ratio',
    unit: '',
    range: { low: 1.1, high: 2.5 },
  },
  WBC: {
    name: 'White Blood Cell Count',
    unit: 'x10^9/L',
    range: { low: 4.5, high: 11.0 },
  },
  RBC: {
    name: 'Red Blood Cell Count',
    unit: 'x10^12/L',
    range: { low: 4.2, high: 5.9 },
  },
  Hemoglobin: {
    name: 'Hemoglobin',
    unit: 'g/dL',
    range: { low: 13.5, high: 17.5 },
  },
  Hematocrit: {
    name: 'Hematocrit',
    unit: '%',
    range: { low: 41, high: 53 },
  },
};
