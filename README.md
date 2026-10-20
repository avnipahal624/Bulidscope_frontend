# BuildScope AI — Frontend

**An evidence-led workspace for deciding whether a software idea is worth building.**

BuildScope AI helps students, hackathon teams, developers, and founders investigate an idea before committing to implementation. It brings prior-art leads, differentiation claims, feasibility risks, requirements, learning resources, testing records, and reports into one connected project workspace.

> **Evidence first.** BuildScope organises findings and highlights gaps; it does not guarantee originality, feasibility, or project success. Treat demo records and unreviewed search results as leads—not verified evidence.

## Product Demo

Watch the [BuildScope AI walkthrough video on Google Drive](https://drive.google.com/file/d/128Fw6qudJEo3YPyIPSDlP2f4tMnScx_v/view?usp=sharing) for a walkthrough of the product experience.


## At a glance

- **Frontend:** React 18, Vite, JavaScript
- **Navigation:** React Router
- **UI icons:** Lucide React
- **Reports:** jsPDF and jsPDF AutoTable
- **Fonts:** self-hosted Fontsource packages
- **Live repository search:** GitHub public repository search through the BuildScope backend
- **Workspace storage:** browser-local persistence
- **Browser verification:** Playwright scripts

## What you can do

| Area | Purpose |
| --- | --- |
| **Project Workspace** | Create project cases and capture a structured brief. |
| **Prior Art Lab** | Search public GitHub repositories, organise repository leads and existing solutions, and prepare comparisons. |
| **Differentiation** | Record product claims, supporting evidence, and potential areas of improvement. |
| **Feasibility Analysis** | Track dependencies, technical risks, implementation scope, and acceptance criteria. |
| **Requirements Mapping** | Connect requirements to sources and review coverage. |
| **Learning Resources** | Identify skill gaps, follow learning paths, and maintain a learning log. |
| **Hackathon Radar** | Organise opportunities, preparation tasks, and application tracking. |
| **Opportunity-to-Proof Graph** | Link opportunities, requirements, implementation plans, and evidence. |
| **Assurance & Testing** | Record acceptance criteria and manual test results. |
| **Reports** | Assemble project findings into structured reports and export PDFs. |
| **Buildability Passport** | Summarise recorded checks, risks, blockers, and evidence. |
| **Progress Tracking** | Track missions, activity, experience points, ranks, and achievements. |

## How the workflow fits together

`Project brief → Prior-art research → Differentiation → Feasibility → Requirements → Scope & acceptance criteria → Report → Buildability Passport`

Records are connected across the workspace so that research and implementation evidence can inform later decisions. For example:

- Prior-art leads can be selected during comparison and referenced in evidence records.
- Feasibility blockers and unmitigated risks can surface in project progress and the Buildability Passport.
- Requirements can be traced to sources and implementation checks.
- Reports preserve snapshots so later edits do not silently rewrite an earlier report.
- Learning progress can support preparation, but does not itself prove that a project requirement has been implemented.

## Repository search and integrations

The Prior Art Lab can send a repository-search request to the BuildScope backend, which queries the **public GitHub repository API**. Results are saved as repository leads in the current workspace.

**Current coverage and limits:**

- GitHub search covers public repository metadata; it does not search private repositories, patents, every commercial product, unpublished research, or all existing work.
- Search relevance is a locally computed heuristic—not a live ranking, proof of feature equivalence, or legal novelty assessment.
- Returned leads need documentation and functionality review before they should be treated as evidence.
- Web/product search, paper/dataset search, and official-source verification are not connected unless separately implemented and configured.
- Do not put API keys or other secrets in frontend environment variables or browser code. Secret-bearing integrations belong on the server.

## Getting started

### Prerequisites

- Node.js and npm
- Git

### Install and run locally

```bash
git clone https://github.com/avnipahal624/Bulidscope_frontend.git
cd Bulidscope_frontend
npm install
npm run dev
```

Open the local URL printed by Vite in the terminal (typically `http://localhost:3000`).

### Production build

```bash
npm run build
```

Vite writes the optimised production bundle to `dist/`.

### Preview-host note

For a hosted or tunnelled development preview whose hostname Vite does not recognise, provide the allowed host at start-up rather than committing an environment-specific hostname:

```bash
PREVIEW_ALLOWED_HOSTS=my-preview-host.example npm run dev
```

## Environment configuration

For a deployed frontend that uses the BuildScope backend, configure this Vite environment variable in the deployment environment:

```bash
VITE_API_BASE_URL=https://buildscope-backend.onrender.com/api
```

The frontend also has a fallback API base URL for the deployed BuildScope backend. If you change the backend host, update the environment variable and redeploy the frontend. Vite environment variables prefixed with `VITE_` are exposed to client-side code; **never place secrets in them**.

## Project structure

```text
src/
├── app/                 # Application shell, routing, shared state
├── components/          # Reusable interface components
├── data/                # Demo fixtures and learning resources
├── features/
│   ├── auth/            # Demo authentication
│   ├── onboarding/      # Initial workspace setup
│   ├── projects/        # Project creation and management
│   ├── missions/        # Mission Control and progress
│   ├── discovery/       # Prior Art Lab and repository leads
│   ├── differentiation/ # Claims and evidence links
│   ├── feasibility/     # Risks, dependencies and implementation scope
│   ├── requirements/    # Requirement mapping and compliance
│   ├── learning/        # Learning paths and resources
│   ├── hackathons/      # Hackathon tracking
│   ├── graph/           # Opportunity-to-Proof graph
│   ├── assurance/       # Acceptance criteria and test records
│   ├── reports/         # Report assembly and PDF export
│   ├── passport/        # Buildability Passport
│   └── gamification/    # XP, ranks and achievements
├── lib/                 # Models, scoring and report utilities
└── services/            # Auth adapter and provider interfaces
scripts/                 # Playwright verification scripts
```

## Data, privacy, and demo behaviour

- Authentication in this frontend is a **demo/local adapter**, not a production identity system.
- Workspace records are persisted in the browser. They are not automatically synchronised across devices or users.
- Clearing site data can remove local accounts and workspace data. Export or back up important work separately.
- Demo records are labelled as demo data and must not be presented as independently verified findings.
- User-entered records and repository metadata are not equivalent to verified documentation, tested functionality, or legal analysis.
- A Buildability Passport summarises the records currently available; it is not a certification or guarantee.

## Testing

Install the Playwright browser once:

```bash
npx playwright install chromium
```

Start the development server in one terminal:

```bash
npm run dev
```

Then run the relevant verification script from the project root:

```bash
node scripts/smoke.mjs
node scripts/auth.mjs
node scripts/acceptance.mjs
node scripts/supplementary.mjs
node scripts/proof.mjs
node scripts/audit.mjs
```

Some scripts may require a running development server or a working browser installation. Consult each script for its specific prerequisites. PDF inspection utilities are also available in `scripts/` for checking exported output.

## Related repository

- [BuildScope AI Backend](https://github.com/avnipahal624/Buildscope_Backend) — API services, including public GitHub repository search.

## License

No license is currently specified. Check the repository's licensing terms before redistributing or reusing this code.
