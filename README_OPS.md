# LSF Operations Manual (IT Manager)

**Last Updated:** 2026-01-15
**Role Required:** Admin

---

## 🔒 1. How to Rotate API Keys
If a key is compromised (e.g. OpenAI, Clerk), follow these steps immediately.

### A. Rotate OpenAI Key
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys).
2. Create a new key named `LSF_PROD_2026_V2`.
3. Copy the key.
4. Go to **Vercel Dashboard** > LSF Project > Settings > Environment Variables.
5. Edit `OPENAI_API_KEY` with the new value.
6. **Redeploy** the latest deployment for changes to take effect.
7. Delete the old key in OpenAI dashboard.

### B. Rotate Clerk Keys
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/) > API Keys.
2. Click "Roll Key" (Advance Warning: This will log everyone out).
3. Copy the new `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
4. Update Vercel Environment Variables.
5. Redeploy.

---

## 💾 2. Backups & Restoration (Convex)
Convex handles automatic backups, but manual snapshots are good before big updates.

### Create a Snapshot
1. Go to [Convex Dashboard](https://dashboard.convex.dev/).
2. Select `lsf-production` project.
3. Settings > Backups.
4. Click **"Take Snapshot"**.

### Restore from Backup
> **WARNING:** This overwrites current data.
1. In Convex Dashboard > Backups.
2. Find the clear snapshot (check date).
3. Click "Restore".
4. Select "Clear existing data and restore".
5. Type the confirmation phrase.

---

## 🛑 3. Emergency Protocols
### SARA is Hallucinating / Saying Harmful Things
1. Log in to **LSF Admin**.
2. Go to **Dashboard** (Home).
3. Locate **"Mission Control"** widget.
4. Click **"KILL SWITCH (Emergency Stop)"**.
   - *Result:* SARA chat is disabled for all users. "System Maintenance" is shown.
5. Investigation:
   - Check `sara_chat` logs in Convex to see what happened.
   - Adjust `system_prompt` in `convex/sara_actions.ts` if needed.
   - Re-enable SARA only when fixed.

---

## 👥 4. Managing Admin Access
1. **Invite via Clerk**:
   - Go to Clerk Dashboard > Users.
   - "Create User" -> Enter email.
2. **Assign Admin Role**:
   - The user must log in once to create their record in Convex.
   - Go to Convex Dashboard > Data > `users` table.
   - Find the user by email.
   - Edit the row: set `role` to `"admin"`.
   - *Note:* Future updates will allow doing this from the Admin "Team" tab.
