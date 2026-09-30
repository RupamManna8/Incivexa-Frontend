# Management Dashboard

This is the control plane UI for the Autonomous Incident Response Platform. It displays a real-time WebSocket-driven timeline of active incidents, telemetry logs, agent reasoning traces, and manual control overrides.

## Key Views
1. **Live Incident Feed:** Real-time stream of incoming incidents displaying current triage statuses, confidence metrics, and active remediation processes.
2. **Incident Details & Causality Graph:** Centered visualization of the service dependency graph with highlight paths trace, log events, and dry-run outputs.
3. **Agent Auditing Console:** A dedicated panel to audit LLM reasoning steps, queries, tools used, and matching evidence.
4. **Project Settings & DSN Provisioning:** Self-serve panel to create/revoke project tokens and adjust rate limits.

## Tech Stack
- **Framework:** React + Vite
- **Styling:** Vanilla CSS (TailwindCSS / custom utility tokens)
- **State/Stream:** WebSocket client + local reducer state
