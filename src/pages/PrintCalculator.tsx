"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings } from "@/context/SettingsContext";
import { Link } from "react-router-dom";
import { Settings as SettingsIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PrintSummaryFooter from "@/components/PrintSummaryFooter";
import { useSession } from "@/context/SessionContext";
import AdBanner from "@/components/AdBanner";
import { useTranslation } from "react-i18next"; // Import useTranslation

const PrintCalculator = () => {
  const { session, loading, isGuest } = useSession();
  const { printCalculatorSettings, updatePrintCalculatorSettings, PRINTER_PROFILES, MATERIAL_PROFILES } = useSettings();
  const { t } = useTranslation(); // Initialize useTranslation

  const [projectName, setProjectName] = useState<string>(printCalculatorSettings.projectName);
  const [objectValue, setObjectValue] = useState<number>(printCalculatorSettings.objectWeightGrams);
  const [printTimeHours, setPrintTimeHours] = useState<number>(printCalculatorSettings.printTimeHours);
  const [designSetupFee, setDesignSetupFee] = useState<number>(printCalculatorSettings.designSetupFee);
  const [postProcessingTimeHours, setPostProcessingTimeHours] = useState<number>(0);
  const [supportMaterialPercentage, setSupportMaterialPercentage] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [postProcessingMaterialCost, setPostProcessingMaterialCost] = useState<number>(printCalculatorSettings.postProcessingMaterialCost);
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(true); // New state for footer collapse

  useEffect(() => {
    setProjectName(printCalculatorSettings.projectName);
    setObjectValue(printCalculatorSettings.objectWeightGrams);
    setPrintTimeHours(printCalculatorSettings.printTimeHours);
    setDesignSetupFee(printCalculatorSettings.designSetupFee);
    setPostProcessingMaterialCost(printCalculatorSettings.postProcessingMaterialCost);
  }, [printCalculatorSettings.projectName, printCalculatorSettings.objectWeightGrams, printCalculatorSettings.printTimeHours, printCalculatorSettings.designSetupFee, printCalculatorSettings.printType, printCalculatorSettings.postProcessingMaterialCost]);

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

  const calculatePrice = () => {
    const isFilament = printCalculatorSettings.printType === 'filament';
    const unitConversionFactor = isFilament ? 1000 : 1000;

    const totalMaterialValue = objectValue * (1 + supportMaterialPercentage / 100);
    const materialCost = (totalMaterialValue / unitConversionFactor) * printCalculatorSettings.materialCostPerKg;

    const electricityConsumptionKWh = (printCalculatorSettings.printerPowerWatts * printTimeHours) / 1000;
    const electricityCost = electricityConsumptionKWh * printCalculatorSettings.electricityCostPerKWh;
    
    const totalLaborHours = printTimeHours + postProcessingTimeHours;
    const laborCost = totalLaborHours * printCalculatorSettings.laborHourlyRate;

    const printerDepreciationCost = printTimeHours * printCalculatorSettings.printerDepreciationHourly;

    const supportMaterialCostFromSettings = printCalculatorSettings.supportMaterialCost;
    const postProcessingMaterialCostFromInput = postProcessingMaterialCost;

    let totalBaseCost = materialCost + electricityCost + laborCost + designSetupFee + printerDepreciationCost + supportMaterialCostFromSettings + postProcessingMaterialCostFromInput;
    
    if (printCalculatorSettings.failedPrintRatePercentage > 0) {
      totalBaseCost = totalBaseCost / (1 - printCalculatorSettings.failedPrintRatePercentage / 100);
    }

    const finalPrice = (totalBaseCost * (1 + printCalculatorSettings.profitMarginPercentage / 100)) + shippingCost;

    return {
      materialCost,
      electricityCost,
      laborCost,
      designSetupFee,
      printerDepreciationCost,
      shippingCost,
      supportMaterialCost: supportMaterialCostFromSettings,
      postProcessingMaterialCost: postProcessingMaterialCostFromInput,
      totalBaseCost,
      finalPrice,
    };
  };

  const { materialCost, electricityCost, laborCost, designSetupFee: calculatedDesignSetupFee, printerDepreciationCost, shippingCost: calculatedShippingCost, supportMaterialCost: calculatedSupportMaterialCost, postProcessingMaterialCost: calculatedPostProcessingMaterialCost, totalBaseCost, finalPrice } = calculatePrice();
  const currencySymbol = printCalculatorSettings.currency;

  const filteredPrinterProfiles = PRINTER_PROFILES.filter(p => p.type === printCalculatorSettings.printType || p.type === 'both');
  const filteredMaterialProfiles = MATERIAL_PROFILES.filter(m => m.type === printCalculatorSettings.printType);

  const objectValueLabel = printCalculatorSettings.printType === 'filament' ? t('calculator.objectWeightGrams') : t('calculator.objectVolumeMl');
  const materialUnitSymbol = printCalculatorSettings.printType === 'filament' ? 'kg' : 'L';

  const handleToggleBreakdown = useCallback((collapsed: boolean) => {
    setIsSummaryCollapsed(collapsed);
  }, []);

  // Define padding classes based on collapse state
  const paddingClass = isSummaryCollapsed ? "pb-[200px]" : "pb-[470px]"; // Increased padding for open state

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">{t('common.loading')}</div>;
  }

  if (!session && !isGuest) {
    return null;
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 ${paddingClass}`}>
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between p-6">
          <div className="flex-grow"></div>
          <CardTitle className="text-3xl font-bold text-center flex-grow-0">{t('calculator.title')}</CardTitle>
          <div className="flex-grow flex justify-end">
            <Link to="/settings">
              <Button variant="outline" size="icon">
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdBanner />
          <div className="space-y-4">
            <div>
              <Label htmlFor="projectName">{t('calculator.projectName')}</Label>
              <Input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="materialProfile">{t('calculator.materialType')}</Label>
              <Select
                value={printCalculatorSettings.selectedFilamentProfile}
                onValueChange={handleMaterialProfileChange}
              >
                <SelectTrigger id="materialProfile">
                  <SelectValue placeholder={t('calculator.selectType')} />
                </SelectTrigger>
                <SelectContent>
                  {filteredMaterialProfiles.map((profile) => (
                    <SelectItem key={profile.name} value={profile.name}>
                      {profile.name} {profile.name.startsWith("Custom") ? "" : `(${currencySymbol}${profile.costPerKg}/${materialUnitSymbol})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="printerProfile">{t('calculator.printerProfile')}</Label>
              <Select
                value={printCalculatorSettings.selectedPrinterProfile}
                onValueChange={handlePrinterProfileChange}
              >
                <SelectTrigger id="printerProfile">
                  <SelectValue placeholder={t('calculator.selectType')} />
                </SelectTrigger>
                <SelectContent>
                  {filteredPrinterProfiles.map((profile) => (
                    <SelectItem key={profile.name} value={profile.name}>
                      {profile.name} {profile.name !== "Custom Printer" && `(${profile.powerWatts}W)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="objectValue">{objectValueLabel}</Label>
              <Input
                id="objectValue"
                type="number"
                value={objectValue}
                onChange={(e) => setObjectValue(parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="printTimeHours">{t('calculator.printTimeHours')}</Label>
              <Input
                id="printTimeHours"
                type="number"
                value={printTimeHours}
                onChange={(e) => setPrintTimeHours(parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="postProcessingTimeHours">{t('calculator.postProcessingTimeHours')}</Label>
              <Input
                id="postProcessingTimeHours"
                type="number"
                value={postProcessingTimeHours}
                onChange={(e) => setPostProcessingTimeHours(parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="designSetupFee">{t('calculator.designSetupFee')} ({currencySymbol})</Label>
              <Input
                id="designSetupFee"
                type="number"
                value={designSetupFee}
                onChange={(e) => setDesignSetupFee(parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="supportMaterialPercentage">{t('calculator.supportMaterialOverhead')}</Label>
              <Input
                id="supportMaterialPercentage"
                type="number"
                value={supportMaterialPercentage}
                onChange={(e) => setSupportMaterialPercentage(parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
              />
            </div>
            <div>
              <Label htmlFor="postProcessingMaterialCost">{t('calculator.postProcessingMaterialCost')} ({currencySymbol})</Label>
              <Input
                id="postProcessingMaterialCost"
                type="number"
                value={postProcessingMaterialCost}
                onChange={(e) => setPostProcessingMaterialCost(parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="shippingCost">{t('calculator.shippingCost')} ({currencySymbol})</Label>
              <Input
                id="shippingCost"
                type="number"
                value={shippingCost}
                onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <PrintSummaryFooter
        materialCost={materialCost}
        electricityCost={electricityCost}
        laborCost={laborCost}
        designSetupFee={calculatedDesignSetupFee}
        printerDepreciationCost={printerDepreciationCost}
        shippingCost={calculatedShippingCost}
        supportMaterialCost={calculatedSupportMaterialCost}
        postProcessingMaterialCost={calculatedPostProcessingMaterialCost}
        finalPrice={finalPrice}
        currencySymbol={currencySymbol}
        pdfExportMode={printCalculatorSettings.pdfExportMode}
        companyName={printCalculatorSettings.companyName}
        companyAddress={printCalculatorSettings.companyAddress}
        companyLogoUrl={printCalculatorSettings.companyLogoUrl}
        printType={printCalculatorSettings.printType}
        selectedPrinterProfile={printCalculatorSettings.selectedPrinterProfile}
        printerPowerWatts={printCalculatorSettings.printerPowerWatts}
        selectedFilamentProfile={printCalculatorSettings.selectedFilamentProfile}
        materialCostPerKg={printCalculatorSettings.materialCostPerKg}
        objectWeightGrams={objectValue}
        printTimeHours={printTimeHours}
        electricityCostPerKWh={printCalculatorSettings.electricityCostPerKWh}
        laborHourlyRate={printCalculatorSettings.laborHourlyRate}
        profitMarginPercentage={printCalculatorSettings.profitMarginPercentage}
        failedPrintRatePercentage={printCalculatorSettings.failedPrintRatePercentage}
        supportMaterialPercentage={supportMaterialPercentage}
        postProcessingTimeHours={postProcessingTimeHours}
        selectedCountry={printCalculatorSettings.selectedCountry}
        projectName={projectName}
        onToggleBreakdown={handleToggleBreakdown}
      />
    </div>
  );
};

export default PrintCalculator;