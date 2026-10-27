import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();
crons.interval("purge expired AI action drafts", {hours:1}, internal.saadaActionDrafts.purge, {});
crons.interval("purge expired paralegal matching locations", { minutes: 5 }, internal.paralegalLocation.purgeExpired, {});
crons.interval("retry failed quarantine cleanup", { minutes: 15 }, internal.managedUploads.retryQuarantineCleanup, {});

crons.interval(
  "expire stalled Haki Yangu upload tickets",
  { minutes: 15 },
  internal.managedUploads.expireStaleTickets,
  { limit: 100 },
);

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
