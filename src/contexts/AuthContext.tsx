import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type UserRole = "admin" | "student";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  profile: any;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();
      
      if (roleError) {
        console.error("Error fetching role:", roleError);
      } else if (roleData) {
        setRole(roleData.role as UserRole);
      }

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
      } else if (profileData) {
        setProfile(profileData);
      } else {
        // Profile might not exist yet, try to create it from user metadata
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user?.user_metadata) {
          const metadata = userData.user.user_metadata;
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              user_id: userId,
              email: userData.user.email,
              full_name: metadata.full_name || '',
              father_name: metadata.father_name || '',
              mobile: metadata.mobile || '',
              gender: metadata.gender || '',
              class: metadata.class || '',
            });
          
          if (!insertError) {
            // Fetch the newly created profile
            const { data: newProfile } = await supabase
              .from("profiles")
              .select("*")
              .eq("user_id", userId)
              .maybeSingle();
            if (newProfile) setProfile(newProfile);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchUserData(user.id);
  };

  useEffect(() => {
    // First get session, then set up listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          // Use setTimeout to avoid Supabase deadlock
          setTimeout(() => fetchUserData(session.user.id), 0);
        } else {
          setRole(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // Ignore signout errors (e.g. refresh token not found)
    }
    setUser(null);
    setSession(null);
    setRole(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}