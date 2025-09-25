"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings, COUNTRY_ELECTRICITY_COSTS } from "@/context/SettingsContext";
import { useTranslation } from "react-i18next"; // Import useTranslation

interface PrintCalculatorDefaultsSectionProps {
  printCalculatorSettings: ReturnType<typeof useSettings>['printCalculatorSettings'];
  updatePrintCalculatorSettings: ReturnType<typeof useSettings>['updatePrintCalculatorSettings'];
  PRINTER_PROFILES: ReturnType<typeof useSettings>['PRINTER_PROFILES'];
  MATERIAL_PROFILES: ReturnType<typeof useSettings>['MATERIAL_PROFILES'];
  customElectricityCost: number;
  setCustomElectricityCost: (value: number) => void;
  customCurrency: string;
  setCustomCurrency: (value: string) => void;
}

const PrintCalculatorDefaultsSection: React.FC<PrintCalculatorDefaultsSectionProps> = ({
  printCalculatorSettings,
  updatePrintCalculatorSettings,
  PRINTER_PROFILES,
  MATERIAL_PROFILES,
  customElectricityCost,
  setCustomElectricityCost,
  customCurrency,
  setCustomCurrency,
}) => {
  const { t } = useTranslation(); // Initialize useTranslation

  const handleSettingChange = (key: keyof typeof printCalculatorSettings, value: string | number | boolean) => {
    if (key === "currency" || key === "selectedPrinterProfile" || key === "selectedFilamentProfile" || key === "printType" || key === "selectedCountry" || key === "companyName" || key === "companyAddress" || key === "companyLogoUrl" || key === "pdfExportMode" || key === "projectName") {
      updatePrintCalculatorSettings({ [key]: value as string });
    }
    else {
      const numValue = parseFloat(value as string);
      if (!isNaN(numValue) && numValue >= 0) {
        updatePrintCalculatorSettings({ [key]: numValue });
      } else if (value === "") {
        updatePrintCalculatorSettings({ [key]: 0 }); // Allow clearing input to 0
      }
    }
  };

  const handlePrinterProfileChange = (profileName: string) => {
    const selectedProfile = PRINTER_PROFILES.find(p => p.name === profileName);
    if (selectedProfile) {
      updatePrintCalculatorSettings({
        selectedPrinterProfile: profileName,
        printerPowerWatts: selectedProfile.powerWatts,
      });
    }
  };

  const handleMaterialProfileChange = (profileName: string) => {
    const selectedMaterial = MATERIAL_PROFILES.find(f => f.name === profileName);
    if (selectedMaterial) {
      updatePrintCalculatorSettings({
        selectedFilamentProfile: profileName,
        materialCostPerKg: selectedMaterial.costPerKg,
      });
    }
  };

  const handleCountryChange = (countryName: string) => {
    const selectedCountryData = COUNTRY_ELECTRICITY_COSTS.find(c => c.name === countryName);
    if (selectedCountryData) {
      updatePrintCalculatorSettings({
        selectedCountry: countryName,
        electricityCostPerKWh: selectedCountryData.costPerKWh,
        currency: selectedCountryData.currency,
      });
    } else {
      // If "Custom Country" is selected, set defaults for custom input
      updatePrintCalculatorSettings({
        selectedCountry: "Custom Country",
        electricityCostPerKWh: customElectricityCost,
        currency: customCurrency,
      });
    }
  };

  const handleCustomElectricityCostChange = (value: string) => {
    const numValue = parseFloat(value);
    setCustomElectricityCost(isNaN(numValue) ? 0 : numValue);
    if (printCalculatorSettings.selectedCountry === "Custom Country") {
      updatePrintCalculatorSettings({ electricityCostPerKWh: isNaN(numValue) ? 0 : numValue });
    }
  };

  const handleCustomCurrencyChange = (value: string) => {
    setCustomCurrency(value);
    if (printCalculatorSettings.selectedCountry === "Custom Country") {
      updatePrintCalculatorSettings({ currency: value });
    }
  };

  const filteredPrinterProfiles = PRINTER_PROFILES.filter(p => p.type === printCalculatorSettings.printType || p.type === 'both');
  const filteredMaterialProfiles = MATERIAL_PROFILES.filter(m => m.type === printCalculatorSettings.printType);

  const materialCostLabel = printCalculatorSettings.printType === 'filament' ? t('settings.materialCostPerKg') : t('settings.materialCostPerLiter');
  const objectWeightVolumeLabel = printCalculatorSettings.printType === 'filament' ? t('settings.objectWeightGrams') : t('settings.objectVolumeMl');
  const isCustomCountry = printCalculatorSettings.selectedCountry === "Custom Country";

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="printType">{t('settings.printType')}</Label>
        <Select
          value={printCalculatorSettings.printType}
          onValueChange={(value: 'filament' | 'resin') => handleSettingChange("printType", value)}
        >
          <SelectTrigger id="printType">
            <SelectValue placeholder={t('settings.selectPrintType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="filament">{t('settings.filamentPrinting')}</SelectItem>
            <SelectItem value="resin">{t('settings.resinPrinting')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="printerProfile">{t('settings.printerProfile')}</Label>
        <Select
          value={printCalculatorSettings.selectedPrinterProfile}
          onValueChange={handlePrinterProfileChange}
        >
          <SelectTrigger id="printerProfile">
            <SelectValue placeholder={t('settings.selectPrinter')} />
          </SelectTrigger>
          <SelectContent>
            {filteredPrinterProfiles.map((profile) => (
              <SelectItem key={profile.name} value={profile.name}>
                {profile.name} ({profile.powerWatts}W)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="printerPowerWatts">{t('settings.printerPowerWatts')}</Label>
        <Input
          id="printerPowerWatts"
          type="number"
          value={printCalculatorSettings.printerPowerWatts}
          onChange={(e) => handleSettingChange("printerPowerWatts", e.target.value)}
          min="0"
        />
      </div>
      <div>
        <Label htmlFor="materialProfile">{t('settings.materialProfile')}</Label>
        <Select
          value={printCalculatorSettings.selectedFilamentProfile}
          onValueChange={handleMaterialProfileChange}
        >
          <SelectTrigger id="materialProfile">
            <SelectValue placeholder={t('settings.selectMaterial')} />
          </SelectTrigger>
          <SelectContent>
            {filteredMaterialProfiles.map((profile) => (
              <SelectItem key={profile.name} value={profile.name}>
                {profile.name} ({printCalculatorSettings.currency}{profile.costPerKg}/{printCalculatorSettings.printType === 'filament' ? 'kg' : 'L'})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="materialCostPerKg">{materialCostLabel} ({printCalculatorSettings.currency})</Label>
        <Input
          id="materialCostPerKg"
          type="number"
          value={printCalculatorSettings.materialCostPerKg}
          onChange={(e) => handleSettingChange("materialCostPerKg", e.target.value)}
          min="0"
        />
      </div>
      <div>
        <Label htmlFor="objectWeightGrams">{objectWeightVolumeLabel}</Label>
        <Input
          id="objectWeightGrams"
          type="number"
          value={printCalculatorSettings.objectWeightGrams}
          onChange={(e) => handleSettingChange("objectWeightGrams", e.target.value)}
          min="0"
        />
      </div>
      <div>
        <Label htmlFor="printTimeHours">{t('settings.printTimeHours')}</Label>
        <Input
          id="printTimeHours"
          type="number"
          value={printCalculatorSettings.printTimeHours}
          onChange={(e) => handleSettingChange("printTimeHours", e.target.value)}
          min="0"
        />
      </div>
      <div>
        <Label htmlFor="country">{t('settings.country')}</Label>
        <Select
          value={printCalculatorSettings.selectedCountry}
          onValueChange={handleCountryChange}
        >
          <SelectTrigger id="country">
            <SelectValue placeholder={t('settings.selectCountry')} />
          </SelectTrigger>
          <SelectContent>
            {COUNTRY_ELECTRICITY_COSTS.map((country) => (
              <SelectItem key={country.name} value={country.name}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isCustomCountry ? (
        <>
          <div>
            <Label htmlFor="customElectricityCostPerKWh">{t('settings.customElectricityCostPerKWh')} ({printCalculatorSettings.currency})</Label>
            <Input
              id="customElectricityCostPerKWh"
              type="number"
              value={customElectricityCost}
              onChange={(e) => handleCustomElectricityCostChange(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <Label htmlFor="customCurrency">{t('settings.customCurrencySymbol')}</Label>
            <Input
              id="customCurrency"
              type="text"
              value={customCurrency}
              onChange={(e) => handleCustomCurrencyChange(e.target.value)}
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <Label htmlFor="electricityCostPerKWh">{t('settings.electricityCostPerKWh')} ({printCalculatorSettings.currency})</Label>
            <Input
              id="electricityCostPerKWh"
              type="number"
              value={printCalculatorSettings.electricityCostPerKWh.toString()}
              onChange={(e) => handleSettingChange("electricityCostPerKWh", e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <Label htmlFor="currency">{t('settings.currencySymbol')}</Label>
            <Input
              id="currency"
              type="text"
              value={printCalculatorSettings.currency}
              onChange={(e) => handleSettingChange("currency", e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PrintCalculatorDefaultsSection;