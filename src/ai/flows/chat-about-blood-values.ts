'use server';

/**
 * @fileOverview A chatbot flow to answer user questions about their blood report.
 *
 * - chatAboutBloodValues - A function to handle the chat interaction.
 * - ChatAboutBloodValuesInput - The input type for the chatAboutBloodValues function.
 * - ChatAboutBloodValuesOutput - The return type for the chatAboutBloodValues function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const BloodReportResultSchema = z.object({
  test: z.string(),
  value: z.number(),
  unit: z.string(),
  range: z.string(),
  status: z.enum(['Normal', 'Borderline', 'Abnormal']),
});

const ChatAboutBloodValuesInputSchema = z.object({
  bloodReport: z.array(BloodReportResultSchema).nullable().describe('The full blood report data.'),
  question: z.string().describe("The user's question about their blood report or for remedies."),
});
export type ChatAboutBloodValuesInput = z.infer<typeof ChatAboutBloodValuesInputSchema>;

const ChatAboutBloodValuesOutputSchema = z.object({
  reply: z.string().describe("The AI's response to the user's question."),
});
export type ChatAboutBloodValuesOutput = z.infer<typeof ChatAboutBloodValuesOutputSchema>;

export async function chatAboutBloodValues(
  input: ChatAboutBloodValuesInput
): Promise<ChatAboutBloodValuesOutput> {
  return chatAboutBloodValuesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatAboutBloodValuesPrompt',
  input: { schema: ChatAboutBloodValuesInputSchema },
  output: { schema: ChatAboutBloodValuesOutputSchema },
  prompt: `You are a helpful and cautious AI health assistant. You are chatting with a user about their health.
  
Your primary goal is to provide general, helpful information based on the user's question and their blood report, but you MUST NOT provide medical advice, diagnoses, or prescribe remedies.

ALWAYS include a disclaimer to consult a healthcare professional for any medical advice or treatment.

Use simple, non-technical language. Be empathetic and supportive.

User's blood report:
{{#if bloodReport}}
{{#each bloodReport}}
- {{this.test}}: {{this.value}} {{this.unit}} (Status: {{this.status}})
{{/each}}
{{else}}
No blood report provided.
{{/if}}

User's question: "{{{question}}}"

Based on this, answer the user's question. If they ask for remedies, suggest general healthy lifestyle changes (like a balanced diet, regular exercise) and strongly advise them to speak with a doctor before making any changes or trying new remedies.`,
});

const chatAboutBloodValuesFlow = ai.defineFlow({
  name: 'chatAboutBloodValuesFlow',
  inputSchema: ChatAboutBloodValuesInputSchema,
  outputSchema: ChatAboutBloodValuesOutputSchema,
}, async (input) => {
  const { output } = await prompt(input);
  return output!;
});
