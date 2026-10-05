# Haki Yangu auth screen coverage

The five supplied mobile references define the welcome, sign-up, role-choice, phone-code, and completion screens. The companion design note calls for a calm civic interface: white space, burgundy actions, readable type, restrained teal and gold accents, progressive forms, and accessible Swahili and English copy. The app follows that direction without using generated image text or decorative controls for actual authentication.

| Journey state | Current mobile implementation | Web implementation |
| --- | --- | --- |
| Welcome and language | Onboarding with Kiswahili/English choice and service preview | Public site introduction |
| Email/password sign-up and sign-in | Clerk native form with clear mode choice | Clerk web components in matching Haki Yangu shell |
| Google/Apple entry | Shown only when the respective native connection is configured | Controlled by Clerk connection configuration |
| Email verification | Code entry, resend wait, change address, inline error | Clerk verification flow |
| Phone sign-up, sign-in, and recovery | Phone field and code verification behind `EXPO_PUBLIC_PHONE_AUTH_ENABLED` | Depends on Clerk phone settings |
| Password recovery | Recovery code and new-password state | Clerk recovery flow |
| Enrolled second factor | TOTP, email/phone code, or backup code when Clerk requests it | Clerk security challenge |
| Name and role | Collected after account creation; four role choices | Name/role onboarding after Clerk sign-up |
| Professional review | Paralegal application and staff/partner access request with pending state | Existing application and role workflows |
| Completion | Account-ready screen after beneficiary path | Role-specific post-sign-up destination |
| Account connection failure | Retry before private journey continues | Retry/reload state |

Before launch, verify each enabled method against a **matching Clerk and Convex environment** on iOS, Android, and web. Enable phone and native social buttons only after delivery, redirects, recovery, and device testing pass. Instance-wide required MFA still needs a `setup-mfa` mobile session-task flow before it can be enabled. The five references do not specify legal consent, privacy copy, exact SMS provider behavior, or organisation approval policy; those must be supplied by LSF. See `auth-launch-checklist.md` for dashboard settings and the cross-device role test matrix.
