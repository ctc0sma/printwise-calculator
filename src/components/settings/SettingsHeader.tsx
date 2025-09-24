"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogIn, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSession } from "@/context/SessionContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SettingsHeader = () => {
  const { isGuest } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out.");
    } else {
      toast.success("Logged out successfully!");
      navigate("/settings");
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
      <Link to="/">
        <Button variant="outline" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>
      <h1 className="text-2xl md:text-3xl font-bold text-center flex-grow mx-4">Application Settings</h1>
      <div className="flex space-x-2">
        <ThemeToggle />
        {isGuest ? (
          <Link to="/login">
            <Button variant="outline" size="icon">
              <LogIn className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SettingsHeader;