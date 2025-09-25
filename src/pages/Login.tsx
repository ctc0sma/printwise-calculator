"use client";

import React, { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/context/SessionContext";
import { useTranslation } from "react-i18next"; // Import useTranslation

const Login = () => {
  const navigate = useNavigate();
  const { session } = useSession();
  const { t } = useTranslation(); // Initialize useTranslation

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
          {t('common.loginToSave')}
        </h1>
        <Auth
          supabaseClient={supabase}
          providers={["google"]}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(0 72% 51%)', // A vibrant red for the main brand color
                  brandAccent: 'hsl(0 72% 41%)', // A slightly darker red for accents
                },
              },
            },
          }}
          theme="dark"
          redirectTo={window.location.origin + "/settings"}
        />
      </div>
    </div>
  );
};

export default Login;