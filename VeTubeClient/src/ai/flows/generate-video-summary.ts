'use server';
/**
 * @fileOverview A video summary generator AI agent.
 *
 * - generateVideoSummary - A function that handles the video summary generation process.
 * - GenerateVideoSummaryInput - The input type for the generateVideoSummary function.
 * - GenerateVideoSummaryOutput - The return type for the generateVideoSummary function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateVideoSummaryInputSchema = z.object({
  videoTitle: z.string().describe('The title of the video.'),
  videoDescription: z.string().describe('The description of the video.'),
  videoTranscription: z.string().describe('The transcription of the video.'),
});
export type GenerateVideoSummaryInput = z.infer<typeof GenerateVideoSummaryInputSchema>;

const GenerateVideoSummaryOutputSchema = z.object({
  summary: z.string().describe('The summary of the video.'),
});
export type GenerateVideoSummaryOutput = z.infer<typeof GenerateVideoSummaryOutputSchema>;

export async function generateVideoSummary(input: GenerateVideoSummaryInput): Promise<GenerateVideoSummaryOutput> {
  return generateVideoSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVideoSummaryPrompt',
  input: {
    schema: z.object({
      videoTitle: z.string().describe('The title of the video.'),
      videoDescription: z.string().describe('The description of the video.'),
      videoTranscription: z.string().describe('The transcription of the video.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('The summary of the video.'),
    }),
  },
  prompt: `You are an expert video summarizer. You will be given the title, description, and transcription of a video, and you will generate a summary of the video.

Title: {{{videoTitle}}}
Description: {{{videoDescription}}}
Transcription: {{{videoTranscription}}}

Summary: `,
});

const generateVideoSummaryFlow = ai.defineFlow<
  typeof GenerateVideoSummaryInputSchema,
  typeof GenerateVideoSummaryOutputSchema
>({
  name: 'generateVideoSummaryFlow',
  inputSchema: GenerateVideoSummaryInputSchema,
  outputSchema: GenerateVideoSummaryOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
