/**
 * Groq AI Service - Free, fast AI for digest generation
 * Works perfectly in serverless environments like Vercel
 */

import Groq from 'groq-sdk';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile'; // Fast and free

// Initialize Groq client
const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

if (!GROQ_API_KEY && typeof window === 'undefined') {
    console.warn('⚠️ GROQ_API_KEY not set. AI digest generation will be disabled.');
    console.log('💡 Get your free API key at: https://console.groq.com/');
}

interface GroqResponse {
    success: boolean;
    content?: string;
    model?: string;
    error?: string;
}

/**
 * Check if Groq AI is available
 */
export async function checkOllamaHealth(): Promise<boolean> {
    return groq !== null && GROQ_API_KEY !== '';
}

/**
 * Get list of available Groq models
 */
export async function listModels(): Promise<string[]> {
    if (!groq) return [];
    
    return [
        'llama-3.3-70b-versatile',
        'llama-3.1-8b-instant'
    ];
}

/**
 * Generate AI digest from stories using Groq
 */
export async function generateDigest(
    stories: { title: string; content?: string; source: string }[],
    model?: string
): Promise<GroqResponse> {
    if (!groq) {
        return {
            success: false,
            error: 'Groq AI not configured. Add GROQ_API_KEY environment variable. Get free key at: https://console.groq.com/'
        };
    }

    try {
        const selectedModel = model || DEFAULT_MODEL;

        // Build prompt with story summaries (limit context size)
        const storySummaries = stories
            .slice(0, 15)
            .map((s, i) => {
                const snippet = (s.content || '').replace(/<[^>]*>/g, '').slice(0, 150);
                return `${i + 1}. [${s.source}] ${s.title}${snippet ? '\n   ' + snippet + '...' : ''}`;
            })
            .join('\n\n');

        const prompt = `You are a professional news editor creating a concise daily briefing.

Today's stories from subscribed RSS feeds:

${storySummaries}

Create a brief daily digest with:
1. **Executive Summary** (2-3 sentences)
2. **Top Headlines** (3-5 bullet points)
3. **Worth Watching** (1-2 emerging trends)

Be concise and professional. Use markdown formatting.`;

        console.log('🤖 Generating digest with Groq:', selectedModel);
        
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: selectedModel,
            temperature: 0.7,
            max_tokens: 1000,
        });

        const content = completion.choices[0]?.message?.content || '';
        
        if (!content) {
            return {
                success: false,
                error: 'No content generated'
            };
        }

        console.log('✅ Digest generated successfully');

        return {
            success: true,
            content,
            model: selectedModel,
        };
    } catch (error: any) {
        console.error('❌ Groq error:', error);
        
        if (error.status === 401) {
            return {
                success: false,
                error: 'Invalid Groq API key. Get a free key at: https://console.groq.com/'
            };
        }
        
        if (error.status === 429) {
            return {
                success: false,
                error: 'Rate limit exceeded. Please try again in a moment.'
            };
        }

        return {
            success: false,
            error: error.message || 'Failed to generate digest'
        };
    }
}
