"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner"; // Import toast for notifications

interface PrintCalculatorSettings {
  materialCostPerKg: number; // This will be cost per Kg for filament, or cost per Liter for resin
  objectWeightGrams: number; // This will be weight in grams for filament, or volume in ml for resin
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
  selectedFilamentProfile: string; // Renamed to selectedMaterialProfile in practice, but keeping for now
  printType: 'filament' | 'resin'; // New: Type of printing
  supportMaterialCost: number; // New: Cost for support material (e.g., per print or fixed)
  postProcessingMaterialCost: number; // New: Cost for post-processing materials (e.g., fixed per print)
  selectedCountry: string; // New: Selected country for electricity cost
}

// Predefined printer profiles for the dropdown
export const PRINTER_PROFILES = [
  { name: "Ender 3", powerWatts: 150, type: 'filament' },
  { name: "Prusa i3 MK3S+", powerWatts: 240, type: 'filament' },
  { name: "Anycubic Kobra 2 Pro", powerWatts: 400, type: 'filament' },
  { name: "Bambu Lab P1P", powerWatts: 350, type: 'filament' },
  { name: "Creality K1", powerWatts: 350, type: 'filament' },
  { name: "Ultimaker S5", powerWatts: 500, type: 'filament' }, // Assuming filament for now
  { name: "Raise3D Pro3", powerWatts: 600, type: 'filament' }, // Assuming filament for now
  { name: "FlashForge Adventurer 3", powerWatts: 150, type: 'filament' },
  { name: "Elegoo Neptune 4 Pro", powerWatts: 300, type: 'filament' },
  { name: "Formlabs Form 3+", powerWatts: 250, type: 'resin' },
  { name: "Creality Ender 5 Plus", powerWatts: 450, type: 'filament' },
  { name: "Anycubic Photon Mono X", powerWatts: 120, type: 'resin' },
  { name: "Prusa XL", powerWatts: 700, type: 'filament' },
  { name: "Elegoo Saturn 2", powerWatts: 150, type: 'resin' },
  { name: "Custom Printer", powerWatts: 0, type: 'both' }, // Placeholder for custom input
];

// Predefined material profiles for the dropdown (renamed from FILAMENT_PROFILES)
export const MATERIAL_PROFILES = [
  { name: "PLA", costPerKg: 20, type: 'filament' },
  { name: "PETG", costPerKg: 25, type: 'filament' },
  { name: "ABS", costPerKg: 30, type: 'filament' },
  { name: "TPU", costPerKg: 35, type: 'filament' },
  { name: "Nylon", costPerKg: 40, type: 'filament' },
  { name: "Custom Filament", costPerKg: 0, type: 'filament' }, // Placeholder for custom input
  { name: "Resin (Standard)", costPerKg: 50, type: 'resin' }, // Cost per Liter for resin
  { name: "Custom Resin", costPerKg: 0, type: 'resin' }, // Placeholder for custom input (cost per Liter)
];

// Predefined country electricity costs
export const COUNTRY_ELECTRICITY_COSTS = [
  { name: "United States", costPerKWh: 0.17, currency: "$" },
  { name: "Canada", costPerKWh: 0.13, currency: "$" },
  { name: "United Kingdom", costPerKWh: 0.34, currency: "£" },
  { name: "Germany", costPerKWh: 0.40, currency: "€" },
  { name: "Australia", costPerKWh: 0.25, currency: "$" },
  { name: "Japan", costPerKWh: 0.27, currency: "¥" },
  { name: "Custom Country", costPerKWh: 0.15, currency: "$" }, // Default custom value
];

// Default settings as a constant
const defaultPrintCalculatorSettings: PrintCalculatorSettings = {
  materialCostPerKg: MATERIAL_PROFILES.find(p => p.name === "PLA")?.costPerKg || 0, // Default to PLA cost
  objectWeightGrams: 100,
  printTimeHours: 5,
  electricityCostPerKWh: COUNTRY_ELECTRICITY_COSTS.find(c => c.name === "United States")?.costPerKWh || 0.15, // Default to US cost
  printerPowerWatts: PRINTER_PROFILES.find(p => p.name === "Ender 3")?.powerWatts || 0, // Default to Ender 3 power
  laborHourlyRate: 25,
  designSetupFee: 5,
  profitMarginPercentage: 20,
  currency: COUNTRY_ELECTRICITY_COSTS.find(c => c.name === "United States")?.currency || "$", // Default to US currency
  printerDepreciationHourly: 1.5,
  failedPrintRatePercentage: 5,
  selectedPrinterProfile: "Ender 3", // Default to a filament printer
  selectedFilamentProfile: "PLA", // Default to a filament material
  printType: 'filament', // Default print type
  supportMaterialCost: 0, // Default support material cost
  postProcessingMaterialCost: 0, // Default post-processing material cost
  selectedCountry: "United States", // Default country
};

