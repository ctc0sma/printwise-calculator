"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSettings, PRINTER_PROFILES, FILAMENT_PROFILES } from "@/context/SettingsContext";
import { Link } from "react-router-dom";
import { Settings as SettingsIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PrintCalculator = () => {
  const { printCalculatorSettings, updatePrintCalculatorSettings } = useSettings();

  // Local states for per-print inputs
  const [objectWeightGrams, setObjectWeightGrams] = useState<number>(printCalculatorSettings.objectWeightGrams);
  const [printTimeHours, setPrintTimeHours] = useState<number>(printCalculatorSettings.printTimeHours);
  const [designSetupFee, setDesignSetupFee] = useState<number>(printCalculatorSettings.designSetupFee);
  const [postProcessingTimeHours, setPostProcessingTimeHours] = useState<number>(0);
  const [supportMaterialPercentage, setSupportMaterialPercentage] = useState<number>(0);

  // Update local states when context defaults change (e.g., after reset in settings)
  useEffect(() => {
    setObjectWeightGrams(printCalculatorSettings.objectWeightGrams);
    setPrintTimeHours(printCalculatorSettings.printTimeHours);
    setDesignSetupFee(printCalculatorSettings.designSetupFee);
    // Post-processing and support material are per-print, so they start at 0 or their last input
    // For simplicity, we'll keep them as local state that doesn't reset with context changes unless explicitly handled.
    // If you want them to reset to 0 when settings change, uncomment the lines below:
    // setPostProcessingTimeHours(0);
    // setSupportMaterialPercentage(0);
  }, [printCalculatorSettings.objectWeightGrams, printCalculatorSettings.printTimeHours, printCalculatorSettings.designSetupFee]);


  const handlePrinterProfileChange = (profileName: string) => {
    const selectedProfile = PRINTER_PROFILES.find(p => p.name === profileName);
    if (selectedProfile) {
      updatePrintCalculatorSettings({
        selectedPrinterProfile: profileName,
        printerPowerWatts: selectedProfile.powerWatts,
      });
    }
  };

  const handleFilamentProfileChange = (profileName: string) => {
    const selectedFilament = FILAMENT_PROFILES.find(f => f.name === profileName);
    if (selectedFilament) {
      updatePrintCalculatorSettings({
        selectedFilamentProfile: profileName,
        materialCostPerKg: selectedFilament.costPerKg,
      });
    }
  };

  const calculatePrice = () => {
    const objectWeightKg = objectWeightGrams / 1000;
    
    // Material Cost with Support Material
    const totalMaterialWeightKg = objectWeightKg * (1 + supportMaterialPercentage / 100);
    const materialCost = totalMaterialWeightKg * printCalculatorSettings.materialCostPerKg;

    const electricityConsumptionKWh = (printCalculatorSettings.printerPowerWatts * printTimeHours) / 1000;
    const electricityCost = electricityConsumptionKWh * printCalculatorSettings.electricityCostPerKWh;
    
    // Labor Cost includes print time and post-processing time
    const totalLaborHours = printTimeHours + postProcessingTimeHours;
    const laborCost = totalLaborHours * printCalculatorSettings.laborHourlyRate;

    // Printer Depreciation Cost
    const printerDepreciationCost = printTimeHours * printCalculatorSettings.printerDepreciationHourly;

    let totalBaseCost = materialCost + electricityCost + laborCost + designSetupFee + printerDepreciationCost;
    
    // Adjust for Failed Print Rate
    if (printCalculatorSettings.failedPrintRatePercentage > 0) {
      totalBaseCost = totalBaseCost / (1 - printCalculatorSettings.failedPrintRatePercentage / 100);
    }

    const finalPrice = totalBaseCost * (1 + printCalculatorSettings.profitMarginPercentage / 100);

    return {
      materialCost,
      electricityCost,
      laborCost,
      designSetupFee,
      printerDepreciationCost,
      totalBaseCost,
      finalPrice,
    };
  };

  const { materialCost, electricityCost, laborCost, designSetupFee: calculatedDesignSetupFee, printerDepreciationCost, totalBaseCost, finalPrice } = calculatePrice();
  const currencySymbol = printCalculatorSettings.currency;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
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
              <Label htmlFor="filamentProfile">Filament Type</Label>
              <Select
                value={printCalculatorSettings.selectedFilamentProfile}
                onValueChange={handleFilamentProfileChange}
              >
                <SelectTrigger id="filamentProfile">
                  <SelectValue placeholder="Select filament" />
                </SelectTrigger>
                <SelectContent>
                  {FILAMENT_PROFILES.map((profile) => (
                    <SelectItem key={profile.name} value={profile.name}>
                      {profile.name} {profile.name !== "Custom Filament" && `(${currencySymbol}${profile.costPerKg}/kg)`}
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
                  {PRINTER_PROFILES.map((profile) => (
                    <SelectItem key={profile.name} value={profile.name}>
                      {profile.name} {profile.name !== "Custom Printer" && `(${profile.powerWatts}W)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="objectWeightGrams">Object Weight (grams)</Label>
              <Input
                id="objectWeightGrams"
                type="number"
                value={objectWeightGrams}
                onChange={(e) => setObjectWeightGrams(parseFloat(e.target.value) || 0)}
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
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 p-6">
          <Separator />
          <div className="w-full grid grid-cols-2 gap-2 text-lg font-medium">
            <div className="text-left">Material Cost:</div>
            <div className="text-right">{currencySymbol}{materialCost.toFixed(2)}</div>

            <div className="text-left">Electricity Cost:</div>
            <div className="text-right">{currencySymbol}{electricityCost.toFixed(2)}</div>

            <div className="text-left">Labor Cost:</div>
            <div className="text-right">{currencySymbol}{laborCost.toFixed(2)}</div>

            <div className="text-left">Design/Setup Fee:</div>
            <div className="text-right">{currencySymbol}{calculatedDesignSetupFee.toFixed(2)}</div>

            <div className="text-left">Printer Depreciation:</div>
            <div className="text-right">{currencySymbol}{printerDepreciationCost.toFixed(2)}</div>
          </div>
          <Separator />
          <div className="w-full flex justify-between items-center text-2xl font-bold mt-4">
            <span>Total Estimated Price:</span>
            <span>{currencySymbol}{finalPrice.toFixed(2)}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PrintCalculator;