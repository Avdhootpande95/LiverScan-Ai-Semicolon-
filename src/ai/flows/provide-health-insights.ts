'use server';

/**
 * @fileOverview A health insights AI agent that analyzes CT scan and blood report data to provide potential health issues,
 * suggest lifestyle improvements, and advise on when to consult a specialist.
 *
 * - provideHealthInsights - A function that handles the health insights process.
 * - HealthInsightsInput - The input type for the provideHealthInsights function.
 * - HealthInsightsOutput - The return type for the provideHealthInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthInsightsInputSchema = z.object({
  ctScanAnalysis: z.string().describe('The analysis results from the CT scan.'),
  bloodReportAnalysis: z.string().describe('The analysis results from the blood report, including identified abnormal values.'),
});
export type HealthInsightsInput = z.infer<typeof HealthInsightsInputSchema>;

const HealthInsightsOutputSchema = z.object({
  potentialHealthIssues: z.string().describe('Potential health issues based on the combined analysis.'),
  lifestyleImprovements: z.string().describe('Suggested lifestyle improvements (diet, exercise, etc.).'),
  whenToConsultSpecialist: z.string().describe('Advice on when to consult a specialist (hepatologist, oncologist, etc.).'),
});
export type HealthInsightsOutput = z.infer<typeof HealthInsightsOutputSchema>;

export async function provideHealthInsights(input: HealthInsightsInput): Promise<HealthInsightsOutput> {
  return provideHealthInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideHealthInsightsPrompt',
  input: {schema: HealthInsightsInputSchema},
  output: {schema: HealthInsightsOutputSchema},
  prompt: `You are an AI assistant specializing in providing health insights based on medical data.

You will receive analysis results from a CT scan and a blood report. Based on this information, you will identify potential health issues, suggest lifestyle improvements, and advise on when to consult a specialist.

CT Scan Analysis: {{{ctScanAnalysis}}}
Blood Report Analysis: {{{bloodReportAnalysis}}}

Based on the information, provide a concise summary of potential health issues, lifestyle improvements, and when to consult a specialist.  Make sure to clearly state that this is AI-assisted and not medical advice.
`,
});

const provideHealthInsightsFlow = ai.defineFlow(
  {
    name: 'provideHealthInsightsFlow',
    inputSchema: HealthInsightsInputSchema,
    outputSchema: HealthInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
