import { NextResponse } from 'next/server';
import { suggestLinks } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { name, bio, currentLinks = [], niche } = await req.json();

    if (!bio) {
      return NextResponse.json({ error: 'Bio is required to suggest links' }, { status: 400 });
    }

    const result = await suggestLinks(currentLinks, niche, bio);

    if (result.error) {
      const status = result.error.includes('rate limit') ? 429 : 500;
      return NextResponse.json({ error: result.error }, { status });
    }

    // Attempt to parse JSON from the response (sometimes AI wraps in ```json ... ```)
    let suggestedLinks = [];
    try {
      const jsonStr = result.text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .replace(/\\n/g, '')
        .trim();
      suggestedLinks = JSON.parse(jsonStr);

      // Validate the parsed data is an array
      if (!Array.isArray(suggestedLinks)) {
        throw new Error('Response is not an array');
      }

      // Validate each link has required fields
      suggestedLinks = suggestedLinks
        .filter((link: any) => link.title && link.suggestedUrl)
        .slice(0, 5); // Max 5 suggestions
    } catch (e) {
      console.error('Failed to parse links JSON:', e);
      console.error('Raw AI response:', result.text);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return NextResponse.json({ suggestions: suggestedLinks });
  } catch (error) {
    console.error('Links API Error:', error);
    return NextResponse.json({ error: 'Failed to generate link suggestions' }, { status: 500 });
  }
}
