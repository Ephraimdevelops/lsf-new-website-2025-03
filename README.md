# Legal Services Facility (LSF) Tanzania Website

## Development checkpoint

The `dev/haki-yangu-v2` branch preserves the web and mobile development work. Check out that branch explicitly when continuing development; `main` is the live website branch.

```bash
git clone --branch dev/haki-yangu-v2 https://github.com/Ephraimdevelops/lsf-new-website-2025-03.git
cd lsf-new-website-2025-03
npm ci
npm ci --prefix mobile
npm run typecheck
npm run build
```

Install both dependency sets before building: the website currently imports shared labels from the mobile source folder. The mobile project's `.npmrc` preserves the existing lockfile's optional Mapbox peer resolution.

Copy the root and mobile `.env.example` templates to their respective `.env.local` files and configure development services privately. Environment secrets, local account notes, review archives, and generated build outputs are intentionally excluded from Git. Pulling this branch does not configure or deploy backend services.

## Overview

This is the official website for the Legal Services Facility (LSF) Tanzania — a comprehensive digital platform for legal empowerment and access to justice.

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **UI:** Tailwind CSS + shadcn/ui
- **Backend:** Convex (serverless database)
- **Authentication:** Clerk
- **Animations:** Framer Motion

## Getting Started

### Prerequisites
- Node.js 22 LTS (use a version supported by Expo SDK 58 for mobile development)
- npm or bun

### Installation

```bash
# Clone the repository
git clone --branch dev/haki-yangu-v2 https://github.com/Ephraimdevelops/lsf-new-website-2025-03.git

# Navigate to project
cd lsf-new-website-2025-03

# Install dependencies
npm ci
npm ci --prefix mobile

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```bash
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_CONVEX_URL=your_convex_url
```

## Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Add environment variables
3. Deploy

### Backend (Convex)
```bash
npx convex deploy
```

## Admin access and approval ownership

Sign in with an authorised LSF Admin account. A URL parameter is not an authentication mechanism. Admin owns legal-guide approval, AI-source review and directory verification; prepared research records must not be published merely because they have been imported. Independent-review requirements still apply.

## Product scope and release status

The development branch contains web and Expo SDK 58 mobile clients, role-based workspaces, case requests and assignments, messaging, documents, appointments, referrals, content review, directory management, reporting and Haki Yangu AI.

Implementation is not release acceptance. Before presenting the product as finished, record successful role journeys on web and native devices, approved/current legal content and verified public providers, operational and policy ownership, and production build/configuration checks. Automated tests alone do not establish those outcomes.

Keep development preservation separate from production deployment: pushing this branch does not authorise merging to `main`, deploying the Convex backend, or submitting store builds. Review hosting branch settings before enabling deployments.

## Documentation

See the project documentation files for more details:
- `PRODUCTION_DEPLOYMENT_GUIDE.md`
- `SCALABILITY_SECURITY_PLAN.md`
- `BUDGET_COST_ANALYSIS.md`

## License

Proprietary — Legal Services Facility Tanzania

## Contact

- **Website:** https://lsftz.org
- **Email:** info@lsftz.org
