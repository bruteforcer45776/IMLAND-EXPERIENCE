import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  email: string | null;
  city: string | null;
  province: string | null;
  interests: string[];
  member_id: string;
  membership_status: string;
  member_since: string;
  qr_token: string;
  referral_code: string;
  referred_by: string | null;
  notify_in_app: boolean;
  notify_email: boolean;
};

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const resetAuthState = () => {
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
  };

  const load = async (uid: string | undefined) => {
    if (!isSupabaseConfigured) {
      resetAuthState();
      return;
    }
    if (!uid) {
      resetAuthState();
      return;
    }
    const [{ data: p }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", uid),
    ]);
    setProfile((p as Profile) ?? null);
    setIsAdmin(Boolean(roles?.some((r) => r.role === "admin")));
  };

  useEffect(() => {
    let active = true;

    if (!isSupabaseConfigured) {
      resetAuthState();
      setLoading(false);
      return () => {
        active = false;
      };
    }

    // getUser() valida il JWT lato server; getSession() restituisce solo il token locale
    supabase.auth
      .getUser()
      .then(async ({ data: userData, error }) => {
        if (!active) return;
        if (error || !userData.user) {
          resetAuthState();
          setLoading(false);
          return;
        }
        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData.session);
        await load(sessionData.session?.user.id ?? userData.user.id);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        resetAuthState();
        setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      if (event === "SIGNED_OUT") {
        setProfile(null);
        setIsAdmin(false);
        return;
      }
      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        void load(next?.user.id);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value: AuthState = {
    session,
    user: session?.user ?? null,
    profile,
    isAdmin,
    loading,
    refresh: async () => load(session?.user.id),
    signOut: async () => {
      await queryClient.cancelQueries();
      queryClient.clear();
      if (!isSupabaseConfigured) {
        resetAuthState();
        return;
      }
      await supabase.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve essere usato dentro AuthProvider");
  return ctx;
}
