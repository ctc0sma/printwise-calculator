"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { toast } from "sonner"; // Import toast for notifications
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/context/SessionContext";

interface PrinterProfile {
  id?: string; // Optional for new profiles, required for existing
  name: string;
  powerWatts: number;
  type: 'filament' | 'resin' | 'both';
  isCustom?: boolean; // To distinguish user-defined from predefined
}

interface MaterialProfile {
  id?: string; // Optional for new profiles, required for existing
  name: string;
  costPerKg: number; // This will be cost per Kg for filament, or cost per Liter for resin
  type: 'filament' | 'resin';
  isCustom?: boolean; // To distinguish user-defined from predefined
}

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
  selectedFilamentProfile: string;
  printType: 'filament' | 'resin'; // New: Type of printing
  supportMaterialCost: number; // New: Cost for support material (e.g., per print or fixed)
  postProcessingMaterialCost: number; // New: Cost for post-processing materials (e.g., fixed per print)
  selectedCountry: string; // New: Selected country for electricity cost
  pdfExportMode: 'standard' | 'professional'; // Changed from isCompanyMode: boolean
  companyName: string; // New: Company name for PDF export
  companyAddress: string; // New: Company address for PDF export
  companyLogoUrl: string; // New: Company logo URL for PDF export
  projectName: string; // New: Project name for PDF export
}

// Predefined printer profiles for the dropdown
export const PREDEFINED_PRINTER_PROFILES: PrinterProfile[] = [
  { name: "Ender 3", powerWatts: 150, type: 'filament' },
  { name: "Prusa i3 MK3S+", powerWatts: 240, type: 'filament' },
  { name: "Anycubic Kobra 2 Pro", powerWatts: 400, type: 'filament' },
  { name: "Bambu Lab P1P", powerWatts: 350, type: 'filament' },
  { name: "Bambu Lab X1C", powerWatts: 1000, type: 'filament' },
  { name: "Creality K1", powerWatts: 350, type: 'filament' },
  { name: "Ultimaker S5", powerWatts: 500, type: 'filament' },
  { name: "Raise3D Pro3", powerWatts: 600, type: 'filament' },
  { name: "FlashForge Adventurer 3", powerWatts: 150, type: 'filament' },
  { name: "Elegoo Neptune 4 Pro", powerWatts: 300, type: 'filament' },
  { name: "Formlabs Form 3+", powerWatts: 250, type: 'resin' },
  { name: "Creality Ender 5 Plus", powerWatts: 450, type: 'filament' },
  { name: "Anycubic Photon Mono X", powerWatts: 120, type: 'resin' },
  { name: "Prusa XL", powerWatts: 700, type: 'filament' },
  { name: "Elegoo Saturn 2", powerWatts: 150, type: 'resin' },
  { name: "Custom Printer", powerWatts: 0, type: 'both' }, // Placeholder for custom input
];

// Predefined material profiles for the dropdown
export const PREDEFINED_MATERIAL_PROFILES: MaterialProfile[] = [
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
  { name: "Cyprus", costPerKWh: 0.25, currency: "€" },
  { name: "France", costPerKWh: 0.25, currency: "€" },
  { name: "Spain", costPerKWh: 0.28, currency: "€" },
  { name: "Italy", costPerKWh: 0.30, currency: "€" },
  { name: "China", costPerKWh: 0.08, currency: "¥" },
  { name: "India", costPerKWh: 0.07, currency: "₹" },
  { name: "Brazil", costPerKWh: 0.18, currency: "R$" },
  { name: "South Africa", costPerKWh: 0.15, currency: "R" },
  { name: "Philippines", costPerKWh: 0.20, currency: "₱" },
  { name: "Greece", costPerKWh: 0.27, currency: "€" },
  { name: "Custom Country", costPerKWh: 0.15, currency: "$" }, // Default custom value
];

// Default settings as a constant
const defaultPrintCalculatorSettings: PrintCalculatorSettings = {
  materialCostPerKg: PREDEFINED_MATERIAL_PROFILES.find(p => p.name === "PLA")?.costPerKg || 0, // Default to PLA cost
  objectWeightGrams: 100,
  printTimeHours: 5,
  electricityCostPerKWh: COUNTRY_ELECTRICITY_COSTS.find(c => c.name === "Cyprus")?.costPerKWh || 0.15, // Default to Cyprus cost
  printerPowerWatts: PREDEFINED_PRINTER_PROFILES.find(p => p.name === "Ender 3")?.powerWatts || 0, // Default to Ender 3 power
  laborHourlyRate: 25,
  designSetupFee: 5,
  profitMarginPercentage: 20,
  currency: COUNTRY_ELECTRICITY_COSTS.find(c => c.name === "Cyprus")?.currency || "$", // Default to Cyprus currency
  printerDepreciationHourly: 1.5,
  failedPrintRatePercentage: 5,
  selectedPrinterProfile: "Ender 3", // Default to a filament printer
  selectedFilamentProfile: "PLA", // Default to a filament material
  printType: 'filament', // Default print type
  supportMaterialCost: 0, // Default support material cost
  postProcessingMaterialCost: 0, // Default post-processing material cost
  selectedCountry: "Cyprus", // Default country
  pdfExportMode: 'standard', // Default to standard PDF export
  companyName: "", // Default empty company name
  companyAddress: "", // Default empty company address
  companyLogoUrl: "", // Default empty company logo URL
  projectName: "3D Print Project", // Default project name
};

