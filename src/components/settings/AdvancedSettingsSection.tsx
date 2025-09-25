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
import { useSettings } from "@/context/SettingsContext";
import { useTranslation } from "react-i18next"; // Import useTranslation

interface AdvancedSettingsSectionProps {
  printCalculatorSettings: ReturnType<typeof useSettings>['printCalculatorSettings'];
  updatePrintCalculatorSettings: ReturnType<typeof useSettings>['updatePrintCalculatorSettings'];
}

const AdvancedSettingsSection: React.FC<AdvancedSettingsSectionProps> = ({
  printCalculatorSettings,
  updatePrintCalculatorSettings,
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

  const isProfessionalPdfExport = printCalculatorSettings.pdfExportMode === 'professional';

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-2 invisible md:visible">_</h3> {/* Placeholder for alignment */}
      <div>
        <Label htmlFor="laborHourlyRate">{t('settings.laborHourlyRate')} ({printCalculatorSettings.currency})</Label>
        <Input
          id="laborHourlyRate"
          type="number"
          value={printCalculatorSettings.laborHourlyRate}
          onChange={(e) => handleSettingChange("laborHourlyRate", e.target.value)}
          min="0"
        />
      </div>
      <div>
        <Label htmlFor="designSetupFee">{t('settings.designSetupFee')} ({printCalculatorSettings.currency})</Label>
        <Input
          id="designSetupFee"
          type="number"
          value={printCalculatorSettings.designSetupFee}
          onChange={(e) => handleSettingChange("designSetupFee", e.target.value)}
          min="0"
        />
      </div>
      <div>
        <Label htmlFor="profitMarginPercentage">{t('settings.profitMarginPercentage')}</Label>
        <Input
          id="profitMarginPercentage"
          type="number"
          value={printCalculatorSettings.profitMarginPercentage}
          onChange={(e) => handleSettingChange("profitMarginPercentage", e.target.value)}
          min="0"
        />
      </div>
      <div>
        <Label htmlFor="printerDepreciationHourly">{t('settings.printerDepreciationHourly')} ({printCalculatorSettings.currency})</Label>
        <Input
          id="printerDepreciationHourly"
          type="number"
          value={printCalculatorSettings.printerDepreciationHourly}
          onChange={(e) => handleSettingChange("printerDepreciationHourly", e.target.value)}
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <Label htmlFor="failedPrintRatePercentage">{t('settings.failedPrintRatePercentage')}</Label>
        <Input
          id="failedPrintRatePercentage"
          type="number"
          value={printCalculatorSettings.failedPrintRatePercentage}
          onChange={(e) => handleSettingChange("failedPrintRatePercentage", e.target.value)}
          min="0"
          max="100"
        />
      </div>
      <div>
        <Label htmlFor="supportMaterialCost">{t('settings.supportMaterialCost')} ({printCalculatorSettings.currency})</Label>
        <Input
          id="supportMaterialCost"
          type="number"
          value={printCalculatorSettings.supportMaterialCost}
          onChange={(e) => handleSettingChange("supportMaterialCost", e.target.value)}
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <Label htmlFor="postProcessingMaterialCost">{t('settings.postProcessingMaterialCost')} ({printCalculatorSettings.currency})</Label>
        <Input
          id="postProcessingMaterialCost"
          type="number"
          value={printCalculatorSettings.postProcessingMaterialCost}
          onChange={(e) => handleSettingChange("postProcessingMaterialCost", e.target.value)}
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <Label htmlFor="pdfExportMode">{t('settings.pdfExportMode')}</Label>
        <Select
          value={printCalculatorSettings.pdfExportMode}
          onValueChange={(value: 'standard' | 'professional') => handleSettingChange("pdfExportMode", value)}
        >
          <SelectTrigger id="pdfExportMode">
            <SelectValue placeholder={t('settings.selectExportMode')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">{t('settings.standardPdfExport')}</SelectItem>
            <SelectItem value="professional">{t('settings.professionalPdfExport')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isProfessionalPdfExport && (
        <>
          <div>
            <Label htmlFor="companyName">{t('settings.companyName')}</Label>
            <Input
              id="companyName"
              type="text"
              value={printCalculatorSettings.companyName}
              onChange={(e) => handleSettingChange("companyName", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="companyAddress">{t('settings.companyAddress')}</Label>
            <Input
              id="companyAddress"
              type="text"
              value={printCalculatorSettings.companyAddress}
              onChange={(e) => handleSettingChange("companyAddress", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="companyLogoUrl">{t('settings.companyLogoUrl')}</Label>
            <Input
              id="companyLogoUrl"
              type="text"
              value={printCalculatorSettings.companyLogoUrl}
              onChange={(e) => handleSettingChange("companyLogoUrl", e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AdvancedSettingsSection;