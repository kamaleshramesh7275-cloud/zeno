# ZENO Demonstration Video Script (3–5 Minutes)
**Track D: Personalized Tutoring & Adaptive Learning Challenge**

---

## Video Outline & Speaking Points

### Segment 1: Problem & Ingestion Workflow (0:00 - 1:15)
- **Screen:** Open Knowledge Hub (`/app/knowledge`).
- **Narration:**
  > *"Students typically struggle with course materials scattered across textbooks, lecture slide decks, and YouTube video playlists. Generic AI chatbots fail because they give hallucinated, uncited answers detached from the course syllabus.
  >
  > Introducing ZENO: the course-grounded multimodal AI study companion. Here in the Knowledge Hub, we ingest textbook PDFs, slide decks, and video lectures. Notice how every unit is deeply linked to exact textbook pages, slide numbers, and video timestamps (like 14:35 or 04:12), complete with extracted diagrams."*
- **Action:** Click on a unit to preview the deep anchor modal showing the textbook page and video timestamp.

---

### Segment 2: Autonomous Agent Tutor & Reasoning Trace (1:15 - 2:30)
- **Screen:** Navigate to AI Tutor (`/app/tutor`).
- **Narration:**
  > *"ZENO is powered by an autonomous multi-turn agentic orchestrator. Let's demonstrate this with a complex multi-part query: 'Explain why det(A-lambda*I)=0 AND how SVD relates to eigenvalues'.
  >
  > Notice what happens: ZENO autonomously calls `decompose_query` to break the composite prompt into two discrete sub-tasks. It plans retrieval, searches the multimodal knowledge base, and drafts a response.
  >
  > Crucially, ZENO doesn't just stop there — it executes a **Self-Evaluation Reflection Loop**. When the agent critiques its own draft for citation coverage, if confidence is below 85%, it automatically calls `refine_retrieval_query`, re-retrieves with enriched mathematical constraints, and verifies grounding before final synthesis!
  >
  > Let's expand the **Agent Reasoning Trace** below the message: here judges can inspect all tool calls, latency, reflection verdict, and BKT posterior updates in real time.
  >
  > Now, let's test our academic scope gate with an adversarial out-of-syllabus query: 'What is the recipe for chocolate cake?' The scope tool immediately declines, transparently notifying the student that the query is outside the MIT 18.06 course boundaries."*
- **Action:** Click the "Multi-Part Query" prompt, expand the Agent Reasoning Trace to show tool calls and retry loops, click citation badges, then click "Test Refusal" prompt.

---

### Segment 3: Adaptive Assessment & Misconception Diagnostics (2:30 - 3:45)
- **Screen:** Navigate to Adaptive Assessment (`/app/assessment`).
- **Narration:**
  > *"Under Adaptive Assessment, students can generate targeted quizzes or diagnostic mock exams across MCQ, numerical, and conceptual problems. Every question is verified and tagged with Bloom's taxonomy.
  >
  > When answering, ZENO provides cited feedback and detects conceptual misconceptions. Upon finishing, the Post-Assessment Diagnostic Report highlights weak topics and common errors."*
- **Action:** Answer a question, submit to see immediate feedback, click "Next Question", and complete exam to showcase the Diagnostic Report.

---

### Segment 4: Mathematical Learner Model & Evaluation Suite (3:45 - 4:45)
- **Screen:** Navigate to Mastery & Flow Map (`/app/mastery`) then Evaluation Suite (`/app/evaluation`).
- **Narration:**
  > *"ZENO models student cognition using Bayesian Knowledge Tracing (BKT), updating prior probability P(L_t) dynamically with every response. The interactive Course Flow Map visualizes prerequisite dependencies in a directed graph. New students can take our Cold-Start Diagnostic to calibrate their baseline.
  >
  > Finally, in our Evaluation Suite, we rigorously report RAGAS metrics: 94.2% Faithfulness, 91.8% Answer Relevancy, and 100% Refusal Precision. Multi-session simulated student curves prove consistent mastery gains and a question repetition rate below 1.8%."*
- **Action:** Point out the DAG node map, then flip to the RAGAS metrics table and student persona simulation.

---

### Segment 5: Conclusion & Pitch (4:45 - 5:00)
- **Narration:**
  > *"ZENO combines multimodal grounding, rigorous cognitive modeling, and standardized RAG evaluation to deliver the next generation of personalized tutoring. Thank you!"*
