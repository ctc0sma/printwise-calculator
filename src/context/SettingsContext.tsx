"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface PrintCalculatorSettings {
  materialCostPerKg: number;
  objectWeightGrams: number;
  printTimeHours: number;
  electricityCostPerKWh: number;
  printerPowerWatts: number; // This will now be derived from selectedPrinterProfile or custom input
  laborHourlyRate: number;
  designSetupFee: number;
  profitMarginPercentage: number;
  currency: string;
  printerDepreciationHourly: number;
  failedPrintRatePercentage: number;
  selectedPrinterProfile: string; // New: Stores the name of the selected printer profile
}

interface SettingsContextType {
  printCalculatorSettings: PrintCalculatorSettings;
  updatePrintCalculatorSettings: (newSettings: Partial<PrintCalculatorSettings>) => void;
  resetPrintCalculatorSettings: () => void; // New: Function to reset settings
}

// Predefined printer profiles for the dropdown
export const PRINTER_PROFILES = [
  { name: "Ender 3", powerWatts: 150 },
  { name: "Prusa i3 MK3S+", powerWatts: 240 },
  { name: "Anycubic Kobra 2 Pro", powerWatts: 400 },
  { name: "Bambu Lab P1P", powerWatts: 350 },
  { name: "Creality K1", powerWatts: 350 },
  { name: "Ultimaker S5", powerWatts: 500 },
  { name: "Formlabs Form 3+", powerWatts: 250 },
  { name: "Raise3D Pro3", powerWatts: 600 },
  { name: "FlashForge Adventurer 3", powerWatts: 150 },
  { name: "Elegoo Neptune 4 Pro", powerWatts: 300 },
  { name: "Custom Printer", powerWatts: 0 }, // Placeholder for custom input
];

// Default settings as a constant
const defaultPrintCalculatorSettings: PrintCalculatorSettings = {
  materialCostPerKg: 20,
  objectWeightGrams: 100,
  printTimeHours: 5,
  electricityCostPerKWh: 0.15,
  printerPowerWatts: PRINTER_PROFILES[0].powerWatts, // Default to the first printer's power
  laborHourlyRate: 25,
  designSetupFee: 5,
  profitMarginPercentage: 20,
  currency: "$",
  printerDepreciationHourly: 1.5,
  failedPrintRatePercentage: 5,
  selectedPrinterProfile: PRINTER_PROFILES[0].name, // Default to the first printer
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "printCalculatorSettings";

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [printCalculatorSettings, setPrintCalculatorSettings] = useState<PrintCalculatorSettings>(() => {
    // Initialize state from localStorage or use defaults
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedSettings) {
        return { ...defaultPrintCalculatorSettings, ...JSON.parse(savedSettings) };
      }
    }
    return defaultPrintCalculatorSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(printCalculatorSettings));
    }
  }, [printCalculatorSettings]);

  const updatePrintCalculatorSettings = (newSettings: Partial<PrintCalculatorSettings>) => {
    setPrintCalculatorSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));
  };

  const resetPrintCalculatorSettings = () => {
    setPrintCalculatorSettings(defaultPrintCalculatorSettings);
    toast.success("Settings reset to defaults!");
  };

  return (
    <SettingsContext.Provider value={{ printCalculatorSettings, updatePrintCalculatorSettings, resetPrintCalculatorSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};