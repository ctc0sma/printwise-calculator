"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher"; // Import LanguageSwitcher
import { useTranslation } from "react-i18next"; // Import useTranslation

const HomeHeader = () => {
  const { t } = useTranslation(); // Initialize useTranslation

  return (
    <div className="flex items-center justify-between w-full max-w-2xl p-4 mb-8">
      {/* Empty div for spacing on the left, to push title to center and buttons to right */}
      <div className="flex-grow"></div> 
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 text-center flex-grow-0">
        {t('home.welcomeTitle')} {/* Use translated text */}
      </h1>
      <div className="flex space-x-2 flex-grow justify-end"> {/* flex-grow and justify-end pushes buttons to the right */}
        <ThemeToggle />
        <LanguageSwitcher /> {/* Add LanguageSwitcher */}
        <Link to="/settings">
          <Button variant="outline" size="icon">
            <SettingsIcon className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomeHeader;