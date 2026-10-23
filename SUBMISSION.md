# ZENO — Hackathon Submission

## Team Details
- **Team Name:** ZENO
- **Track:** Education & Career AI — Personalized Tutoring & Adaptive Learning Challenge
- **Hackathon:** Ziro Digital Agentic AI Hackathon 2026

## Submission Links
- **GitHub Repository:** https://github.com/kamaleshramesh7275-cloud/zeno
- **Live Demo:** http://localhost:3000 (or deployed link)
- **Demo Video:** [Include your 3-5 min Loom or YouTube video link]

## Problem Statement
Students struggle with hallucination-prone generic chatbots that give incorrect, uncited answers detached from their actual course materials. ZENO solves this by building a **multi-step agentic AI tutor** that grounds every response in the student's specific uploaded course materials (textbooks, lecture slides, video transcripts) using a 7-step autonomous reasoning pipeline.

## Agentic Capability Evidence
ZENO is an **autonomous function-calling agent** that drives the entire pedagogical workflow:
1. **Gemini Function Calling Orchestrator:** Gemini autonomously chooses which tools to execute (`classify_intent`, `check_syllabus_scope`, `decompose_query`, `execute_retrieval`, `evaluate_response`, `refine_retrieval_query`, `synthesize_subtasks`, `update_bkt`).
2. **Autonomous Task Decomposition:** When a complex composite question is submitted (e.g. eigenvalue derivation AND SVD geometric meaning), the agent automatically decomposes it into independent sub-tasks, performs multi-angle retrieval, and synthesizes a unified master answer.
3. **Multi-Turn Reflection & Self-Evaluation Retry Loop:** After drafting an answer, the agent runs `evaluate_response` to critique its own faithfulness and citation completeness. If the score falls below threshold (< 0.85), it autonomously triggers `refine_retrieval_query`, enriches search terms, executes a 2nd retrieval attempt, and verifies grounding before presenting to the student.
4. **Bayesian Knowledge Tracing (BKT) Feedback:** The agent continuously tracks concept mastery $P(L)$ across interactions, adapting its pedagogy.
5. **Full Transparency:** Every step, tool invocation, iteration count, and critique is visible in the expandable **Agent Reasoning Trace** in the chat and live-streamed to the **Agent Execution Log** on the Evaluation Dashboard.

## Technical Stack
- React 19 + TypeScript 5.9 + Tailwind CSS v4 + Vite 7
- Google Gemini 2.0 Flash API (real LLM, with mock-RAG fallback)
- Bayesian Knowledge Tracing (custom BKT engine)
- RAGAS evaluation framework

## Setup Instructions
```bash
npm install
cp .env.example .env     # Add VITE_GEMINI_API_KEY
npm run dev
```
Demo login: `student@zeno.ai` / `zeno2026`

## Key Evidence Files
- `ARCHITECTURE.md` — Full agentic pipeline diagram + BKT math
- `EVALUATION_REPORT.md` — RAGAS benchmark results (94.2% Faithfulness)
- `DEMO_SCRIPT.md` — 5-minute demo video walkthrough
- `src/lib/tutorService.ts` — Core agentic pipeline implementation
- `src/lib/bkt.ts` — Bayesian Knowledge Tracing engine
