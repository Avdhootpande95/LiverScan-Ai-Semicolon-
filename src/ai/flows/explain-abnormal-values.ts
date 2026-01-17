'use server';

/**
 * @fileOverview Explains abnormal blood report values, potential indications, and associated diseases.
 *
 * - explainAbnormalValues - A function that handles the explanation process.
 * - ExplainAbnormalValuesInput - The input type for the explainAbnormalValues function.
 * - ExplainAbnormalValuesOutput - The return type for the explainAbnormalValues function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainAbnormalValuesInputSchema = z.object({
  abnormalValues: z
    .array(z.string())
    .describe('An array of abnormal blood report values.'),
});
export type ExplainAbnormalValuesInput = z.infer<
  typeof ExplainAbnormalValuesInputSchema
>;

const ExplainAbnormalValuesOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      'An explanation of the abnormal blood report values, potential indications, and possible associated diseases.'
    ),
});
export type ExplainAbnormalValuesOutput = z.infer<
  typeof ExplainAbnormalValuesOutputSchema
>;

export async function explainAbnormalValues(
  input: ExplainAbnormalValuesInput
): Promise<ExplainAbnormalValuesOutput> {
  return explainAbnormalValuesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainAbnormalValuesPrompt',
  input: {schema: ExplainAbnormalValuesInputSchema},
  output: {schema: ExplainAbnormalValuesOutputSchema},
  prompt: `You are an AI assistant explaining blood report results to a patient in simple, non-technical language. Keep explanations to 1-3 sentences.

- If there are no abnormal values, be reassuring. Example: "All your liver function tests are within the normal range. This is a great sign that your liver is working well!"
- If there are abnormal values, briefly explain what it might suggest in simple terms. Always end by advising a consultation with a doctor. Example for high bilirubin: "Your bilirubin level is elevated. This can sometimes indicate liver stress or other issues. It's best to discuss this with your doctor to find out the cause."

Explain these abnormal values: {{#if abnormalValues.length}}{{#each abnormalValues}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}.
Your goal is to inform, not to diagnose.`,
});

const explainAbnormalValuesFlow = ai.defineFlow(
  {
    name: 'explainAbnormalValuesFlow',
    inputSchema: ExplainAbnormalValuesInputSchema,
    outputSchema: ExplainAbnormalValuesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
