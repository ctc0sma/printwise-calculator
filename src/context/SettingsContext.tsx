"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner"; // Import toast for notifications

interface PrintCalculatorSettings {
  materialCostPerKg: number;
  objectWeightGrams: number;
  printTimeHours: number;
  electricityCostPerKWh: number;
  printerPowerWatts: number;
  laborHourlyRate: number;
  designSetupFee: number;
  profitMarginPercentage: number;
  currency: string;
  printerDepreciationHourly: number;
  failedPrintRatePercentage: number;
  selectedPrinterProfile: string;
  selectedFilamentProfile: string; // New: Stores the name of the selected filament profile
}

interface SettingsContextType {
  printCalculatorSettings: PrintCalculatorSettings;
  updatePrintCalculatorSettings: (newSettings: Partial<PrintCalculatorSettings>) => void;
  resetPrintCalculatorSettings: () => void;
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

// Predefined filament profiles for the dropdown
export const FILAMENT_PROFILES = [
  { name: "PLA", costPerKg: 20 },
  { name: "PETG", costPerKg: 25 },
  { name: "ABS", costPerKg: 30 },
  { name: "TPU", costPerKg: 35 },
  { name: "Nylon", costPerKg: 40 },
  { name: "Resin (Standard)", costPerKg: 50 },
  { name: "Custom Filament", costPerKg: 0 }, // Placeholder for custom input
];

// Default settings as a constant
const defaultPrintCalculatorSettings: PrintCalculatorSettings = {
  materialCostPerKg: FILAMENT_PROFILES[0].costPerKg, // Default to the first filament's cost
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
  selectedFilamentProfile: FILAMENT_PROFILES[0].name, // Default to the first filament
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "printCalculatorSettings";

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [printCalculatorSettings, setPrintCalculatorSettings] = useState<PrintCalculatorSettings>(() => {
    // Initialize state from localStorage or use defaults
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        // Ensure new settings fields are included if they weren't in saved data
        return { ...defaultPrintCalculatorSettings, ...parsedSettings };
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
    setPrintCalculatorSettings((prevSettings) => {
      let updatedSettings = { ...prevSettings, ...newSettings };

      // Handle printer profile change
      if (newSettings.selectedPrinterProfile !== undefined && newSettings.selectedPrinterProfile !== prevSettings.selectedPrinterProfile) {
        const selectedProfile = PRINTER_PROFILES.find(p => p.name === newSettings.selectedPrinterProfile);
        if (selectedProfile && selectedProfile.name !== "Custom Printer") {
          updatedSettings.printerPowerWatts = selectedProfile.powerWatts;
        } else if (selectedProfile && selectedProfile.name === "Custom Printer" && newSettings.printerPowerWatts === undefined) {
          // If switching to custom, and no custom power is provided, keep previous custom power or set to 0
          updatedSettings.printerPowerWatts = prevSettings.selectedPrinterProfile === "Custom Printer" ? prevSettings.printerPowerWatts : 0;
        }
      }

      // Handle filament profile change
      if (newSettings.selectedFilamentProfile !== undefined && newSettings.selectedFilamentProfile !== prevSettings.selectedFilamentProfile) {
        const selectedFilament = FILAMENT_PROFILES.find(f => f.name === newSettings.selectedFilamentProfile);
        if (selectedFilament && selectedFilament.name !== "Custom Filament") {
          updatedSettings.materialCostPerKg = selectedFilament.costPerKg;
        } else if (selectedFilament && selectedFilament.name === "Custom Filament" && newSettings.materialCostPerKg === undefined) {
          // If switching to custom, and no custom cost is provided, keep previous custom cost or set to 0
          updatedSettings.materialCostPerKg = prevSettings.selectedFilamentProfile === "Custom Filament" ? prevSettings.materialCostPerKg : 0;
        }
      }
      
      return updatedSettings;
    });
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