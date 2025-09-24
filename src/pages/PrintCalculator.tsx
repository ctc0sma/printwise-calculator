"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings, PRINTER_PROFILES, MATERIAL_PROFILES } from "@/context/SettingsContext";
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
import { useSession } from "@/context/SessionContext"; // Import useSession

const PrintCalculator = () => {
  const { session, loading, isGuest } = useSession(); // Use session, loading, and isGuest from context
  const { printCalculatorSettings, updatePrintCalculatorSettings } = useSettings();

  // Local states for per-print inputs
  const [objectValue, setObjectValue] = useState<number>(printCalculatorSettings.objectWeightGrams);
  const [printTimeHours, setPrintTimeHours] = useState<number>(printCalculatorSettings.printTimeHours);
  const [designSetupFee, setDesignSetupFee] = useState<number>(printCalculatorSettings.designSetupFee);
  const [postProcessingTimeHours, setPostProcessingTimeHours] = useState<number>(0);
  const [supportMaterialPercentage, setSupportMaterialPercentage] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [postProcessingMaterialCost, setPostProcessingMaterialCost] = useState<number>(printCalculatorSettings.postProcessingMaterialCost);

  // Update local states when context defaults change (e.g., after reset in settings)
  useEffect(() => {
    setObjectValue(printCalculatorSettings.objectWeightGrams);
    setPrintTimeHours(printCalculatorSettings.printTimeHours);
    setDesignSetupFee(printCalculatorSettings.designSetupFee);
    setPostProcessingMaterialCost(printCalculatorSettings.postProcessingMaterialCost);
  }, [printCalculatorSettings.objectWeightGrams, printCalculatorSettings.printTimeHours, printCalculatorSettings.designSetupFee, printCalculatorSettings.printType, printCalculatorSettings.postProcessingMaterialCost]);


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
    const unitConversionFactor = isFilament ? 1000 : 1000; // grams to kg (1000), ml to liter (1000)

    // Material Cost with Support Material Percentage
    const totalMaterialValue = objectValue * (1 + supportMaterialPercentage / 100);
    const materialCost = (totalMaterialValue / unitConversionFactor) * printCalculatorSettings.materialCostPerKg;

    const electricityConsumptionKWh = (printCalculatorSettings.printerPowerWatts * printTimeHours) / 1000;
    const electricityCost = electricityConsumptionKWh * printCalculatorSettings.electricityCostPerKWh;
    
    // Labor Cost includes print time and post-processing time
    const totalLaborHours = printTimeHours + postProcessingTimeHours;
    const laborCost = totalLaborHours * printCalculatorSettings.laborHourlyRate;

    // Printer Depreciation Cost
    const printerDepreciationCost = printTimeHours * printCalculatorSettings.printerDepreciationHourly;

    // New costs from settings and local state
    const supportMaterialCostFromSettings = printCalculatorSettings.supportMaterialCost;
    const postProcessingMaterialCostFromInput = postProcessingMaterialCost;

    let totalBaseCost = materialCost + electricityCost + laborCost + designSetupFee + printerDepreciationCost + supportMaterialCostFromSettings + postProcessingMaterialCostFromInput;
    
    // Adjust for Failed Print Rate
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

  const objectValueLabel = printCalculatorSettings.printType === 'filament' ? "Object Weight (grams)" : "Object Volume (ml)";
  const materialUnitSymbol = printCalculatorSettings.printType === 'filament' ? 'kg' : 'L';

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If not loading, and neither authenticated nor a guest, redirect to login.
  // The SessionContextProvider already handles this, but this explicit check can be useful for clarity.
  if (!session && !isGuest) {
    return null; // SessionContextProvider will handle the redirect
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 pb-72">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="relative">
          <CardTitle className="text-3xl font-bold text-center">3D Print Price Calculator</CardTitle>
          <Link to="/settings" className="absolute top-4 right-4">
            <Button variant="outline" size="icon">
              <SettingsIcon className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="materialProfile">Material Type</Label>
              <Select
                value={printCalculatorSettings.selectedFilamentProfile}
                onValueChange={handleMaterialProfileChange}
              >
                <SelectTrigger id="materialProfile">
                  <SelectValue placeholder="Select material" />
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
              <Label htmlFor="printerProfile">Printer Profile</Label>
              <Select
                value={printCalculatorSettings.selectedPrinterProfile}
                onValueChange={handlePrinterProfileChange}
              >
                <SelectTrigger id="printerProfile">
                  <SelectValue placeholder="Select a printer" />
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
              <Label htmlFor="printTimeHours">Print Time (hours)</Label>
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
              <Label htmlFor="postProcessingTimeHours">Post-processing Time (hours)</Label>
              <Input
                id="postProcessingTimeHours"
                type="number"
                value={postProcessingTimeHours}
                onChange={(e) => setPostProcessingTimeHours(parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="designSetupFee">Design/Setup Fee ({currencySymbol})</Label>
              <Input
                id="designSetupFee"
                type="number"
                value={designSetupFee}
                onChange={(e) => setDesignSetupFee(parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="supportMaterialPercentage">Support Material Overhead (%)</Label>
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
              <Label htmlFor="postProcessingMaterialCost">Post-processing Material Cost ({currencySymbol})</Label>
              <Input
                id="postProcessingMaterialCost"
                type="number"
                value={postProcessingMaterialCost}
                onChange={(e) => setPostProcessingMaterialCost(parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="shippingCost">Shipping Cost ({currencySymbol})</Label>
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
        pdfExportMode={printCalculatorSettings.pdfExportMode} // Pass the new pdfExportMode
        companyName={printCalculatorSettings.companyName}
        companyAddress={printCalculatorSettings.companyAddress}
        companyLogoUrl={printCalculatorSettings.companyLogoUrl}
      />
    </div>
  );
};

export default PrintCalculator;