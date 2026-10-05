# Development role screen accounts

Environment: Clerk Development and matching Convex Development. Test location: Dar es Salaam, Tanzania. These addresses use Clerk's development `+clerk_test` convention. **They are proposed identifiers, not created accounts.** No passwords or service keys belong in this file.

| Role | Test email | Expected web landing page | Account state |
| --- | --- | --- | --- |
| Beneficiary (`user`) | `haki-qa-beneficiary+clerk_test@example.com` | `/dashboard/user` | Not created |
| Paralegal | `haki-qa-paralegal+clerk_test@example.com` | `/dashboard/paralegal` | Not created; approval required |
| Provider staff | `haki-qa-provider+clerk_test@example.com` | `/dashboard/paralegal` | Not created; verified organisation and approval required |
| LSF staff | `haki-qa-staff+clerk_test@example.com` | `/dashboard/staff` | Not created; verified LSF organisation and approval required |
| Supervisor | `haki-qa-supervisor+clerk_test@example.com` | `/dashboard/staff` | Not created; controlled grant required |
| Safeguarding officer | `haki-qa-safeguarding+clerk_test@example.com` | `/dashboard/safeguarding` | Not created; controlled grant required |
| Content editor | `haki-qa-editor+clerk_test@example.com` | `/dashboard/editorial` | Not created; approval required |
| Stakeholder | `haki-qa-stakeholder+clerk_test@example.com` | `/dashboard/stakeholder` | Not created; approval required |
| Donor | `haki-qa-donor+clerk_test@example.com` | `/dashboard/stakeholder` | Not created; approval required |
| Administrator | `haki-qa-admin+clerk_test@example.com` | `/admin` | Not created; controlled grant required |

Clerk stores identity, but the app's professional access is held in Convex `role_assignments` or an approved paralegal profile. New Clerk users have only beneficiary access until their matching Convex user has synced and an authorised role workflow grants the role. Creating a Clerk user alone does not make a privileged screen usable.

The shared region applies to paralegal applications and region scoped test data. The current `users` account record and Clerk creation form have no region field, so the region cannot be set on every identity account.

Before declaring a row ready, verify its Clerk user exists in Development, sign in once so `users.syncUser` creates the matching Convex record, confirm the active role in `users.currentAccess`, and open its expected page on web and mobile. Keep test records synthetic and within Dar es Salaam.
