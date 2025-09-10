# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/9d4a1fee-3d9b-4a77-8bf0-c9d104c4b663

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/9d4a1fee-3d9b-4a77-8bf0-c9d104c4b663) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9d4a1fee-3d9b-4a77-8bf0-c9d104c4b663) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# Backend deployment & admin seeding

## Backend deployment (Railway) and admin seeding

If your Railway trial ended or you are moving to a new Railway account, follow these steps to deploy the backend and create the initial admin user.

1. Create a new Railway project and connect your GitHub repository (this repo).
2. Add the required environment variables in the Railway project settings:
   - `SUPABASE_URL` — your Supabase project URL
   - `SUPABASE_ANON_KEY` — Supabase anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (VERY SENSITIVE)
   - `FRONTEND_URL` — your frontend URL (Vercel)
   - `NODE_ENV` — `production`

3. Set build & start commands in Railway (example):
   - Build: `npm install && npm run build`
   - Start: `npm run start`

4. Deploy the project and verify the generated backend URL.

5. In Supabase SQL editor, run the migration located at `supabase/001_create_profiles_and_policies.sql` to create the `profiles` table and example RLS policies.

6. Seed the admin user (local or on the server):
   - Locally (requires `SUPABASE_SERVICE_ROLE_KEY` in your `.env`):
     - `cd backend`
     - `npm i` (if you haven't already)
     - `npm run seed:admin`
   - On the server (Railway): add an environment variable `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` (optional) and run the `seed:admin` script as a one-off job or in CI.

7. Update the frontend (Vercel) environment variables:
   - `VITE_API_BASE_URL` → `https://<your-backend>/api/v1`
   - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (if used by frontend)
   - Redeploy the frontend.

8. Security best practices (important):
   - Rotate the Supabase `SERVICE_ROLE` key after migration and update the Railway env var.
   - Do NOT store the service role key in frontend or public places.
   - Use HttpOnly cookies for admin sessions (the backend implements `/auth/login-cookie`).
   - Limit CORS to your frontend domain in backend and Supabase settings.

## Running locally

1. Copy `.env.example` to `.env` and add the Supabase keys and `FRONTEND_URL`.
2. Start backend in development mode:
   - `cd backend && npm run dev`
3. Start frontend:
   - `npm install && npm run dev`
4. Seed admin (optional):
   - `cd backend && npm run seed:admin`


---

If you want, I can also:
- Add a single-command script to run migrations + seed in CI.
- Provide a step-by-step Railway UI walkthrough with screenshots.
