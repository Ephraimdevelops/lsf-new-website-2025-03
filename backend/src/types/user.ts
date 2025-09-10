import { User } from "@supabase/supabase-js";

export interface ExtendedUser extends User {
  banned?: boolean;
  role?: string;
}

export type AdminUserAttributes = {
  email?: string;
  phone?: string;
  password?: string;
  email_confirm?: boolean;
  phone_confirm?: boolean;
  user_metadata?: {
    role?: string;
    banned?: boolean;
    [key: string]: any;
  };
  app_metadata?: {
    role?: string;
    [key: string]: any;
  };
}
