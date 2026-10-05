import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import type { Doc } from "./_generated/dataModel";
import { mutation, query, type QueryCtx } from "./_generated/server";
import { requireAnyRole } from "./lib/auth";
import { requireIndependentBaseRoleReview, requireRemainingAdministrator } from "./lib/baseRoleLifecycle";

// Get dashboard analytics
export const getAnalytics = query({
    args: {},
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin"]);

        // Parallelize queries for performance
        const [
            usersCount,
            news,
            publications,
            programs,
            opportunitiesCount
        ] = await Promise.all([
            ctx.db.query("users").collect().then(res => res.length),
            ctx.db.query("news").order("desc").take(5),
            ctx.db.query("publications").order("desc").take(5),
            ctx.db.query("programs").collect(),
            ctx.db.query("opportunities").collect().then(res => res.length),
        ]);

        const allPageViews = await ctx.db.query("analytics_events").withIndex("by_type", q => q.eq("type", "page_view")).collect();
        const allDownloads = await ctx.db.query("analytics_events").withIndex("by_type", q => q.eq("type", "publication_download")).collect();

        const totalNews = await ctx.db.query("news").collect().then(res => res.length);
        const totalPublications = await ctx.db.query("publications").collect().then(res => res.length);
        const totalPrograms = programs.length;

        // Accurate visitor data from events
        const uniqueVisitors = new Set<string>();
        allPageViews.forEach(event => {
            if (event.visitorId) uniqueVisitors.add(`vid_${event.visitorId}`);
        });
        const totalUniqueVisitors = uniqueVisitors.size || 1;

        // Daily traffic (last 14 days)
        const dailyMap = new Map<string, number>();
        const fourteenDaysAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
        for (let i = 0; i < 14; i++) {
            const d = new Date();
            d.setDate(d.getDate() - (13 - i));
            dailyMap.set(d.toISOString().split('T')[0], 0);
        }

        allPageViews.forEach(e => {
            if (e.timestamp >= fourteenDaysAgo) {
                const date = new Date(e.timestamp).toISOString().split('T')[0];
                if (dailyMap.has(date)) {
                    dailyMap.set(date, dailyMap.get(date)! + 1);
                }
            }
        });

        const visitors = {
            total: totalUniqueVisitors,
            growth: 12.5, // Keep static or calculate real MoM
            daily: Array.from(dailyMap.entries()).map(([date, views]) => ({
                date: new Date(date).toISOString(),
                visitors: Math.ceil(views / 3) || 1 // Heuristic mapping views to visitors
            }))
        };

        // Calculate top downloads from real events
        const downloadMap: Record<string, number> = {};
        allDownloads.forEach(e => {
            const title = (e.meta as any)?.title || 'Document';
            downloadMap[title] = (downloadMap[title] || 0) + 1;
        });

        const downloads = Object.entries(downloadMap)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({
                name: name.substring(0, 20) + (name.length > 20 ? "..." : ""),
                downloads: count
            }));

        // Views data map by broad category
        let homeViews = 0, newsViews = 0, pubViews = 0, progViews = 0, aboutViews = 0;
        allPageViews.forEach(e => {
            const path = e.resourceId || '';
            if (path === '/') homeViews++;
            else if (path.startsWith('/news')) newsViews++;
            else if (path.startsWith('/publications')) pubViews++;
            else if (path.startsWith('/programs')) progViews++;
            else if (path.startsWith('/about')) aboutViews++;
        });

        const views = [
            { name: "Home", views: homeViews },
            { name: "News", views: newsViews },
            { name: "Publications", views: pubViews },
            { name: "Programs", views: progViews },
            { name: "About", views: aboutViews }
        ].sort((a, b) => b.views - a.views);

        const countPath = (startsWith: string) => allPageViews.filter((event) => (event.resourceId || "").startsWith(startsWith)).length;
        const newsReads = countPath("/news/");
        const newsViewsTotal = countPath("/news");
        const publicationViewsTotal = countPath("/publications");
        const opportunityViewsTotal = countPath("/opportunities");
        const paralegalViews = countPath("/paralegals") + countPath("/haki-yangu");
        const saadaSessions = allPageViews.filter((event) => ["/sara", "/sara-ai"].includes(event.resourceId || "")).length;
        const percentage = (part: number, total: number) => total ? Math.round((part / total) * 100) : 0;

        // Real top pages
        const pageCounts: Record<string, number> = {};
        allPageViews.forEach(e => {
            const url = e.resourceId || 'unknown';
            pageCounts[url] = (pageCounts[url] || 0) + 1;
        });

        const topPages = Object.entries(pageCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([page, count]) => ({ page, views: count }));

        // Combine recent activity
        const recentActivity = [
            ...news.map(n => ({
                id: n._id,
                type: "news",
                action: "Published",
                description: n.title,
                timestamp: n.date
            })),
            ...publications.map(p => ({
                id: p._id,
                type: "publication",
                action: "Uploaded",
                description: p.title,
                timestamp: p.publishedDate
            }))
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10);

        return {
            visitors,
            content: {
                totalNews,
                totalPublications,
                totalPrograms
            },
            engagement: {
                downloads,
                views: views.filter(v => v.views > 0).length ? views : [{ name: "No data", views: 0 }],
                topPages: topPages.length ? topPages : [{ page: "No data", views: 0 }]
            },
            detailedMetrics: {
                news: {
                    views: newsViewsTotal,
                    reads: newsReads,
                    clicks: newsViewsTotal,
                    conversionRate: percentage(newsReads, newsViewsTotal),
                },
                opportunities: {
                    views: opportunityViewsTotal,
                    applies: 0,
                    conversionRate: 0,
                },
                paralegalFunnel: {
                    stage1Views: paralegalViews,
                    stage2Starts: 0,
                    stage3Completes: 0,
                    overallConversion: 0,
                },
                stories: {
                    views: countPath("/success-stories"),
                },
                donations: {
                    clicks: 0,
                },
                saadaAI: {
                    sessions: saadaSessions,
                },
            },
            recentActivity
        };
    },
});

