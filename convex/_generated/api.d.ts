/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as accessRequests from "../accessRequests.js";
import type * as accountDeletion from "../accountDeletion.js";
import type * as admin from "../admin.js";
import type * as aiUsage from "../aiUsage.js";
import type * as analytics from "../analytics.js";
import type * as caseManagement from "../caseManagement.js";
import type * as chatbotProxy from "../chatbotProxy.js";
import type * as crons from "../crons.js";
import type * as debug from "../debug.js";
import type * as directoryResearch from "../directoryResearch.js";
import type * as documentBrief from "../documentBrief.js";
import type * as formSubmissions from "../formSubmissions.js";
import type * as hakiYanguSeed from "../hakiYanguSeed.js";
import type * as hero from "../hero.js";
import type * as heros from "../heros.js";
import type * as http from "../http.js";
import type * as init from "../init.js";
import type * as intakeAudio from "../intakeAudio.js";
import type * as journeyAnalytics from "../journeyAnalytics.js";
import type * as justiceServices from "../justiceServices.js";
import type * as legalHelp from "../legalHelp.js";
import type * as lib_aiPricing from "../lib/aiPricing.js";
import type * as lib_audioDuration from "../lib/audioDuration.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_baseRoleLifecycle from "../lib/baseRoleLifecycle.js";
import type * as lib_caseLifecycle from "../lib/caseLifecycle.js";
import type * as lib_caseParticipantAccess from "../lib/caseParticipantAccess.js";
import type * as lib_caseRetry from "../lib/caseRetry.js";
import type * as lib_directoryLifecycle from "../lib/directoryLifecycle.js";
import type * as lib_geography from "../lib/geography.js";
import type * as lib_guideLifecycle from "../lib/guideLifecycle.js";
import type * as lib_guideSearch from "../lib/guideSearch.js";
import type * as lib_hakiYangu from "../lib/hakiYangu.js";
import type * as lib_journeyMetrics from "../lib/journeyMetrics.js";
import type * as lib_legalGuideContent from "../lib/legalGuideContent.js";
import type * as lib_managedUploads from "../lib/managedUploads.js";
import type * as lib_matchingAccess from "../lib/matchingAccess.js";
import type * as lib_mediaHelpers from "../lib/mediaHelpers.js";
import type * as lib_meteredAi from "../lib/meteredAi.js";
import type * as lib_notifications from "../lib/notifications.js";
import type * as lib_paralegalAccess from "../lib/paralegalAccess.js";
import type * as lib_pdfText from "../lib/pdfText.js";
import type * as lib_presence from "../lib/presence.js";
import type * as lib_publicHelpResources from "../lib/publicHelpResources.js";
import type * as lib_rateLimits from "../lib/rateLimits.js";
import type * as lib_researchEntry from "../lib/researchEntry.js";
import type * as lib_researchPdfManifest from "../lib/researchPdfManifest.js";
import type * as lib_saadaAgent from "../lib/saadaAgent.js";
import type * as lib_saadaAssistance from "../lib/saadaAssistance.js";
import type * as lib_saadaConversation from "../lib/saadaConversation.js";
import type * as lib_saadaCosts from "../lib/saadaCosts.js";
import type * as lib_saadaEvidence from "../lib/saadaEvidence.js";
import type * as lib_saadaIndexBatch from "../lib/saadaIndexBatch.js";
import type * as lib_saadaIndexRecovery from "../lib/saadaIndexRecovery.js";
import type * as lib_saadaLanguage from "../lib/saadaLanguage.js";
import type * as lib_saadaPrompt from "../lib/saadaPrompt.js";
import type * as lib_saadaSkills from "../lib/saadaSkills.js";
import type * as lib_saadaSourceLifecycle from "../lib/saadaSourceLifecycle.js";
import type * as lib_saadaSourceMetadata from "../lib/saadaSourceMetadata.js";
import type * as lib_saadaSpeech from "../lib/saadaSpeech.js";
import type * as lib_saadaUploadMetadata from "../lib/saadaUploadMetadata.js";
import type * as lib_safeContact from "../lib/safeContact.js";
import type * as lib_security from "../lib/security.js";
import type * as lib_speechStream from "../lib/speechStream.js";
import type * as lib_uploadPolicy from "../lib/uploadPolicy.js";
import type * as lib_workerMatching from "../lib/workerMatching.js";
import type * as managedUploads from "../managedUploads.js";
import type * as media from "../media.js";
import type * as migrations from "../migrations.js";
import type * as news from "../news.js";
import type * as newsletter from "../newsletter.js";
import type * as notifications from "../notifications.js";
import type * as opportunities from "../opportunities.js";
import type * as ops from "../ops.js";
import type * as paralegalLocation from "../paralegalLocation.js";
import type * as paralegalRehearsal from "../paralegalRehearsal.js";
import type * as paralegalTraining from "../paralegalTraining.js";
import type * as paralegals from "../paralegals.js";
import type * as personalDocuments from "../personalDocuments.js";
import type * as presence from "../presence.js";
import type * as presentationReadiness from "../presentationReadiness.js";
import type * as programs from "../programs.js";
import type * as providerInvitations from "../providerInvitations.js";
import type * as publications from "../publications.js";
import type * as quickLinks from "../quickLinks.js";
import type * as referrals from "../referrals.js";
import type * as reporting from "../reporting.js";
import type * as requestMessages from "../requestMessages.js";
import type * as resend from "../resend.js";
import type * as saadaActionConfirm from "../saadaActionConfirm.js";
import type * as saadaActionDrafts from "../saadaActionDrafts.js";
import type * as saadaEvaluations from "../saadaEvaluations.js";
import type * as saadaMedia from "../saadaMedia.js";
import type * as saadaMediaActions from "../saadaMediaActions.js";
import type * as saadaReadinessAudit from "../saadaReadinessAudit.js";
import type * as saadaResearchPdfs from "../saadaResearchPdfs.js";
import type * as saadaUploadReceipts from "../saadaUploadReceipts.js";
import type * as sara from "../sara.js";
import type * as sara_actions from "../sara_actions.js";
import type * as sara_chat from "../sara_chat.js";
import type * as seedContent from "../seedContent.js";
import type * as seo from "../seo.js";
import type * as settings from "../settings.js";
import type * as stats from "../stats.js";
import type * as stories from "../stories.js";
import type * as team from "../team.js";
import type * as testimonials from "../testimonials.js";
import type * as uploadRehearsal from "../uploadRehearsal.js";
import type * as users from "../users.js";
import type * as whistleblower from "../whistleblower.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  accessRequests: typeof accessRequests;
  accountDeletion: typeof accountDeletion;
  admin: typeof admin;
  aiUsage: typeof aiUsage;
  analytics: typeof analytics;
  caseManagement: typeof caseManagement;
  chatbotProxy: typeof chatbotProxy;
  crons: typeof crons;
  debug: typeof debug;
  directoryResearch: typeof directoryResearch;
  documentBrief: typeof documentBrief;
  formSubmissions: typeof formSubmissions;
  hakiYanguSeed: typeof hakiYanguSeed;
  hero: typeof hero;
  heros: typeof heros;
  http: typeof http;
  init: typeof init;
  intakeAudio: typeof intakeAudio;
  journeyAnalytics: typeof journeyAnalytics;
  justiceServices: typeof justiceServices;
  legalHelp: typeof legalHelp;
  "lib/aiPricing": typeof lib_aiPricing;
  "lib/audioDuration": typeof lib_audioDuration;
  "lib/auth": typeof lib_auth;
  "lib/baseRoleLifecycle": typeof lib_baseRoleLifecycle;
  "lib/caseLifecycle": typeof lib_caseLifecycle;
  "lib/caseParticipantAccess": typeof lib_caseParticipantAccess;
  "lib/caseRetry": typeof lib_caseRetry;
  "lib/directoryLifecycle": typeof lib_directoryLifecycle;
  "lib/geography": typeof lib_geography;
  "lib/guideLifecycle": typeof lib_guideLifecycle;
  "lib/guideSearch": typeof lib_guideSearch;
  "lib/hakiYangu": typeof lib_hakiYangu;
  "lib/journeyMetrics": typeof lib_journeyMetrics;
  "lib/legalGuideContent": typeof lib_legalGuideContent;
  "lib/managedUploads": typeof lib_managedUploads;
  "lib/matchingAccess": typeof lib_matchingAccess;
  "lib/mediaHelpers": typeof lib_mediaHelpers;
  "lib/meteredAi": typeof lib_meteredAi;
  "lib/notifications": typeof lib_notifications;
  "lib/paralegalAccess": typeof lib_paralegalAccess;
  "lib/pdfText": typeof lib_pdfText;
  "lib/presence": typeof lib_presence;
  "lib/publicHelpResources": typeof lib_publicHelpResources;
  "lib/rateLimits": typeof lib_rateLimits;
  "lib/researchEntry": typeof lib_researchEntry;
  "lib/researchPdfManifest": typeof lib_researchPdfManifest;
  "lib/saadaAgent": typeof lib_saadaAgent;
  "lib/saadaAssistance": typeof lib_saadaAssistance;
  "lib/saadaConversation": typeof lib_saadaConversation;
  "lib/saadaCosts": typeof lib_saadaCosts;
  "lib/saadaEvidence": typeof lib_saadaEvidence;
  "lib/saadaIndexBatch": typeof lib_saadaIndexBatch;
  "lib/saadaIndexRecovery": typeof lib_saadaIndexRecovery;
  "lib/saadaLanguage": typeof lib_saadaLanguage;
  "lib/saadaPrompt": typeof lib_saadaPrompt;
  "lib/saadaSkills": typeof lib_saadaSkills;
  "lib/saadaSourceLifecycle": typeof lib_saadaSourceLifecycle;
  "lib/saadaSourceMetadata": typeof lib_saadaSourceMetadata;
  "lib/saadaSpeech": typeof lib_saadaSpeech;
  "lib/saadaUploadMetadata": typeof lib_saadaUploadMetadata;
  "lib/safeContact": typeof lib_safeContact;
  "lib/security": typeof lib_security;
  "lib/speechStream": typeof lib_speechStream;
  "lib/uploadPolicy": typeof lib_uploadPolicy;
  "lib/workerMatching": typeof lib_workerMatching;
  managedUploads: typeof managedUploads;
  media: typeof media;
  migrations: typeof migrations;
  news: typeof news;
  newsletter: typeof newsletter;
  notifications: typeof notifications;
  opportunities: typeof opportunities;
  ops: typeof ops;
  paralegalLocation: typeof paralegalLocation;
  paralegalRehearsal: typeof paralegalRehearsal;
  paralegalTraining: typeof paralegalTraining;
  paralegals: typeof paralegals;
  personalDocuments: typeof personalDocuments;
  presence: typeof presence;
  presentationReadiness: typeof presentationReadiness;
  programs: typeof programs;
  providerInvitations: typeof providerInvitations;
  publications: typeof publications;
  quickLinks: typeof quickLinks;
  referrals: typeof referrals;
  reporting: typeof reporting;
  requestMessages: typeof requestMessages;
  resend: typeof resend;
  saadaActionConfirm: typeof saadaActionConfirm;
  saadaActionDrafts: typeof saadaActionDrafts;
  saadaEvaluations: typeof saadaEvaluations;
  saadaMedia: typeof saadaMedia;
  saadaMediaActions: typeof saadaMediaActions;
  saadaReadinessAudit: typeof saadaReadinessAudit;
  saadaResearchPdfs: typeof saadaResearchPdfs;
  saadaUploadReceipts: typeof saadaUploadReceipts;
  sara: typeof sara;
  sara_actions: typeof sara_actions;
  sara_chat: typeof sara_chat;
  seedContent: typeof seedContent;
  seo: typeof seo;
  settings: typeof settings;
  stats: typeof stats;
  stories: typeof stories;
  team: typeof team;
  testimonials: typeof testimonials;
  uploadRehearsal: typeof uploadRehearsal;
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
