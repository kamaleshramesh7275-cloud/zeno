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

### Segment 2: Source-Grounded AI Tutor Chat (1:15 - 2:30)
- **Screen:** Navigate to AI Tutor (`/app/tutor`).
- **Narration:**
  > *"Let's query the tutor on a complex concept: 'Why does Ax = lambda*x require det(A - lambda*I) = 0 for eigenvalues?'
  >
  > Notice the grounded response with mathematical precision and clickable source citations. When I click on '[Video: Timestamp 14:35]', the right drawer immediately opens the lecture timestamp preview.
  >
  > Now, let's test our academic guardrail with an adversarial out-of-syllabus query: 'What is the recipe for chocolate cake?' Notice ZENO immediately declines, transparently notifying the student that the query is outside the uploaded course materials.
  >
  > We can also toggle between English and Hinglish for Indian-language learning, and listen to spoken explanations."*
- **Action:** Click sample prompt, click citation badge to open right drawer, then click "Test Refusal" prompt and play speech narration.

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