// Get all users
export const getUsers = query({
    args: {},
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin"]);

        return await ctx.db.query("users").order("desc").collect();
    },
});

async function projectUsersWithAccess(ctx: QueryCtx, users: Doc<"users">[]) {
    return await Promise.all(users.map(async (user) => {
        const assignments = await ctx.db.query("role_assignments")
            .withIndex("by_user_status", (q) => q.eq("userId", user._id).eq("status", "active"))
            .collect();
        const pendingBaseRoleChange = await ctx.db.query("base_role_change_requests")
            .withIndex("by_target_status", (q) => q.eq("targetUserId", user._id).eq("status", "pending")).first();
        const projectedAssignments = await Promise.all(assignments.map(async (item) => {
            const organizationId = item.organizationId ? ctx.db.normalizeId("justice_service_organizations", item.organizationId) : null;
            const [organization, pendingRevocation] = await Promise.all([
                organizationId ? ctx.db.get(organizationId) : null,
                ctx.db.query("role_revocation_requests").withIndex("by_assignment_status", (q) => q.eq("assignmentId", item._id).eq("status", "pending")).first(),
            ]);
            return { id: item._id, role: item.role, organizationId: item.organizationId,
                organizationName: organization?.name ?? null, grantedAt: item.grantedAt, pendingRevocation: !!pendingRevocation };
        }));
        return { _id: user._id, name: user.name, email: user.email, role: user.role,
            roles: [...new Set([user.role, ...assignments.map((item) => item.role)])],
            assignments: projectedAssignments,
            pendingBaseRoleChange: !!pendingBaseRoleChange,
            hasAssignments: assignments.some((item) => item.role !== "user"), isDeleted: user.isDeleted ?? false };
    }));
}

export const listUsersWithAccessPage = query({
    args: { paginationOpts: paginationOptsValidator },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin"]);
        const result = await ctx.db.query("users").order("desc").paginate(args.paginationOpts);
        return { ...result, page: await projectUsersWithAccess(ctx, result.page) };
    },
});

export const searchUsersWithAccess = query({
    args: { search: v.string() },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin"]);
        const search = args.search.trim().toLowerCase().slice(0, 120);
        if (search.length < 2) return [];
        const [byName, byEmail] = await Promise.all([
            ctx.db.query("users").withSearchIndex("search_name", (q) => q.search("name", search)).take(50),
            ctx.db.query("users").withSearchIndex("search_email", (q) => q.search("email", search)).take(50),
        ]);
        const unique = [...new Map([...byName, ...byEmail].map((user) => [user._id, user])).values()];
        return await projectUsersWithAccess(ctx, unique);
    },
});

export const listOrganizationMembers = query({
    args: { organizationId: v.id("justice_service_organizations") },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin"]);
        const relevant = await ctx.db.query("role_assignments").withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId)).collect();
        return await Promise.all(relevant.map(async (item) => {
            const member = await ctx.db.get(item.userId);
            return { id: item._id, name: member?.name ?? member?.email ?? "—", email: member?.email ?? "", role: item.role, status: item.status, grantedAt: item.grantedAt, revokedAt: item.revokedAt };
        }));
    },
});

