"use client";

import React, { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/context/SessionContext";

const Login = () => {
  const navigate = useNavigate();
  const { session } = useSession();

  useEffect(() => {
    if (session) {
      // If a user is already logged in, redirect them to the home page
      navigate("/home");
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
          Sign In to Save Your Profiles
        </h1>
        <Auth
          supabaseClient={supabase}
          providers={["google"]} // Enable Google as an auth provider
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary-foreground))',
                },
              },
            },
          }}
          theme="dark" // Use dark theme for Auth UI
          redirectTo={window.location.origin + "/settings"} // Redirect to settings after login
          magicLink={false} // Disable magic link (email) sign-in
          onlyThirdPartyProviders={true} // Explicitly show only third-party providers
        />
      </div>
    </div>
  );
};

export default Login;