
'use server';

/**
 * @fileOverview AI-powered code explanation flow.
 *
 * - explainCode - A function that accepts a code snippet and returns an explanation.
 * - ExplainCodeInput - The input type for the explainCode function.
 * - ExplainCodeOutput - The return type for the explainCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainCodeInputSchema = z.object({
  code: z.string().describe('The code snippet to be explained.'),
  programmingLanguage: z.string().optional().describe('The programming language of the code snippet.'),
});
export type ExplainCodeInput = z.infer<typeof ExplainCodeInputSchema>;

const ExplainCodeOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the code snippet.'),
});
export type ExplainCodeOutput = z.infer<typeof ExplainCodeOutputSchema>;

export async function explainCode(input: ExplainCodeInput): Promise<ExplainCodeOutput> {
  return explainCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainCodePrompt',
  input: {schema: ExplainCodeInputSchema},
  output: {schema: ExplainCodeOutputSchema},
  prompt: `You are an expert programming tutor. Your task is to explain the given code snippet in a way that is easy to understand for learners.

  Here is the code snippet:
  \`\`\`{{#if programmingLanguage}}{{programmingLanguage}}{{/if}}
  {{{code}}}
  \`\`\`

  Provide a clear and concise explanation of what the code does, including the purpose of each part and how they work together. Focus on clarity and simplicity.
  `,
});

const explainCodeFlow = ai.defineFlow(
  {
    name: 'explainCodeFlow',
    inputSchema: ExplainCodeInputSchema,
    outputSchema: ExplainCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