export const listRoleRevocations = query({
    args: {},
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin"]);
        const pending = await ctx.db.query("role_revocation_requests").withIndex("by_status", (q) => q.eq("status", "pending")).order("desc").collect();
        return await Promise.all(pending.map(async (request) => {
            const target = await ctx.db.get(request.targetUserId);
            const assignment = await ctx.db.get(request.assignmentId);
            return { ...request, targetName: target?.name ?? target?.email ?? "—", role: assignment?.role ?? "unknown", organizationId: assignment?.organizationId };
        }));
    },
});

export const listRoleRevocationsPage = query({
    args: { paginationOpts: paginationOptsValidator },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin"]);
        const result = await ctx.db.query("role_revocation_requests")
            .withIndex("by_status", (q) => q.eq("status", "pending")).order("desc").paginate(args.paginationOpts);
        return { ...result, page: await Promise.all(result.page.map(async (request) => {
            const [target, assignment] = await Promise.all([ctx.db.get(request.targetUserId), ctx.db.get(request.assignmentId)]);
            return { ...request, targetName: target?.name ?? target?.email ?? "—", role: assignment?.role ?? "unknown", organizationId: assignment?.organizationId };
        })) };
    },
});

export const listBaseRoleChanges = query({
    args: {},
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin"]);
        const requests = await ctx.db.query("base_role_change_requests").withIndex("by_status", (q) => q.eq("status", "pending")).order("desc").collect();
        return await Promise.all(requests.map(async (request) => {
            const target = await ctx.db.get(request.targetUserId);
            return { ...request, targetName: target?.name || target?.email || "—", currentRole: target?.role ?? "unavailable" };
        }));
    },
});

export const listBaseRoleChangesPage = query({
    args: { paginationOpts: paginationOptsValidator },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin"]);
        const result = await ctx.db.query("base_role_change_requests")
            .withIndex("by_status", (q) => q.eq("status", "pending")).order("desc").paginate(args.paginationOpts);
        return { ...result, page: await Promise.all(result.page.map(async (request) => {
            const target = await ctx.db.get(request.targetUserId);
            return { ...request, targetName: target?.name || target?.email || "—", currentRole: target?.role ?? "unavailable" };
        })) };
    },
});

export const requestBaseRoleChange = mutation({
    args: { targetUserId: v.id("users"), reason: v.string() },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["admin"]);
        if (user._id === args.targetUserId) throw new Error("You cannot request removal of your own base role.");
        const target = await ctx.db.get(args.targetUserId);
        if (!target || target.isDeleted || target.role === "user") throw new Error("An active professional base role is required.");
        const reason = args.reason.trim();
        if (reason.length < 10 || reason.length > 2000) throw new Error("Record a 10–2000 character reason.");
        const existing = await ctx.db.query("base_role_change_requests").withIndex("by_target_status", (q) => q.eq("targetUserId", args.targetUserId).eq("status", "pending")).first();
        if (existing) throw new Error("This account already has a base-role review pending.");
        const now = Date.now();
        const id = await ctx.db.insert("base_role_change_requests", { targetUserId: target._id, previousRole: target.role, reason, status: "pending", requestedBy: user._id, requestedAt: now });
        await ctx.db.insert("audit_logs", { action: "access.base_role_change_requested", entityType: "user", entityId: target._id, userId: user._id, timestamp: now, metadata: { previousRole: target.role, reason } });
        return { id };
    },
});

