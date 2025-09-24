"use client";

import React, { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/context/SessionContext";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();
  const { session, isGuest, signInAsGuest } = useSession();

  useEffect(() => {
    if (session || isGuest) {
      navigate("/");
    }
  }, [session, isGuest, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Welcome Back!</CardTitle>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            providers={["google"]} // Explicitly only enable Google as an auth provider
            view="sign_in" // Ensure we are on the sign-in view
            showLinks={false} // Disable all other links like "Sign up" or "Forgot password"
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--primary))',
                    brandAccent: 'hsl(var(--primary-foreground))',
                    brandButtonText: 'hsl(var(--primary-foreground))',
                    defaultButtonBackground: 'hsl(var(--secondary))',
                    defaultButtonBackgroundHover: 'hsl(var(--secondary-foreground))',
                    defaultButtonBorder: 'hsl(var(--border))',
                    defaultButtonText: 'hsl(var(--foreground))',
                    inputBackground: 'hsl(var(--input))',
                    inputBorder: 'hsl(var(--border))',
                    inputBorderHover: 'hsl(var(--ring))',
                    inputBorderFocus: 'hsl(var(--ring))',
                    inputText: 'hsl(var(--foreground))',
                    inputLabelText: 'hsl(var(--muted-foreground))',
                    messageText: 'hsl(var(--foreground))',
                    messageBackground: 'hsl(var(--background))',
                    messageBorder: 'hsl(var(--border))',
                    anchorText: 'hsl(var(--primary))',
                    anchorTextHover: 'hsl(var(--primary-foreground))',
                  },
                },
                dark: {
                  colors: {
                    brand: 'hsl(var(--primary))',
                    brandAccent: 'hsl(var(--primary-foreground))',
                    brandButtonText: 'hsl(var(--primary-foreground))',
                    defaultButtonBackground: 'hsl(var(--secondary))',
                    defaultButtonBackgroundHover: 'hsl(var(--secondary-foreground))',
                    defaultButtonBorder: 'hsl(var(--border))',
                    defaultButtonText: 'hsl(var(--foreground))',
                    inputBackground: 'hsl(var(--input))',
                    inputBorder: 'hsl(var(--border))',
                    inputBorderHover: 'hsl(var(--ring))',
                    inputBorderFocus: 'hsl(var(--ring))',
                    inputText: 'hsl(var(--foreground))',
                    inputLabelText: 'hsl(var(--muted-foreground))',
                    messageText: 'hsl(var(--foreground))',
                    messageBackground: 'hsl(var(--background))',
                    messageBorder: 'hsl(var(--border))',
                    anchorText: 'hsl(var(--primary))',
                    anchorTextHover: 'hsl(var(--primary-foreground))',
                  },
                },
              },
            }}
            theme="dark"
          />
        </CardContent>
        <CardFooter className="flex justify-center pt-4">
          <Button variant="outline" onClick={signInAsGuest} className="w-full">
            Continue as Guest
          </Button>
        </CardFooter>
      </Card>
      <MadeWithDyad />
    </div>
  );
};

export default Login;