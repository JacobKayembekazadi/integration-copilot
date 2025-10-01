// Global constants
// Path to the main application logo (served from Vite public folder)
// NOTE: File actually present in public/images is FIQ-logo.webp (case-sensitive on some hosts)
export const LOGO_SRC = '/images/FIQ-logo.webp';
export const APP_TITLE = 'Integration Co-pilot';
// Ordered model fallback list (first available will be used)
// Gemini 2.5 only (as requested). Order is fallback priority.
export const GEMINI_MODELS = [
	'gemini-2.5-flash',
	'gemini-2.5-pro'
];