export const reviewBaseRoleChange = mutation({
    args: { id: v.id("base_role_change_requests"), decision: v.union(v.literal("approved"), v.literal("rejected")), note: v.string() },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["admin"]);
        const request = await ctx.db.get(args.id);
        if (!request || request.status !== "pending") throw new Error("Pending base-role request not found.");
        requireIndependentBaseRoleReview(request.requestedBy, user._id, request.targetUserId);
        const note = args.note.trim();
        if (note.length < 10 || note.length > 2000) throw new Error("Record a 10–2000 character review reason.");
        const target = await ctx.db.get(request.targetUserId);
        if (args.decision === "approved" && (!target || target.isDeleted || target.role !== request.previousRole)) throw new Error("The account's base role changed; review a fresh request.");
        const now = Date.now();
        if (args.decision === "approved" && target) {
            if (request.previousRole === "admin") {
                const baseAdmins = await ctx.db.query("users").withIndex("by_role", (q) => q.eq("role", "admin")).collect();
                const assignedAdmins = await ctx.db.query("role_assignments").withIndex("by_role_status", (q) => q.eq("role", "admin").eq("status", "active")).collect();
                const assignedUsers = await Promise.all(assignedAdmins.map((assignment) => ctx.db.get(assignment.userId)));
                const activeAdminIds = [...baseAdmins, ...assignedUsers.filter((entry) => entry !== null)].filter((entry) => !entry.isDeleted).map((entry) => entry._id);
                requireRemainingAdministrator(target._id, activeAdminIds);
            }
            const activeAssignments = await ctx.db.query("role_assignments").withIndex("by_user_status", (q) => q.eq("userId", target._id).eq("status", "active")).collect();
            for (const assignment of activeAssignments.filter((item) => item.role === request.previousRole)) {
                await ctx.db.patch(assignment._id, { status: "revoked", revokedAt: now });
            }
            if (request.previousRole === "paralegal") {
                const applications = await ctx.db.query("paralegal_applications").withIndex("by_email", (q) => q.eq("email", target.email.toLowerCase())).collect();
                for (const application of applications.filter((item) => item.status === "approved" || item.isVerified)) {
                    await ctx.db.patch(application._id, { status: "rejected", isVerified: false, onboardingCompleted: false, availabilityStatus: "unavailable", reviewNotes: `Access withdrawn after independently reviewed base-role change ${request._id}.`, reviewedBy: user._id, reviewedAt: now });
                }
            }
            await ctx.db.patch(target._id, { role: "user" });
        }
        await ctx.db.patch(request._id, { status: args.decision, reviewedBy: user._id, reviewedAt: now, reviewNote: note });
        await ctx.db.insert("audit_logs", { action: `access.base_role_change_${args.decision}`, entityType: "user", entityId: request.targetUserId, userId: user._id, timestamp: now, metadata: { previousRole: request.previousRole, newRole: args.decision === "approved" ? "user" : request.previousRole, reason: request.reason, reviewNote: note } });
        return { success: true };
    },
});

export const requestRoleRevocation = mutation({
    args: { assignmentId: v.id("role_assignments"), reason: v.string() },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["admin"]);
        const assignment = await ctx.db.get(args.assignmentId);
        if (!assignment || assignment.status !== "active") throw new Error("Active assignment not found.");
        if (assignment.userId === user._id) throw new Error("You cannot request removal of your own access.");
        const target = await ctx.db.get(assignment.userId);
        if (!target || target.isDeleted) throw new Error("Target account is unavailable.");
        if (target.role === assignment.role) throw new Error("This role is also held as the account's base role and needs a separate account-level review.");
        const activeSameRole = await ctx.db.query("role_assignments").withIndex("by_user_status", (q) => q.eq("userId", target._id).eq("status", "active")).collect();
        if (activeSameRole.filter((item) => item.role === assignment.role).length > 1) throw new Error("This user has multiple active assignments for this role; review all assignments together.");
        const reason = args.reason.trim();
        if (reason.length < 10 || reason.length > 2000) throw new Error("Record a 10–2000 character reason.");
        const prior = await ctx.db.query("role_revocation_requests").withIndex("by_assignment_status", (q) => q.eq("assignmentId", args.assignmentId).eq("status", "pending")).first();
        if (prior) throw new Error("A revocation request is already pending for this role.");
        const now = Date.now();
        const id = await ctx.db.insert("role_revocation_requests", { assignmentId: args.assignmentId, targetUserId: target._id, reason, status: "pending", requestedBy: user._id, requestedAt: now });
        await ctx.db.insert("audit_logs", { action: "access.revocation_requested", entityType: "role_assignment", entityId: args.assignmentId, userId: user._id, timestamp: now, metadata: { targetUserId: target._id, role: assignment.role, reason } });
        return { id };
    },
});

