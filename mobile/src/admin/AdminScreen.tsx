import { StakeholderNavigation } from '../stakeholder/StakeholderNavigation';
import { useQuery } from "convex/react";
import { api } from "../backend/api";
import type { ComponentProps } from "react";
import { Screen } from "../components/Screen";
import { EditorNavigation } from "../editorial/EditorNavigation";
import { SafeguardingNavigation } from "../safeguarding/SafeguardingNavigation";
import { StaffNavigation } from "../staff/StaffNavigation";
import { SupervisorNavigation } from "../supervisor/SupervisorNavigation";
import { AdminNavigation } from "./AdminNavigation";

export function AdminScreen(props: ComponentProps<typeof Screen>) {
  const access = useQuery(api.users.currentAccess);
  return <Screen {...props} footer={props.footer ?? (access?.roles.includes("admin") ? <AdminNavigation /> : access?.roles.includes("supervisor") ? <SupervisorNavigation /> : access?.roles.includes("staff") ? <StaffNavigation /> : access?.roles.includes("safeguarding_officer") ? <SafeguardingNavigation /> : access?.roles.includes("content_editor") ? <EditorNavigation /> : access?.roles.some(role=>role === "stakeholder" || role === "donor") ? <StakeholderNavigation /> : undefined)} />;
}
