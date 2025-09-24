"use client";

import React, { useState, useEffect } from "react";
import { useSettings, COUNTRY_ELECTRICITY_COSTS } from "@/context/SettingsContext";
import { Card, CardContent } from "@/components/ui/card";
import PrinterProfileManager from "@/components/PrinterProfileManager";
import MaterialProfileManager from "@/components/MaterialProfileManager";
import Credits from "@/components/Credits";
import SettingsHeader from "@/components/settings/SettingsHeader";
import PrintCalculatorDefaultsSection from "@/components/settings/PrintCalculatorDefaultsSection";
import AdvancedSettingsSection from "@/components/settings/AdvancedSettingsSection";
import SettingsFooter from "@/components/settings/SettingsFooter";
import { useSession } from "@/context/SessionContext";
import { Link } from "react-router-dom";
import DonationSection from "@/components/DonationSection"; // Import the new DonationSection

const Settings = () => {
  const {
    printCalculatorSettings,
    updatePrintCalculatorSettings,
    resetPrintCalculatorSettings,
    PRINTER_PROFILES,
    MATERIAL_PROFILES,
  } = useSettings();
  const { isGuest } = useSession();

  // Local states for custom electricity cost and currency, managed here and passed down
  const [customElectricityCost, setCustomElectricityCost] = useState<number>(
    printCalculatorSettings.selectedCountry === "Custom Country"
      ? printCalculatorSettings.electricityCostPerKWh
      : 0
  );
  const [customCurrency, setCustomCurrency] = useState<string>(
    printCalculatorSettings.selectedCountry === "Custom Country"
      ? printCalculatorSettings.currency
      : "$"
  );

  // Update local states when context defaults change (e.g., after reset)
  useEffect(() => {
    if (printCalculatorSettings.selectedCountry === "Custom Country") {
      setCustomElectricityCost(printCalculatorSettings.electricityCostPerKWh);
      setCustomCurrency(printCalculatorSettings.currency);
    }
  }, [
    printCalculatorSettings.electricityCostPerKWh,
    printCalculatorSettings.currency,
    printCalculatorSettings.selectedCountry,
  ]);

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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">Advanced Profile Management</h2>
        {isGuest && (
          <p className="text-center text-red-500 dark:text-red-400">
            Please <Link to="/login" className="underline">log in</Link> to add, edit, or delete custom profiles.
          </p>
        )}
        <PrinterProfileManager />
        <MaterialProfileManager />
      </div>

      <Credits />
      <DonationSection /> {/* Added the new DonationSection here */}
    </div>
  );
};

export default Settings;