'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TestTube,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FlaskConical,
} from 'lucide-react';

import { useDashboard } from './dashboard-provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BLOOD_TESTS, BloodTest, BloodTestKey } from '@/lib/constants';
import type { BloodReport } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { explainAbnormalValues } from '@/ai/flows/explain-abnormal-values';
import { useToast } from '@/hooks/use-toast';
import { MedicalDisclaimer } from '../common/medical-disclaimer';

const formSchema = z.object({
  AFP: z.coerce.number().optional(),
  ALT: z.coerce.number().optional(),
  AST: z.coerce.number().optional(),
  BilirubinTotal: z.coerce.number().optional(),
  BilirubinDirect: z.coerce.number().optional(),
  BilirubinIndirect: z.coerce.number().optional(),
  ALP: z.coerce.number().optional(),
  GGT: z.coerce.number().optional(),
  TotalProtein: z.coerce.number().optional(),
  Albumin: z.coerce.number().optional(),
  Globulin: z.coerce.number().optional(),
  AGRatio: z.coerce.number().optional(),
  WBC: z.coerce.number().optional(),
  RBC: z.coerce.number().optional(),
  Hemoglobin: z.coerce.number().optional(),
  Hematocrit: z.coerce.number().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function BloodReportAnalyzer() {
  const { bloodReport, setBloodReport, analysisStates, setAnalysisState } = useDashboard();
  const { toast } = useToast();
  const [explanation, setExplanation] = useState('');
  const [isExplanationLoading, setIsExplanationLoading] = useState(false);
  const { control, handleSubmit, getValues } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    setAnalysisState('blood', 'loading');
    setTimeout(() => {
      const results: BloodReport = Object.entries(data)
        .filter(([, value]) => value !== undefined && value !== null && !isNaN(value))
        .map(([key, value]) => {
          const testInfo = BLOOD_TESTS[key as BloodTestKey];
          let status: 'Normal' | 'Borderline' | 'Abnormal' = 'Normal';
          if (value < testInfo.range.low || value > testInfo.range.high) {
            status = 'Abnormal';
          }
          return {
            test: key as BloodTestKey,
            value: value as number,
            unit: testInfo.unit,
            status,
            range: `${testInfo.range.low} - ${testInfo.range.high}`,
          };
        });

      setBloodReport(results);
      setAnalysisState('blood', 'success');
      setExplanation('');
    }, 1500);
  };

  const getAbnormalValues = () => {
    return bloodReport?.filter((r) => r.status === 'Abnormal').map((r) => `${r.test} (${BLOOD_TESTS[r.test].name})`) || [];
  };

  const handleExplain = async () => {
    const abnormalValues = getAbnormalValues();
    setIsExplanationLoading(true);
    try {
      const result = await explainAbnormalValues({ abnormalValues });
      setExplanation(result.explanation);
    } catch (error) {
      console.error('Error explaining abnormal values:', error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Could not get explanation. Please try again.',
      });
    } finally {
      setIsExplanationLoading(false);
    }
  };

  const StatusIcon = ({ status }: { status: 'Normal' | 'Borderline' | 'Abnormal' }) => {
    switch (status) {
      case 'Normal':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'Borderline':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'Abnormal':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  const abnormalValuesExist = getAbnormalValues().length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TestTube className="h-6 w-6" />
          <CardTitle className="font-headline">Blood Report Analysis</CardTitle>
        </div>
        <CardDescription>
          Manually enter key values from your blood report for analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {analysisStates.blood !== 'success' && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ScrollArea className="h-[250px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(BLOOD_TESTS).map((key) => {
                  const testInfo = BLOOD_TESTS[key as BloodTestKey] as BloodTest;
                  return (
                    <div key={key} className="grid gap-2">
                      <Label htmlFor={key}>{testInfo.name} ({testInfo.unit})</Label>
                      <Controller
                        name={key as BloodTestKey}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id={key}
                            type="number"
                            step="any"
                            placeholder={`e.g. ${testInfo.range.low}`}
                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.value)}
                          />
                        )}
                      />
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <Button type="submit" className="mt-4" disabled={analysisStates.blood === 'loading'}>
              {analysisStates.blood === 'loading' ? 'Analyzing...' : 'Analyze Report'}
            </Button>
          </form>
        )}

        {analysisStates.blood === 'loading' && <AnalysisSkeleton />}
        
        {analysisStates.blood === 'success' && bloodReport && (
          <div className="space-y-4">
            <h3 className="font-headline text-lg">Analysis Results</h3>
            <ScrollArea className="h-[250px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Reference Range</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bloodReport.map((result) => (
                    <TableRow key={result.test}>
                      <TableCell className="font-medium">{BLOOD_TESTS[result.test].name}</TableCell>
                      <TableCell>{result.value} {result.unit}</TableCell>
                      <TableCell>{result.range} {result.unit}</TableCell>
                      <TableCell>
                        <Badge variant={result.status === 'Abnormal' ? 'destructive' : 'secondary'} className='flex items-center gap-1'>
                          <StatusIcon status={result.status} />
                          {result.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!explanation) handleExplain();
                    }}
                    disabled={isExplanationLoading}
                  >
                    <FlaskConical className="mr-2 h-4 w-4" />
                    {isExplanationLoading ? 'Generating...' : 'Get AI Explanation'}
                  </Button>
                </AccordionTrigger>
                <AccordionContent>
                  {isExplanationLoading && <Skeleton className="h-24 w-full" />}
                  {explanation && (
                      <div className="prose prose-sm dark:prose-invert max-w-none text-foreground whitespace-pre-wrap rounded-md border p-4 bg-muted/50">
                        <p>{explanation}</p>
                      </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <MedicalDisclaimer />

            <Button variant="outline" onClick={() => setAnalysisState('blood', 'idle')}>
              Analyze New Report
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


function AnalysisSkeleton() {
  return (
    <div className="mt-4 space-y-4">
      <Skeleton className="h-8 w-1/3 mb-4" />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