interface SettingsContextType {
  printCalculatorSettings: PrintCalculatorSettings;
  updatePrintCalculatorSettings: (newSettings: Partial<PrintCalculatorSettings>) => void;
  resetPrintCalculatorSettings: () => void;
}

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

      // Handle printType change
      if (newSettings.printType !== undefined && newSettings.printType !== prevSettings.printType) {
        const newPrintType = newSettings.printType;

        // Reset printer profile to a default compatible with the new print type
        const defaultPrinterForType = PRINTER_PROFILES.find(p => p.type === newPrintType || p.type === 'both');
        if (defaultPrinterForType) {
          updatedSettings.selectedPrinterProfile = defaultPrinterForType.name;
          updatedSettings.printerPowerWatts = defaultPrinterForType.powerWatts;
        } else {
          // Fallback if no specific printer found, e.g., to Custom Printer
          updatedSettings.selectedPrinterProfile = "Custom Printer";
          updatedSettings.printerPowerWatts = 0;
        }

        // Reset material profile to a default compatible with the new print type
        const defaultMaterialForType = MATERIAL_PROFILES.find(m => m.type === newPrintType);
        if (defaultMaterialForType) {
          updatedSettings.selectedFilamentProfile = defaultMaterialForType.name;
          updatedSettings.materialCostPerKg = defaultMaterialForType.costPerKg;
        } else {
          // Fallback to custom material for the type
          updatedSettings.selectedFilamentProfile = newPrintType === 'filament' ? "Custom Filament" : "Custom Resin";
          updatedSettings.materialCostPerKg = 0;
        }
      }

      // Handle printer profile change (if not already handled by printType change)
      if (newSettings.selectedPrinterProfile !== undefined && newSettings.selectedPrinterProfile !== prevSettings.selectedPrinterProfile) {
        const selectedProfile = PRINTER_PROFILES.find(p => p.name === newSettings.selectedPrinterProfile);
        if (selectedProfile && selectedProfile.name !== "Custom Printer") {
          updatedSettings.printerPowerWatts = selectedProfile.powerWatts;
        } else if (selectedProfile && selectedProfile.name === "Custom Printer" && newSettings.printerPowerWatts === undefined) {
          updatedSettings.printerPowerWatts = prevSettings.selectedPrinterProfile === "Custom Printer" ? prevSettings.printerPowerWatts : 0;
        }
      }

      // Handle material profile change (if not already handled by printType change)
      if (newSettings.selectedFilamentProfile !== undefined && newSettings.selectedFilamentProfile !== prevSettings.selectedFilamentProfile) {
        const selectedMaterial = MATERIAL_PROFILES.find(f => f.name === newSettings.selectedFilamentProfile);
        if (selectedMaterial && (selectedMaterial.name !== "Custom Filament" && selectedMaterial.name !== "Custom Resin")) {
          updatedSettings.materialCostPerKg = selectedMaterial.costPerKg;
        } else if (selectedMaterial && (selectedMaterial.name === "Custom Filament" || selectedMaterial.name === "Custom Resin") && newSettings.materialCostPerKg === undefined) {
          updatedSettings.materialCostPerKg = (prevSettings.selectedFilamentProfile === "Custom Filament" || prevSettings.selectedFilamentProfile === "Custom Resin") ? prevSettings.materialCostPerKg : 0;
        }
      }

      // Handle country change
      if (newSettings.selectedCountry !== undefined && newSettings.selectedCountry !== prevSettings.selectedCountry) {
        const selectedCountryData = COUNTRY_ELECTRICITY_COSTS.find(c => c.name === newSettings.selectedCountry);
        if (selectedCountryData) {
          updatedSettings.electricityCostPerKWh = selectedCountryData.costPerKWh;
          updatedSettings.currency = selectedCountryData.currency;
        } else {
          // Fallback for custom country or if not found
          updatedSettings.electricityCostPerKWh = 0.15; // Default to a common value
          updatedSettings.currency = "$"; // Default currency
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