/**
 * Ollama Service - Connects to local Ollama instance
 * Production-ready with model detection and comprehensive error handling
 * Gracefully degrades when Ollama is not available (e.g., in serverless)
 */

const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_VERCEL = process.env.VERCEL === '1';

// Warn if Ollama is expected but not configured properly
if (IS_PRODUCTION && IS_VERCEL && typeof window === 'undefined') {
    console.warn('⚠️ Ollama is not available in Vercel serverless environment. Digest generation will be disabled.');
}

interface OllamaModel {
    name: string;
    size: number;
    modified_at: string;
}

interface OllamaGenerateResponse {
    model: string;
    response: string;
    done: boolean;
    total_duration?: number;
}

/**
 * Check if Ollama server is running
 * Returns false in serverless environments
 */
export async function checkOllamaHealth(): Promise<boolean> {
    // Ollama doesn't work in serverless environments
    if (IS_VERCEL) {
        console.log('ℹ️ Ollama health check skipped (serverless environment)');
        return false;
    }

    try {
        const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
            method: 'GET',
            signal: AbortSignal.timeout(5000),
        });
        return res.ok;
    } catch (error) {
        console.log('ℹ️ Ollama not available:', error instanceof Error ? error.message : 'Unknown error');
        return false;
    }
}

/**
 * Get list of available models from Ollama
 */
export async function listModels(): Promise<string[]> {
    try {
        const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
            signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.models?.map((m: OllamaModel) => m.name) || [];
    } catch {
        return [];
    }
}

/**
 * Get the best available model, preferring smaller/faster models for summarization
 */
export async function getBestAvailableModel(): Promise<string | null> {
    const models = await listModels();
    if (models.length === 0) return null;

    // Preferred models in order (smaller/faster first for quick summaries)
    const preferredModels = [
        'llama3.2',
        'llama3.2:1b',
        'llama3.2:3b',
        'llama3.1',
        'llama3.1:8b',
        'llama3',
        'mistral',
        'mistral:7b',
        'gemma2',
        'gemma2:2b',
        'gemma',
        'phi3',
        'qwen2',
    ];

    for (const preferred of preferredModels) {
        const found = models.find(m => m.toLowerCase().startsWith(preferred.toLowerCase()));
        if (found) return found;
    }

    // Return first available model if no preferred match
    return models[0];
}

/**
 * Generate a daily digest from story summaries
 */
export async function generateDigest(
    stories: { title: string; content?: string | null; source: string }[],
    model?: string
): Promise<{ success: boolean; content?: string; error?: string; model?: string }> {

    // Auto-detect model if not specified
    const selectedModel = model || await getBestAvailableModel();

    if (!selectedModel) {
        return {
            success: false,
            error: 'No models available. Install one with: ollama pull llama3.2:1b'
        };
    }

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

    try {
        const res = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: selectedModel,
                prompt,
                stream: false,
                options: {
                    temperature: 0.7,
                    num_predict: 800, // Shorter for faster response
                },
            }),
            signal: AbortSignal.timeout(90000), // 90 second timeout
        });

        if (!res.ok) {
            const errorText = await res.text();
            // Parse Ollama error format
            try {
                const errorJson = JSON.parse(errorText);
                if (errorJson.error?.includes('not found')) {
                    return {
                        success: false,
                        error: `Model "${selectedModel}" not found. Run: ollama pull ${selectedModel}`
                    };
                }
                return { success: false, error: errorJson.error || 'Ollama request failed' };
            } catch {
                return { success: false, error: `Ollama error: ${errorText.slice(0, 100)}` };
            }
        }

        const data: OllamaGenerateResponse = await res.json();
        return {
            success: true,
            content: data.response,
            model: data.model,
        };
    } catch (error: any) {
        if (error.name === 'TimeoutError' || error.name === 'AbortError') {
            return { success: false, error: 'Request timed out. The model may still be loading.' };
        }
        if (error.cause?.code === 'ECONNREFUSED') {
            return { success: false, error: 'Cannot connect to Ollama. Run: ollama serve' };
        }
        return { success: false, error: error.message || 'Failed to generate digest' };
    }
}
