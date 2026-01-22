/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as analytics from "../analytics.js";
import type * as debug from "../debug.js";
import type * as formSubmissions from "../formSubmissions.js";
import type * as hero from "../hero.js";
import type * as heros from "../heros.js";
import type * as init from "../init.js";
import type * as media from "../media.js";
import type * as news from "../news.js";
import type * as newsletter from "../newsletter.js";
import type * as opportunities from "../opportunities.js";
import type * as ops from "../ops.js";
import type * as paralegals from "../paralegals.js";
import type * as programs from "../programs.js";
import type * as publications from "../publications.js";
import type * as resend from "../resend.js";
import type * as sara from "../sara.js";
import type * as sara_actions from "../sara_actions.js";
import type * as sara_chat from "../sara_chat.js";
import type * as seedContent from "../seedContent.js";
import type * as settings from "../settings.js";
import type * as stats from "../stats.js";
import type * as stories from "../stories.js";
import type * as team from "../team.js";
import type * as testimonials from "../testimonials.js";
import type * as users from "../users.js";
import type * as whistleblower from "../whistleblower.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  analytics: typeof analytics;
  debug: typeof debug;
  formSubmissions: typeof formSubmissions;
  hero: typeof hero;
  heros: typeof heros;
  init: typeof init;
  media: typeof media;
  news: typeof news;
  newsletter: typeof newsletter;
  opportunities: typeof opportunities;
  ops: typeof ops;
  paralegals: typeof paralegals;
  programs: typeof programs;
  publications: typeof publications;
  resend: typeof resend;
  sara: typeof sara;
  sara_actions: typeof sara_actions;
  sara_chat: typeof sara_chat;
  seedContent: typeof seedContent;
  settings: typeof settings;
  stats: typeof stats;
  stories: typeof stories;
  team: typeof team;
  testimonials: typeof testimonials;
  users: typeof users;
  whistleblower: typeof whistleblower;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
