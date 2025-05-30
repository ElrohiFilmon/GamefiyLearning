'use server';

/**
 * @fileOverview AI flow to suggest personalized challenges based on user's weak areas.
 *
 * - suggestPersonalizedChallenges - A function that suggests personalized challenges.
 * - SuggestPersonalizedChallengesInput - The input type for the suggestPersonalizedChallenges function.
 * - SuggestPersonalizedChallengesOutput - The return type for the suggestPersonalizedChallenges function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPersonalizedChallengesInputSchema = z.object({
  userSkills: z
    .array(z.string())
    .describe('A list of the user skills and proficiencies.'),
  weakAreas: z
    .array(z.string())
    .describe('A list of the user weak areas that need improvement.'),
  numberOfSuggestions: z
    .number()
    .default(3)
    .describe('The number of challenge suggestions to provide.'),
});
export type SuggestPersonalizedChallengesInput = z.infer<
  typeof SuggestPersonalizedChallengesInputSchema
>;

const SuggestPersonalizedChallengesOutputSchema = z.object({
  challenges: z.array(z.string()).describe('A list of personalized challenge suggestions.'),
});
export type SuggestPersonalizedChallengesOutput = z.infer<
  typeof SuggestPersonalizedChallengesOutputSchema
>;

export async function suggestPersonalizedChallenges(
  input: SuggestPersonalizedChallengesInput
): Promise<SuggestPersonalizedChallengesOutput> {
  return suggestPersonalizedChallengesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPersonalizedChallengesPrompt',
  input: {schema: SuggestPersonalizedChallengesInputSchema},
  output: {schema: SuggestPersonalizedChallengesOutputSchema},
  prompt: `You are an AI assistant designed to suggest personalized challenges to help users improve their skills.

  Based on the user's weak areas and current skills, suggest {{numberOfSuggestions}} challenges that would help them improve.

  User Skills:
  {{#if userSkills}}
  {{#each userSkills}}
  - {{this}}
  {{/each}}
  {{else}}
  No skills listed.
  {{/if}}

  Weak Areas:
  {{#if weakAreas}}
  {{#each weakAreas}}
  - {{this}}
  {{/each}}
  {{else}}
  No weak areas listed.
  {{/if}}

  Challenges:
  `,
});

const suggestPersonalizedChallengesFlow = ai.defineFlow(
  {
    name: 'suggestPersonalizedChallengesFlow',
    inputSchema: SuggestPersonalizedChallengesInputSchema,
    outputSchema: SuggestPersonalizedChallengesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
