'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, Bot, Activity, Utensils, UserCheck } from 'lucide-react';
import { useDashboard } from './dashboard-provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { provideHealthInsights } from '@/ai/flows/provide-health-insights';
import type { HealthInsightsOutput } from '@/ai/flows/provide-health-insights';
import { useToast } from '@/hooks/use-toast';
import { MedicalDisclaimer } from '../common/medical-disclaimer';

export function HealthInsights() {
  const {
    ctScanResult,
    bloodReport,
    analysisStates,
    setAnalysisState,
  } = useDashboard();
  const { toast } = useToast();
  const [insights, setInsights] = useState<HealthInsightsOutput | null>(null);

  const handleGenerateInsights = async () => {
    if (!ctScanResult || !bloodReport) return;

    setAnalysisState('insights', 'loading');
    setInsights(null);

    const bloodReportAnalysis = `Abnormal values found: ${
      bloodReport.filter((r) => r.status === 'Abnormal').map((r) => r.test).join(', ') || 'None'
    }.`;

    try {
      const result = await provideHealthInsights({
        ctScanAnalysis: `CT scan shows: ${ctScanResult.classification} with ${ctScanResult.confidence.toFixed(2)}% confidence.`,
        bloodReportAnalysis: bloodReportAnalysis,
      });
      setInsights(result);
      setAnalysisState('insights', 'success');
    } catch (error) {
      console.error('Error providing health insights:', error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Could not generate health insights. Please try again.',
      });
      setAnalysisState('insights', 'error');
    }
  };
  
  useEffect(() => {
    // Auto-trigger insights generation when both analyses are complete
    if (analysisStates.ct === 'success' && analysisStates.blood === 'success' && analysisStates.insights === 'idle') {
      handleGenerateInsights();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisStates]);


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6" />
          <CardTitle className="font-headline">AI Health Insights</CardTitle>
        </div>
        <CardDescription>
          Combined analysis of your CT scan and blood report for holistic guidance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {analysisStates.insights === 'loading' && <InsightsSkeleton />}

        {analysisStates.insights === 'success' && insights && (
          <Accordion type="multiple" defaultValue={['issues', 'lifestyle']} className="w-full">
            <AccordionItem value="issues">
              <AccordionTrigger className="font-headline text-lg">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5" /> Potential Health Issues
                </div>
              </AccordionTrigger>
              <AccordionContent className="prose prose-sm dark:prose-invert max-w-none text-foreground whitespace-pre-wrap pt-2">
                {insights.potentialHealthIssues}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="lifestyle">
              <AccordionTrigger className="font-headline text-lg">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5" /> Lifestyle Improvements
                </div>
              </AccordionTrigger>
              <AccordionContent className="prose prose-sm dark:prose-invert max-w-none text-foreground whitespace-pre-wrap pt-2">
                {insights.lifestyleImprovements}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="specialist">
              <AccordionTrigger className="font-headline text-lg">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" /> When to Consult a Specialist
                </div>
              </AccordionTrigger>
              <AccordionContent className="prose prose-sm dark:prose-invert max-w-none text-foreground whitespace-pre-wrap pt-2">
                {insights.whenToConsultSpecialist}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {insights && <MedicalDisclaimer />}
      </CardContent>
    </Card>
  );
}

function InsightsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}
