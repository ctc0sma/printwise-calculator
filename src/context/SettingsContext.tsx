"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface PrintCalculatorSettings {
  materialCostPerKg: number;
  objectWeightGrams: number;
  printTimeHours: number;
  electricityCostPerKWh: number;
  printerPowerWatts: number;
  laborHourlyRate: number;
  designSetupFee: number;
  profitMarginPercentage: number;
}

interface SettingsContextType {
  printCalculatorSettings: PrintCalculatorSettings;
  updatePrintCalculatorSettings: (newSettings: Partial<PrintCalculatorSettings>) => void;
}

const defaultPrintCalculatorSettings: PrintCalculatorSettings = {
  materialCostPerKg: 20,
  objectWeightGrams: 100,
  printTimeHours: 5,
  electricityCostPerKWh: 0.15,
  printerPowerWatts: 100,
  laborHourlyRate: 25,
  designSetupFee: 5,
  profitMarginPercentage: 20,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [printCalculatorSettings, setPrintCalculatorSettings] = useState<PrintCalculatorSettings>(
    defaultPrintCalculatorSettings
  );

  const updatePrintCalculatorSettings = (newSettings: Partial<PrintCalculatorSettings>) => {
    setPrintCalculatorSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));
  };

  return (
    <SettingsContext.Provider value={{ printCalculatorSettings, updatePrintCalculatorSettings }}>
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