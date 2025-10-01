# Logistics Integration Co‑pilot

Generate production‑ready logistics platform integration code (Python & Node) with structured AI assistance.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Supported Platforms](#supported-platforms)
4. [Architecture](#architecture)
5. [Tech Stack](#tech-stack)
6. [Quick Start](#quick-start)
7. [Environment Variables](#environment-variables)
8. [Integration Credentials](#integration-credentials)
9. [How Code Generation Works](#how-code-generation-works)
10. [Prompting Tips](#prompting-tips)
11. [Security & Privacy](#security--privacy)
12. [Project Structure](#project-structure)
13. [Common Tasks](#common-tasks)
14. [Troubleshooting](#troubleshooting)
15. [Roadmap](#roadmap)
16. [Contributing](#contributing)
17. [License](#license)

---

## Overview

Logistics Integration Co‑pilot is an interactive UI that helps developers rapidly produce API integration scaffolding for commerce, fulfillment, shipping, payment, and marketplace systems. You describe what you need (e.g., "Fetch yesterday's paid Shopify orders and transform them into WMS JSON"), select the target platform, optionally supply platform credentials (stored locally), and receive:

- Executable Python (requests) code
- Executable Node.js (axios / ESM) code
- Realistic sample response data
- Next‑step guidance / deployment notes

The assistant optimizes for clarity, practical authentication patterns, pagination handling hints, and mapping considerations.

---

## Features

- Multi‑platform integration focus (Shopify, WMS, Amazon Seller Central, Stripe, etc.)
- AI‑driven structured output (JSON schema enforcement & validation)
- Dual language generation (Python + Node) per request
- Generated sample data for parsing & mapping tests
- Copy‑friendly code blocks with minimal deps
- Local persistence of credential values (no server storage)
- Dynamic credential form per selected platform
- Conversation context refinement
- Model key UI removed for production hardening

---

## Supported Platforms

Defined in `types.ts` and credential specs in `integrationFields.ts`:

| Platform | Example Use Case |
|----------|------------------|
| Shopify | Orders, Products, Customers exports |
| Generic WMS | Inbound/outbound shipment orchestration |
| Magento | Catalog + order sync |
| BigCommerce | Order ingestion + inventory updates |
| Amazon Seller Central | SP-API order + listings integration |
| Etsy API | Handmade catalog ingestion |
| Square API | POS order normalization |
| WooCommerce | Storefront order & product sync |
| ShipStation | Shipping label & fulfillment event capture |
| Stripe | Payment events & reconciliation |

> Add more: extend the `ApiType` enum and `PLATFORM_FIELD_SETS`.

---

## Architecture

| Layer | Responsibility |
|-------|----------------|
| React UI (`components/`) | Chat interface, code display, sidebar configuration |
| State (`App.tsx`) | Conversation, loading/error states, integration config persistence |
| AI Service (`services/geminiService.ts`) | Prompt assembly, model selection, JSON parsing, fallback handling |
| Credential Spec (`integrationFields.ts`) | Declarative platform field definitions |
| Constants (`constants.ts`) | Logo path, model fallback list |

Sequence (Generation Path):

1. User enters request + selects platform
2. App builds a minimal history context
3. `generateIntegrationCode()` crafts structured prompt including credentials (if provided) and platform intent
4. Gemini model returns text → JSON extraction + validation
5. UI renders Python / Node code + sample data + next steps

---

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS (CDN; can be migrated to PostCSS build)
- Gemini 2.5 models (Flash/Pro fallback logic internal)

---

## Quick Start

Prerequisites: Node.js 18+ (recommended), npm or pnpm.

```bash
npm install
cp .env.example .env        # if example provided; else create manually
# Add VITE_GEMINI_API_KEY=... only if running a local dev build that still expects a client key
npm run dev
```

Open: <http://localhost:5173>

> Production deployments should proxy AI calls server‑side to avoid exposing API keys. The current UI has had key input removed for production alignment.

---

## Environment Variables

| Name | Purpose | Client Exposed | Notes |
|------|---------|----------------|-------|
| VITE_GEMINI_API_KEY | Optional for local dev direct model access | Yes | Remove for production; prefer backend proxy |
| GEMINI_API_KEY | Server-only variant (proxy usage) | No | Not directly used in current client build |

If deploying publicly: prefer a backend function/edge proxy instead of shipping any model key to the browser.

---

## Integration Credentials

Stored locally in `localStorage` under key: `integration_config_v1`. Keys follow pattern:

```text
<Platform Label>:<fieldId> => value
```

You can clear them by clearing site data. They are inserted into prompts to reduce hallucination and promote accurate auth scaffolding.

### Adding a New Platform

1. Add enum entry in `ApiType` (in `types.ts`).
2. Add spec array in `PLATFORM_FIELD_SETS` within `integrationFields.ts`.
3. (Optional) Extend prompt logic with platform‑specific instructions.

---

## How Code Generation Works

1. Heuristic classification decides if the user wants integration code vs general chat.
2. Structured prompt enforces JSON response with fields:
   - `pythonCode`
   - `nodeCode`
   - `sampleData`
   - `nextSteps`
3. Post‑processing isolates the first `{ ... }` block, parses JSON, validates mandatory keys, and normalizes `sampleData`.
4. UI differentiates string vs structured integration responses.

Error Modes:

- Missing required JSON keys → user-friendly error message
- Model access failure → surfaced in chat thread and `ErrorDisplay`
- Malformed JSON → raw snippet truncated + error explanation

---

## Prompting Tips

Better Requests → Better Code. Try:

- “Generate code to pull all paid Shopify orders since midnight UTC and map line items to a WMS order schema.”
- “Add retry logic with exponential backoff for rate-limited order fetches.”
- “Show how to page through Amazon SP-API getOrders and aggregate into a single array.”
- “Include comments explaining each authentication header.”

Follow‑ups can say: “Refactor Python to use sessions and timeouts” or “Add product variant handling to the Node script.”

---

## Security & Privacy

- No credentials are sent to any backend controlled by this project: only to the model provider as part of the prompt (if you enter real values). Use placeholders if sensitive.
- For production: implement a proxy layer (Express/Edge Function) to hold the Gemini key server‑side.
- Remove `VITE_GEMINI_API_KEY` from client builds; verify no key is exposed in network dev tools.
- Consider redaction middleware for sensitive token patterns.

Hardening Ideas:

- Rate limit generation requests.
- Add server audit log (platform + timestamp, no raw credentials).
- Implement secrets vault for multi-user deployments.

---

## Project Structure

```text
.
├── App.tsx                # Root component / state orchestration
├── components/            # UI components (chat, sidebar, code blocks)
├── services/geminiService.ts  # AI integration logic & parsing
├── integrationFields.ts   # Declarative credential field metadata
├── constants.ts           # Shared constants (logo, models)
├── types.ts               # TypeScript types & enums
├── public/                # Static assets (logo, images)
└── vite.config.ts         # Vite build config
```

---

## Common Tasks

Add a platform: edit `types.ts` + `integrationFields.ts`.
Change logo: replace `/public/images/FIQ-logo.webp`.
Adjust model list: modify `GEMINI_MODELS` in `constants.ts`.
Add custom credential validation: extend `Sidebar` to show warnings.

---

## Troubleshooting

| Issue | Cause | Resolution |
|-------|-------|------------|
| Empty / generic response | Heuristic didn’t detect integration intent | Include words like “integration”, “API”, “code” |
| Missing fields in output | Model drifted from schema | Re‑ask: “Return valid JSON with pythonCode, nodeCode, sampleData, nextSteps only.” |
| Credentials not used | Fields left blank or placeholders | Ensure values are present in sidebar form |
| Visible API key in prod | Client build shipped with `VITE_GEMINI_API_KEY` | Move to server proxy, rebuild |

---

## Roadmap

- [ ] Backend proxy for secure model key usage
- [ ] Streaming token responses
- [ ] Test harness for JSON schema conformance
- [ ] Expanded platform library (eBay, NetSuite, SAP B1)
- [ ] Credential validation (light linting)
- [ ] Exportable integration “recipes”
- [ ] Dark/light theme toggle
- [ ] Offline prompt simulation (no model call)

---

## Contributing

1. Fork & branch (`feat/<topic>`)
2. Add/adjust components or platform metadata
3. Run lint/type check (add tooling if desired)
4. Open PR with context + screenshots for UI changes

---

## License

Proprietary (default). Add an OSS license (e.g., MIT/Apache-2.0) if you intend public reuse.

---

## Attribution / Notes

- Gemini model usage subject to provider terms.
- Sample data is synthetic; validate against live sandbox endpoints before production.

---

> Need a backend proxy scaffold or CI pipeline example? Open an issue or request an enhancement.
