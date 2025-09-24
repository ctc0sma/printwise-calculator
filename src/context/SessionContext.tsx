"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";

interface SessionContextType {
  session: Session | null;
  loading: boolean;
  isGuest: boolean;
  signInAsGuest: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const LOCAL_STORAGE_GUEST_KEY = "isGuest";

export const SessionContextProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const signInAsGuest = () => {
    localStorage.setItem(LOCAL_STORAGE_GUEST_KEY, "true");
    setIsGuest(true);
    navigate("/");
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setLoading(false);
      setIsGuest(localStorage.getItem(LOCAL_STORAGE_GUEST_KEY) === "true" && !currentSession);

      // Redirect logic
      if (currentSession || isGuest) {
        if (location.pathname === "/login") {
          navigate("/"); // Redirect authenticated users or guests from login to home
        }
      } else if (!currentSession && !isGuest) {
        if (location.pathname !== "/login") {
          navigate("/login"); // Redirect unauthenticated, non-guest users to login
        }
      }
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      const storedIsGuest = localStorage.getItem(LOCAL_STORAGE_GUEST_KEY) === "true";
      setSession(initialSession);
      setIsGuest(storedIsGuest && !initialSession);
      setLoading(false);

      if (initialSession || storedIsGuest) {
        if (location.pathname === "/login") {
          navigate("/");
        }
      } else if (!initialSession && !storedIsGuest) {
        if (location.pathname !== "/login") {
          navigate("/login");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname, isGuest]); // Added isGuest to dependency array

  return (
    <SessionContext.Provider value={{ session, loading, isGuest, signInAsGuest }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionContextProvider");
  }
  return context;
};