"use client";

import React from "react";
import { useSettings } from "@/context/SettingsContext";
import { Card, CardContent } from "@/components/ui/card";
import PrinterProfileManager from "@/components/PrinterProfileManager";
import MaterialProfileManager from "@/components/MaterialProfileManager";
import Credits from "@/components/Credits";
import SettingsHeader from "@/components/settings/SettingsHeader";
import PrintCalculatorDefaultsSection from "@/components/settings/PrintCalculatorDefaultsSection";
import AdvancedSettingsSection from "@/components/settings/AdvancedSettingsSection";
import SettingsFooter from "@/components/settings/SettingsFooter";
import { useSession } from "@/context/SessionContext";
import DonationSection from "@/components/DonationSection";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const {
    printCalculatorSettings,
    updatePrintCalculatorSettings,
    PRINTER_PROFILES,
    MATERIAL_PROFILES,
    customElectricityCost,
    setCustomElectricityCost,
    customCurrency,
    setCustomCurrency,
  } = useSettings();
  const { isGuest } = useSession();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <SettingsHeader />
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PrintCalculatorDefaultsSection
            printCalculatorSettings={printCalculatorSettings}
            updatePrintCalculatorSettings={updatePrintCalculatorSettings}
            PRINTER_PROFILES={PRINTER_PROFILES}
            MATERIAL_PROFILES={MATERIAL_PROFILES}
            customElectricityCost={customElectricityCost}
            setCustomElectricityCost={setCustomElectricityCost}
            customCurrency={customCurrency}
            setCustomCurrency={setCustomCurrency}
          />
          <AdvancedSettingsSection
            printCalculatorSettings={printCalculatorSettings}
            updatePrintCalculatorSettings={updatePrintCalculatorSettings}
          />
        </CardContent>
        <SettingsFooter />
      </Card>

      <div className="w-full max-w-2xl mt-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">{t('settings.advancedProfileManagement')}</h2>
        {isGuest && (
          <p className="text-center text-red-500 dark:text-red-400">
            {t('settings.loginToManageProfiles')}
          </p>
        )}
        <PrinterProfileManager />
        <MaterialProfileManager />
      </div>

      <DonationSection />
      <Credits />
    </div>
  );
};

export default Settings;