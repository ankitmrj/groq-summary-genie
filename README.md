AI Meeting Notes Summarizer & Sharer

Approach & Process

Goal: Allow users to upload meeting transcripts, provide a custom prompt (e.g., “Highlight action items”), generate an editable summary, and share via email.

Steps Taken:

Built a minimal React + Vite frontend to handle transcript upload, prompt input, and displaying/editing summaries.

Implemented a backend API using Node.js/Express to process requests.

Integrated Groq API for fast LLM summarization with custom instructions.

Added email delivery using a transactional email service (e.g., Nodemailer with SMTP).

Deployed to Netlify for easy hosting and quick iterations.

Testing: Verified uploads, prompt handling, summary editing, and email sending end-to-end.

Tech Stack

Frontend: React, Vite, TypeScript, Tailwind CSS (minimal UI with shadcn-ui)

Backend: Node.js, Express

AI Service: Groq API (can be swapped with OpenAI if needed)

Email: Nodemailer (SMTP)

Deployment: Netlify

Deployed Link

https://legendary-cactus-841d22.netlify.app

Repository

https://github.com/ankitmrj/groq-summary-genie

