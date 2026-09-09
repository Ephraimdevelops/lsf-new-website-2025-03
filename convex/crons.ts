import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.hourly(
  "expire stale Haki Yangu assignment offers",
  { minuteUTC: 7 },
  internal.caseManagement.expireStaleAssignmentOffers,
  { limit: 50 },
);

crons.hourly(
  "send Haki Yangu appointment reminders",
  { minuteUTC: 17 },
  internal.caseManagement.sendUpcomingAppointmentReminders,
  { limit: 100 },
);

crons.hourly(
  "flag expired Haki Yangu consent evidence",
  { minuteUTC: 27 },
  internal.referrals.expireConsentEvidenceRetention,
  { limit: 100 },
);

export default crons;
