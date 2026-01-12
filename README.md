# Legal Services Facility (LSF) Tanzania Website

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
- Node.js 18+
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/Ephraimdevelops/lsf-new-website-2025-03.git

# Navigate to project
cd lsf-new-website-2025-03

# Install dependencies
npm install

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

## Admin Access

For demo/review purposes, access the admin panel at:
```
/admin?demo=LSF2026
```

## Features

- **62 Pages** — Full organizational website
- **SARA AI** — Legal assistant chatbot
- **Admin CMS** — Content management system
- **Paralegal Portal** — Registration and management
- **Newsletter System** — Email marketing
- **Whistleblower Portal** — Secure reporting

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
