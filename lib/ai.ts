/**
 * Core AI Utility for LinkNest using Google Gemini AI
 * Provides AI-powered bio generation and link suggestions.
 */

import { GoogleGenAI } from '@google/genai';

// Initialize the AI client lazily (only when needed)
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const DEFAULT_MODEL = 'gemini-2.0-flash';

export type AIResponse = {
  text: string;
  error?: string;
};

export async function generateContent(
  prompt: string,
  systemPrompt: string = 'You are a helpful assistant for LinkNest, a bio-link platform.',
  model: string = DEFAULT_MODEL
): Promise<AIResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not defined - AI features disabled');
    return { text: '', error: 'AI service is not configured. Please set GEMINI_API_KEY.' };
  }

  const ai = getAIClient();
  if (!ai) {
    return { text: '', error: 'Failed to initialize AI service' };
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    const text = response.text || '';
    return { text };
  } catch (error: any) {
    console.error('AI Generation Error:', error);

    // Handle specific error types
    if (error.message?.includes('quota')) {
      return { text: '', error: 'AI service quota exceeded. Please try again later.' };
    }
    if (error.message?.includes('rate limit') || error.status === 429) {
      return { text: '', error: 'Rate limit exceeded. Please wait a moment and try again.' };
    }
    if (error.status === 401 || error.status === 403) {
      return { text: '', error: 'AI service authentication failed. Please contact support.' };
    }

    return { text: '', error: error.message || 'Something went wrong with AI generation' };
  }
}

/**
 * Generate a compelling profile bio
 * @param name - User's display name
 * @param profession - User's profession/role
 * @param interests - User's interests or keywords
 * @returns Generated bio text (80-160 characters)
 */
export async function generateBio(
  name: string,
  profession?: string,
  interests?: string
): Promise<AIResponse> {
  const systemPrompt = `You are a professional social media manager and bio writer for LinkNest.
Your goal is to write a compelling, concise, and professional bio for creators, professionals, and businesses.
Use a modern, friendly tone. Avoid hashtags and emojis.
The bio must be between 80 and 160 characters. Return ONLY the bio text, nothing else.`;

  const userPrompt = `Write a professional bio for ${name}.
Profession: ${profession || 'Creator'}
Interests/Keywords: ${interests || 'Just starting out'}

Return only the bio text, between 80-160 characters.`;

  return generateContent(userPrompt, systemPrompt);
}

/**
 * Suggest relevant links based on user's niche and existing links
 * @param currentLinks - Array of existing link titles
 * @param niche - User's niche (creator, developer, designer, etc.)
 * @param bio - User's current bio
 * @returns Array of suggested links with title and suggestedUrl
 */
export async function suggestLinks(
  currentLinks: string[],
  niche?: string,
  bio?: string
): Promise<AIResponse> {
  const systemPrompt = `You are a professional profile optimizer for LinkNest.
Your goal is to suggest 3-5 high-conversion links for a user's profile based on their bio, niche, and identity.
Return ONLY a JSON array of objects with "title" and "suggestedUrl" fields.
Use realistic placeholder URLs (e.g., https://github.com/username for developers, https://dribbble.com/username for designers).
No conversational text, no markdown, just the raw JSON array.`;

  const userPrompt = `Niche: ${niche || 'General Creator'}
Bio: ${bio || 'Not provided'}
Existing Links: ${JSON.stringify(currentLinks)}

Suggest 3-5 new useful links for this profile that complement their existing links.
Return ONLY a JSON array, nothing else.`;

  return generateContent(userPrompt, systemPrompt);
}