interface SettingsContextType {
  printCalculatorSettings: PrintCalculatorSettings;
  updatePrintCalculatorSettings: (newSettings: Partial<PrintCalculatorSettings>) => void;
  resetPrintCalculatorSettings: () => void;
  userPrinterProfiles: PrinterProfile[];
  userMaterialProfiles: MaterialProfile[];
  addPrinterProfile: (profile: Omit<PrinterProfile, 'id' | 'isCustom'>) => Promise<void>;
  updatePrinterProfile: (id: string, profile: Omit<Partial<PrinterProfile>, 'id' | 'isCustom'>) => Promise<void>;
  deletePrinterProfile: (id: string) => Promise<void>;
  addMaterialProfile: (profile: Omit<MaterialProfile, 'id' | 'isCustom'>) => Promise<void>;
  updateMaterialProfile: (id: string, profile: Omit<Partial<MaterialProfile>, 'id' | 'isCustom'>) => Promise<void>;
  deleteMaterialProfile: (id: string) => Promise<void>;
  PRINTER_PROFILES: PrinterProfile[]; // Combined list
  MATERIAL_PROFILES: MaterialProfile[]; // Combined list
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "printCalculatorSettings";

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { session, isGuest } = useSession();
  const [printCalculatorSettings, setPrintCalculatorSettings] = useState<PrintCalculatorSettings>(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        return { ...defaultPrintCalculatorSettings, ...parsedSettings };
      }
    }
    return defaultPrintCalculatorSettings;
  });

  const [userPrinterProfiles, setUserPrinterProfiles] = useState<PrinterProfile[]>([]);
  const [userMaterialProfiles, setUserMaterialProfiles] = useState<MaterialProfile[]>([]);

  const fetchUserProfiles = useCallback(async () => {
    if (!session || isGuest) {
      setUserPrinterProfiles([]);
      setUserMaterialProfiles([]);
      return;
    }

    const userId = session.user.id;

    // Fetch printer profiles
    const { data: printerData, error: printerError } = await supabase
      .from('user_printer_profiles')
      .select('*')
      .eq('user_id', userId);

    if (printerError) {
      console.error("Error fetching printer profiles:", printerError);
      toast.error("Failed to load custom printer profiles.");
    } else {
      setUserPrinterProfiles(printerData.map(p => ({ ...p, isCustom: true })));
    }

    // Fetch material profiles
    const { data: materialData, error: materialError } = await supabase
      .from('user_material_profiles')
      .select('*')
      .eq('user_id', userId);

    if (materialError) {
      console.error("Error fetching material profiles:", materialError);
      toast.error("Failed to load custom material profiles.");
    } else {
      setUserMaterialProfiles(materialData.map(m => ({ ...m, isCustom: true })));
    }
  }, [session, isGuest]);

  useEffect(() => {
    fetchUserProfiles();
  }, [fetchUserProfiles]);

  // Combine predefined and user-defined profiles
  const combinedPrinterProfiles = [...PREDEFINED_PRINTER_PROFILES, ...userPrinterProfiles];
  const combinedMaterialProfiles = [...PREDEFINED_MATERIAL_PROFILES, ...userMaterialProfiles];

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
        const defaultPrinterForType = combinedPrinterProfiles.find(p => p.type === newPrintType || p.type === 'both');
        if (defaultPrinterForType) {
          updatedSettings.selectedPrinterProfile = defaultPrinterForType.name;
          updatedSettings.printerPowerWatts = defaultPrinterForType.powerWatts;
        } else {
          updatedSettings.selectedPrinterProfile = "Custom Printer";
          updatedSettings.printerPowerWatts = 0;
        }

        // Reset material profile to a default compatible with the new print type
        const defaultMaterialForType = combinedMaterialProfiles.find(m => m.type === newPrintType);
        if (defaultMaterialForType) {
          updatedSettings.selectedFilamentProfile = defaultMaterialForType.name;
          updatedSettings.materialCostPerKg = defaultMaterialForType.costPerKg;
        } else {
          updatedSettings.selectedFilamentProfile = newPrintType === 'filament' ? "Custom Filament" : "Custom Resin";
          updatedSettings.materialCostPerKg = 0;
        }
      }

      // Handle printer profile change (if not already handled by printType change)
      if (newSettings.selectedPrinterProfile !== undefined && newSettings.selectedPrinterProfile !== prevSettings.selectedPrinterProfile) {
        const selectedProfile = combinedPrinterProfiles.find(p => p.name === newSettings.selectedPrinterProfile);
        if (selectedProfile && selectedProfile.name !== "Custom Printer") {
          updatedSettings.printerPowerWatts = selectedProfile.powerWatts;
        } else if (selectedProfile && selectedProfile.name === "Custom Printer" && newSettings.printerPowerWatts === undefined) {
          updatedSettings.printerPowerWatts = prevSettings.selectedPrinterProfile === "Custom Printer" ? prevSettings.printerPowerWatts : 0;
        }
      }

      // Handle material profile change (if not already handled by printType change)
      if (newSettings.selectedFilamentProfile !== undefined && newSettings.selectedFilamentProfile !== prevSettings.selectedFilamentProfile) {
        const selectedMaterial = combinedMaterialProfiles.find(f => f.name === newSettings.selectedFilamentProfile);
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
          updatedSettings.electricityCostPerKWh = 0.15;
          updatedSettings.currency = "$";
        }
      }
      
      return updatedSettings;
    });
  };

  const resetPrintCalculatorSettings = () => {
    setPrintCalculatorSettings(defaultPrintCalculatorSettings);
    toast.success("Settings reset to defaults!");
  };

  const addPrinterProfile = async (profile: Omit<PrinterProfile, 'id' | 'isCustom'>) => {
    if (!session) {
      toast.error("You must be logged in to add custom profiles.");
      return;
    }
    const { data, error } = await supabase
      .from('user_printer_profiles')
      .insert({ ...profile, user_id: session.user.id })
      .select();

    if (error) {
      console.error("Error adding printer profile:", error);
      toast.error("Failed to add printer profile.");
    } else {
      toast.success("Printer profile added successfully!");
      fetchUserProfiles();
    }
  };

  const updatePrinterProfile = async (id: string, profile: Omit<Partial<PrinterProfile>, 'id' | 'isCustom'>) => {
    if (!session) {
      toast.error("You must be logged in to update custom profiles.");
      return;
    }
    const { error } = await supabase
      .from('user_printer_profiles')
      .update(profile)
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      console.error("Error updating printer profile:", error);
      toast.error("Failed to update printer profile.");
    } else {
      toast.success("Printer profile updated successfully!");
      fetchUserProfiles();
    }
  };

  const deletePrinterProfile = async (id: string) => {
    if (!session) {
      toast.error("You must be logged in to delete custom profiles.");
      return;
    }
    const { error } = await supabase
      .from('user_printer_profiles')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      console.error("Error deleting printer profile:", error);
      toast.error("Failed to delete printer profile.");
    } else {
      toast.success("Printer profile deleted successfully!");
      fetchUserProfiles();
    }
  };

  const addMaterialProfile = async (profile: Omit<MaterialProfile, 'id' | 'isCustom'>) => {
    if (!session) {
      toast.error("You must be logged in to add custom profiles.");
      return;
    }
    const { data, error } = await supabase
      .from('user_material_profiles')
      .insert({ ...profile, user_id: session.user.id })
      .select();

    if (error) {
      console.error("Error adding material profile:", error);
      toast.error("Failed to add material profile.");
    } else {
      toast.success("Material profile added successfully!");
      fetchUserProfiles();
    }
  };

  const updateMaterialProfile = async (id: string, profile: Omit<Partial<MaterialProfile>, 'id' | 'isCustom'>) => {
    if (!session) {
      toast.error("You must be logged in to update custom profiles.");
      return;
    }
    const { error } = await supabase
      .from('user_material_profiles')
      .update(profile)
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      console.error("Error updating material profile:", error);
      toast.error("Failed to update material profile.");
    } else {
      toast.success("Material profile updated successfully!");
      fetchUserProfiles();
    }
  };

  const deleteMaterialProfile = async (id: string) => {
    if (!session) {
      toast.error("You must be logged in to delete custom profiles.");
      return;
    }
    const { error } = await supabase
      .from('user_material_profiles')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      console.error("Error deleting material profile:", error);
      toast.error("Failed to delete material profile.");
    } else {
      toast.success("Material profile deleted successfully!");
      fetchUserProfiles();
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        printCalculatorSettings,
        updatePrintCalculatorSettings,
        resetPrintCalculatorSettings,
        userPrinterProfiles,
        userMaterialProfiles,
        addPrinterProfile,
        updatePrinterProfile,
        deletePrinterProfile,
        addMaterialProfile,
        updateMaterialProfile,
        deleteMaterialProfile,
        PRINTER_PROFILES: combinedPrinterProfiles,
        MATERIAL_PROFILES: combinedMaterialProfiles,
      }}
    >
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