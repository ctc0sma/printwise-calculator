"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { useSettings } from "@/context/SettingsContext";
import { useTranslation } from "react-i18next"; // Import useTranslation

const SettingsFooter = () => {
  const { resetPrintCalculatorSettings } = useSettings();
  const { t } = useTranslation(); // Initialize useTranslation

  const handleSave = () => {
    toast.success(t('settings.settingsSaved'));
  };

  return (
    <CardFooter className="flex justify-between p-6">
      <Button variant="outline" onClick={resetPrintCalculatorSettings}>{t('settings.resetToDefaults')}</Button>
      <Button onClick={handleSave}>{t('settings.saveSettings')}</Button>
    </CardFooter>
  );
};

export default SettingsFooter;