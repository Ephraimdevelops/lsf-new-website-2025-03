# Mobile Beneficiary Closure Experience

## What changed

- Mobile case detail now shows a closure banner when the case is resolved, closed, or closed unresolved.
- The feedback tab now prioritizes the recorded outcome before the review/escalation panel.
- Beneficiaries see the outcome label, summary, and recorded date.
- Feedback can only be submitted after an outcome exists and the case is resolved or closed.
- Submitted feedback now shows the saved star rating and comment.
- The timeline has a beneficiary-visible label for `feedback_requested`.

## Product reason

Beneficiaries need a clear explanation of what happened at the end of a case. Closure cannot feel like the case simply disappeared or changed status. The app now explains whether there is a recorded outcome, asks for service feedback, and keeps the LSF review route available if the person still has a concern.

## Privacy and quality

- Feedback copy makes clear that feedback improves service quality and does not change the legal outcome.
- Closed-unresolved copy directs the person to LSF review instead of implying success.
- Backend enforcement prevents premature feedback before an outcome exists.

## Verification

- Mobile typecheck covers the updated case detail screen.
- Haki contract tests assert the mobile closure copy and backend feedback guard.
