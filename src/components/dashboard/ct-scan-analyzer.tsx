'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FileScan, Upload, X } from 'lucide-react';
import { useDashboard } from './dashboard-provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MedicalDisclaimer } from '@/components/common/medical-disclaimer';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { CTScanResult, CTScanClassification } from '@/lib/types';
import { cn } from '@/lib/utils';

export function CtScanAnalyzer() {
  const {
    ctScanResult,
    setCtScanResult,
    analysisStates,
    setAnalysisState,
    bloodReport,
  } = useDashboard();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const scanImagePlaceholder = PlaceHolderImages.find(p => p.id === 'liver-scan');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setCtScanResult(null);
      setAnalysisState('ct', 'idle');
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreviewUrl(null);
    setCtScanResult(null);
    setAnalysisState('ct', 'idle');
  };

  const handleAnalyze = () => {
    if (!file) return;

    setAnalysisState('ct', 'loading');
    // Simulate AI analysis with improved logic
    setTimeout(() => {
      const abnormalBloodValues = bloodReport?.filter((r) => r.status === 'Abnormal').length || 0;
      const isBloodNormal = bloodReport ? abnormalBloodValues === 0 : false;
      
      let classification: CTScanClassification;
      let confidence: number;

      const randomFactor = Math.random();

      // Start with a base classification
      if (randomFactor > 0.5) {
        classification = 'No tumor detected';
        confidence = Math.random() * (99 - 90) + 90;
      } else if (randomFactor > 0.2) {
        classification = 'Possible benign tumor';
        confidence = Math.random() * (95 - 80) + 80;
      } else {
        classification = 'Possible malignant tumor';
        confidence = Math.random() * (98 - 75) + 75;
      }

      // Logic refinement based on user requirements
      if (classification === 'Possible malignant tumor') {
        if (bloodReport && isBloodNormal) {
          // Ambiguous imaging with normal bloods -> downgrade to uncertain
          classification = 'Uncertain / Needs Review';
          confidence = Math.min(confidence, 75);
        } else if (bloodReport && abnormalBloodValues < 3) {
          // Few abnormal values -> might be uncertain
           if(Math.random() > 0.5) {
                classification = 'Uncertain / Needs Review';
                confidence = Math.random() * (80-65) + 65;
           }
        } else if (!bloodReport) {
            // No blood report -> cannot be sure about malignancy
            classification = 'Uncertain / Needs Review';
            confidence = Math.random() * (80 - 60) + 60;
        }
      }

      // Add a chance for "Uncertain" for other cases to simulate ambiguity
      if (classification !== 'No tumor detected' && Math.random() > 0.8) {
        classification = 'Uncertain / Needs Review';
        confidence = Math.random() * (70 - 50) + 50;
      }

      const result: CTScanResult = {
        classification: classification,
        confidence: confidence,
        heatmapUrl: '/heatmap.png',
      };
      setCtScanResult(result);
      setAnalysisState('ct', 'success');
    }, 2000);
  };

  const getBadgeVariant = (classification: CTScanClassification) => {
    switch (classification) {
      case 'No tumor detected':
        return 'default';
      case 'Possible benign tumor':
        return 'secondary';
      case 'Possible malignant tumor':
        return 'destructive';
      case 'Uncertain / Needs Review':
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileScan className="h-6 w-6" />
          <CardTitle className="font-headline">CT Scan Analysis</CardTitle>
        </div>
        <CardDescription>
          Upload a liver CT scan image (PNG, JPG) for AI-powered analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!previewUrl && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted bg-accent/20 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Drag & drop your file here or click to upload
            </p>
            <Button
              size="sm"
              className="relative"
            >
              Upload File
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </Button>
          </div>
        )}

        {previewUrl && (
           <div className="space-y-4">
             <div className="relative w-full overflow-hidden rounded-lg border aspect-video">
               <Image
                 src={previewUrl}
                 alt="CT Scan Preview"
                 layout="fill"
                 objectFit="contain"
               />
               {(ctScanResult?.classification === 'Possible malignant tumor' ||
                  ctScanResult?.classification === 'Uncertain / Needs Review') &&
                  analysisStates.ct === 'success' && (
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-1/2 w-1/2 rounded-full bg-red-500/30 blur-2xl animate-pulse" data-ai-hint="suspicious area"></div>
                 </div>
               )}
             </div>
             <div className="flex items-center gap-2">
              <Button onClick={handleAnalyze} disabled={analysisStates.ct === 'loading' || !!ctScanResult}>
                {analysisStates.ct === 'loading' ? 'Analyzing...' : 'Analyze Scan'}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleClear}>
                <X className="h-4 w-4" />
                <span className="sr-only">Clear</span>
              </Button>
            </div>
           </div>
        )}

        {analysisStates.ct === 'loading' && <AnalysisSkeleton />}
        
        {analysisStates.ct === 'success' && ctScanResult && (
          <div className="mt-4 space-y-4 rounded-lg border bg-background p-4">
             <h3 className="font-headline text-lg">Analysis Complete</h3>
             <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Classification</p>
                    <Badge variant={getBadgeVariant(ctScanResult.classification)}>{ctScanResult.classification}</Badge>
                </div>
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Confidence</p>
                    <p className="text-xl font-bold">{ctScanResult.confidence.toFixed(2)}%</p>
                </div>
             </div>
             <p className="text-xs text-muted-foreground">The highlighted area indicates regions the AI found potentially anomalous.</p>
            <MedicalDisclaimer />
          </div>
        )}

        {!ctScanResult && !previewUrl && scanImagePlaceholder && (
          <div className="mt-4 opacity-50">
             <div className="relative w-full overflow-hidden rounded-lg border aspect-video">
               <Image
                 src={scanImagePlaceholder.imageUrl}
                 alt="CT Scan Example"
                 layout="fill"
                 objectFit="cover"
                 data-ai-hint={scanImagePlaceholder.imageHint}
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                 <p className="text-white text-sm font-semibold">Example CT Scan [Drag and drop to check it]</p>
               </div>
             </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="mt-4 space-y-4 rounded-lg border bg-card p-4">
      <Skeleton className="h-8 w-1/2" />
      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-8 w-3/4" />
        </div>
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
    </div>
  );
}
