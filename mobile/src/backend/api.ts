import { anyApi } from "convex/server";
import type { api as GeneratedApi } from "../../../convex/_generated/api";

export const api = anyApi as unknown as typeof GeneratedApi;
