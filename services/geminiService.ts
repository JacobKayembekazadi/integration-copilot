// Switched to official public SDK for stability.
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_MODELS } from '../constants';
import type { IntegrationResult } from '../types';

// Fallback resolution cache to avoid repeated failing requests
let resolvedModel: string | null = null;

const resolveModel = async (apiKey: string, preferred?: string): Promise<string> => {
    if (preferred) {
        const ok = await probeModel(apiKey, preferred);
        if (ok) { resolvedModel = preferred; return preferred; }
    }
    if (resolvedModel) return resolvedModel;
    for (const m of GEMINI_MODELS) {
        const ok = await probeModel(apiKey, m);
        if (ok) { resolvedModel = m; return m; }
    }
    throw new Error('No available Gemini model from fallback list.');
};

const probeModel = async (apiKey: string, model: string): Promise<boolean> => {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}?key=${encodeURIComponent(apiKey)}`;
        const r = await fetch(url, { method: 'GET' });
        if (r.ok) return true;
        if (r.status === 404) return false; // try next
        // For non-404 errors (like 400 invalid key) propagate so we don't mask key issues
        const txt = await r.text();
        throw new Error(`Model probe error (${model}): ${r.status} ${txt}`);
    } catch (e) {
        if (/404/.test(String(e))) return false;
        throw e;
    }
};

const getModel = (apiKey: string, modelName: string) => {
    const client = new GoogleGenerativeAI(apiKey);
    return client.getGenerativeModel({ model: modelName });
};

// Simple heuristic based classification instead of extra model round-trip (reduces cost + latency)
const looksLikeIntegration = (text: string) => /integrat|code|snippet|example|api|oauth|token|webhook/i.test(text);

// (Removed remote classification call to avoid failing when key invalid; using local heuristic now.)

export const generateIntegrationCode = async (
    prompt: string,
    history: { role: 'user' | 'model'; content: string }[],
    apiKey: string,
    apiType: string,
    preferredModel?: string,
    integrationConfig?: Record<string, string>
): Promise<IntegrationResult | string> => {
    // Prefer user-entered key; optionally allow a build-time fallback (Vite style env vars)
            // Try Vite-exposed vars first (must be prefixed with VITE_), then manual define injection, then legacy.
            const fallbackEnvKey = (import.meta as any).env?.VITE_GEMINI_API_KEY
                || (import.meta as any).env?.VITE_API_KEY
                || (typeof process !== 'undefined' ? (process as any).env?.GEMINI_API_KEY : undefined);
        const sanitizeKey = (k?: string) => {
            if (!k) return k;
            return k.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
        };
        const effectiveKey = sanitizeKey(apiKey) || sanitizeKey(fallbackEnvKey);

            if (!effectiveKey) {
            return 'No API key detected. Add it in the sidebar or define VITE_GEMINI_API_KEY in your .env file (restart dev server after adding).';
        }

        // Light sanity check (length/prefix) without leaking the full key.
            if (!/^AI(z|Z)a/.test(effectiveKey.slice(0,5)) && effectiveKey.length < 30) {
                console.warn('[Gemini] API key looks unusually short or malformed. Length:', effectiveKey.length);
            }
            console.info('[Gemini] Using API key (masked):', effectiveKey.slice(0,6) + '...' + effectiveKey.slice(-4));

        let modelName: string;
        try {
            modelName = await resolveModel(effectiveKey, preferredModel);
        } catch (e) {
            if (e instanceof Error && /No available Gemini model/.test(e.message)) {
                return 'No accessible Gemini model found with this API key. Confirm the key has access to public Gemini models (Gemini 1.5 Flash or Pro).';
            }
            throw e;
        }
        const model = getModel(effectiveKey, modelName);
        const conversationContext = history
            .map(h => `${h.role.toUpperCase()}: ${typeof h.content === 'string' ? h.content : '[structured response]'}`)
            .join('\n');

        const integrationRequested = looksLikeIntegration(prompt) || looksLikeIntegration(conversationContext);

        if (!integrationRequested) {
            // Generic answer path
            try {
                const res = await model.generateContent(conversationContext + '\nUSER: ' + prompt + '\nAssistant:');
                return res.response.text();
            } catch (err: any) {
                throw new Error('Chat request failed: ' + (err?.message || 'unknown error'));
            }
        }

        // Extract platform specific credentials (keys prefixed with ApiType:fieldId)
        const platformPrefix = apiType + ':';
        const platformCreds: Record<string,string> = {};
        if (integrationConfig) {
            for (const [k,v] of Object.entries(integrationConfig)) {
                if (k.startsWith(platformPrefix) && v) {
                    platformCreds[k.substring(platformPrefix.length)] = v;
                }
            }
        }
        const credsList = Object.entries(platformCreds).map(([k,v]) => `${k}=${v}`).join('; ');
        const credentialsContext = credsList ? `Known platform credentials (use directly in code, do NOT fabricate): ${credsList}` : 'No explicit platform credentials provided.';

        const fullPrompt = `You are an expert in logistics API integrations. Generate a JSON object ONLY with keys: 
        pythonCode (string), nodeCode (string), sampleData (object), nextSteps (string).
    Rules:
     - pythonCode: full runnable script using requests.
     - nodeCode: full runnable script using axios (CommonJS or ESM OK, prefer Node 18+ ESM).
     - If AI model key is provided do NOT leak it; instead only embed integration/platform credentials.
     - Provided integration/platform credentials: ${credentialsContext}.
     - sampleData: realistic example response for ${apiType}.
     - nextSteps: markdown bullet list with setup instructions.
    Return ONLY raw JSON. No markdown fences.
    Conversation so far (for context):\n${conversationContext}\nUSER_REQUEST: ${prompt}`;

    try {
            const response = await model.generateContent(fullPrompt);
            let text = response.response.text();

            // Try to isolate JSON if model adds commentary
            const firstBrace = text.indexOf('{');
            const lastBrace = text.lastIndexOf('}');
            if (firstBrace > 0 && lastBrace > firstBrace) {
                text = text.slice(firstBrace, lastBrace + 1);
            }
            let parsed: any;
            try {
                parsed = JSON.parse(text);
            } catch (e) {
                throw new Error('Failed to parse model JSON. Raw output: ' + text.substring(0, 400));
            }
            if (!parsed.pythonCode || !parsed.nodeCode) {
                throw new Error('Model JSON missing required code fields.');
            }
            if (parsed.sampleData && typeof parsed.sampleData === 'string') {
                try { parsed.sampleData = JSON.parse(parsed.sampleData); } catch {/* leave as string */}
            }
            return parsed as IntegrationResult;
    } catch (e) {
        console.error('Error generating integration code:', e);
        if (e instanceof Error) {
            throw new Error(`Failed to generate integration code from AI. Possible invalid response format or API error: ${e.message}`);
        }
        throw new Error('An unknown error occurred while communicating with the AI.');
    }
};

// Lightweight key validation helper for UI (does a trivial model call)
export const validateGeminiApiKey = async (apiKey: string): Promise<{ ok: boolean; message: string }> => {
    if (!apiKey) {
        return { ok: false, message: 'No key provided' };
    }
    try {
        const modelName = await resolveModel(apiKey.trim());
        const model = getModel(apiKey.trim(), modelName);
        const response = await model.generateContent('Return ONLY the single word OK');
        const txt = response.response.text()?.trim().toUpperCase();
        if (txt?.includes('OK')) {
            return { ok: true, message: `Key is valid. Using model: ${modelName}` };
        }
        return { ok: true, message: `Key responded (model: ${modelName}) but unexpected content (still likely valid).` };
    } catch (e: any) {
        const raw = typeof e?.message === 'string' ? e.message : 'Unknown error';
        if (/API key not valid|API_KEY_INVALID/i.test(raw) || /401|403/.test(raw)) {
            return { ok: false, message: 'API key rejected by Gemini API (API_KEY_INVALID). Ensure you created a Gemini API key (not another Google API) and that it has no incompatible restrictions.' };
        }
        return { ok: false, message: 'Validation failed: ' + raw };
    }
};

// Raw diagnostic call: fetch model metadata directly to expose service error JSON.
export const debugGeminiApiKey = async (apiKey: string): Promise<{ ok: boolean; status: number; body: any }> => {
    const key = apiKey.trim();
    const modelName = resolvedModel || GEMINI_MODELS[0];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}?key=${encodeURIComponent(key)}`;
    try {
        const resp = await fetch(url, { method: 'GET' });
        const text = await resp.text();
        let body: any = text;
        try { body = JSON.parse(text); } catch {/* leave raw */}
        return { ok: resp.ok, status: resp.status, body };
    } catch (e: any) {
        return { ok: false, status: -1, body: e?.message || 'Network/unknown error' };
    }
};