import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

function envValue(file, name) {
  if (!fs.existsSync(file)) return "";
  const line = fs.readFileSync(file, "utf8").split(/\r?\n/).find((entry) => entry.startsWith(`${name}=`));
  return line?.slice(name.length + 1).trim().replace(/^['"]|['"]$/g, "") ?? "";
}

const url = process.env.VITE_CONVEX_URL || envValue(path.resolve(".env.local"), "VITE_CONVEX_URL");
if (!/^https:\/\/.+\.convex\.cloud$/.test(url)) {
  console.error("OPEN Configured Convex URL is missing or invalid.");
  process.exitCode = 1;
} else {
  try {
    const services = await new ConvexHttpClient(url).query(api.justiceServices.listPublicServices, {});
    const count = (predicate) => services.filter(predicate).length;
    const byRegion = Object.fromEntries([...new Set(services.map((service) => service.region))]
      .sort().map((region) => [region, count((service) => service.region === region)]));
    console.log(JSON.stringify({
      checkedAt: new Date().toISOString(),
      scope: "Public, active, verified and review-current Find Help services only",
      total: services.length,
      byRegion,
      missingPhone: count((service) => !service.phone),
      missingHours: count((service) => !service.openingHours),
      missingVerificationDate: count((service) => !service.lastVerifiedAt),
      missingCoordinates: count((service) => service.latitude == null || service.longitude == null),
      closedOrLimitedIntake: count((service) => ["closed", "limited"].includes(service.currentIntakeState)),
    }, null, 2));
    if (services.length === 0) process.exitCode = 1;
  } catch {
    console.error("OPEN Could not reach the configured Convex deployment. Directory coverage is unverified.");
    process.exitCode = 1;
  }
}