export const reviewRoleRevocation = mutation({
    args: { id: v.id("role_revocation_requests"), decision: v.union(v.literal("approved"), v.literal("rejected")), note: v.string() },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["admin"]);
        const request = await ctx.db.get(args.id);
        if (!request || request.status !== "pending") throw new Error("Pending request not found.");
        if (request.requestedBy === user._id || request.targetUserId === user._id) throw new Error("An independent administrator must review this request.");
        const note = args.note.trim();
        if (note.length < 10 || note.length > 2000) throw new Error("Record a 10–2000 character review reason.");
        const assignment = await ctx.db.get(request.assignmentId);
        if (args.decision === "approved" && (!assignment || assignment.status !== "active")) throw new Error("The role is no longer active.");
        if (args.decision === "approved" && assignment) {
            const target = await ctx.db.get(request.targetUserId);
            if (!target || target.role === assignment.role) throw new Error("The target's current base role requires separate review.");
        }
        const now = Date.now();
        if (args.decision === "approved" && assignment) await ctx.db.patch(assignment._id, { status: "revoked", revokedAt: now });
        await ctx.db.patch(request._id, { status: args.decision, reviewedBy: user._id, reviewedAt: now, reviewNote: note });
        await ctx.db.insert("audit_logs", { action: `access.revocation_${args.decision}`, entityType: "role_assignment", entityId: request.assignmentId, userId: user._id, timestamp: now, metadata: { targetUserId: request.targetUserId, role: assignment?.role, note } });
        return { success: true };
    },
});

export const listRoleAudit = query({
    args: {},
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin"]);
        const actions = ["user.role_changed", "access.approved", "access.rejected", "access.revocation_requested", "access.revocation_approved", "access.revocation_rejected", "access.base_role_change_requested", "access.base_role_change_approved", "access.base_role_change_rejected"];
        const groups = await Promise.all(actions.map((action) => ctx.db.query("audit_logs")
            .withIndex("by_action", (q) => q.eq("action", action)).order("desc").take(50)));
        const recent = groups.flat().sort((a, b) => b.timestamp - a.timestamp).slice(0, 50);
        return await Promise.all(recent.map(async (row) => {
            const metadata = (row.metadata ?? {}) as Record<string, unknown>;
            const actorId = ctx.db.normalizeId("users", row.userId);
            const actor = actorId ? await ctx.db.get(actorId) : await ctx.db.query("users").withIndex("by_clerk_id", (q) => q.eq("clerkId", row.userId)).first();
            const fromMetadata = typeof metadata.targetUserId === "string" ? metadata.targetUserId : typeof metadata.applicantId === "string" ? metadata.applicantId : null;
            let targetId = fromMetadata ? ctx.db.normalizeId("users", fromMetadata) : null;
            if (!targetId && row.entityType === "user" && row.entityId) targetId = ctx.db.normalizeId("users", row.entityId);
            if (!targetId && row.entityType === "access_request" && row.entityId) {
                const requestId = ctx.db.normalizeId("access_requests", row.entityId);
                const request = requestId ? await ctx.db.get(requestId) : null;
                targetId = request?.userId ?? null;
            }
            if (!targetId && row.entityType === "role_assignment" && row.entityId) {
                const assignmentId = ctx.db.normalizeId("role_assignments", row.entityId);
                const assignment = assignmentId ? await ctx.db.get(assignmentId) : null;
                targetId = assignment?.userId ?? null;
            }
            const target = targetId ? await ctx.db.get(targetId) : null;
            const role = typeof metadata.role === "string" ? metadata.role : typeof metadata.previousRole === "string" ? metadata.previousRole : null;
            return { _id: row._id, action: row.action, entityId: row.entityId, timestamp: row.timestamp,
                actorName: actor?.name || actor?.email || null, targetName: target?.name || target?.email || null, role };
        }));
    },
});

export const listPlatformAudit = query({
    args: { actionPrefix: v.optional(v.string()), limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "supervisor"]);
        const limit = Math.min(Math.max(Math.trunc(args.limit ?? 100), 1), 250);
        const prefix = args.actionPrefix?.trim().toLowerCase();
        const rows = await ctx.db.query("audit_logs").order("desc").take(prefix ? 1000 : limit);
        const filtered = prefix ? rows.filter((row) => row.action.toLowerCase().startsWith(prefix)).slice(0, limit) : rows;
        return await Promise.all(filtered.map(async (row) => {
            const actorId = row.userId ? ctx.db.normalizeId("users", row.userId) : null;
            const actor = actorId ? await ctx.db.get(actorId) : null;
            const metadata = row.metadata as { changedFieldNames?: unknown } | undefined;
            const changedFieldNames = Array.isArray(metadata?.changedFieldNames)
                ? metadata.changedFieldNames.filter((item: unknown): item is string => typeof item === "string").slice(0, 20)
                : [];
            return {
                _id: row._id,
                action: row.action,
                entityType: row.entityType,
                entityId: row.entityId,
                timestamp: row.timestamp,
                actor: actor ? { name: actor.name, email: actor.email } : null,
                changedFieldNames,
            };
        }));
    },
});
