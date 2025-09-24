"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

const PrintCalculator = () => {
  const { printCalculatorSettings, updatePrintCalculatorSettings } = useSettings();

  // Local states for per-print inputs
  const [objectValue, setObjectValue] = useState<number>(printCalculatorSettings.objectWeightGrams); // Renamed to be generic for weight/volume
  const [printTimeHours, setPrintTimeHours] = useState<number>(printCalculatorSettings.printTimeHours);
  const [designSetupFee, setDesignSetupFee] = useState<number>(printCalculatorSettings.designSetupFee);
  const [postProcessingTimeHours, setPostProcessingTimeHours] = useState<number>(0);
  const [supportMaterialPercentage, setSupportMaterialPercentage] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(0);

  // Update local states when context defaults change (e.g., after reset in settings)
  useEffect(() => {
    setObjectValue(printCalculatorSettings.objectWeightGrams);
    setPrintTimeHours(printCalculatorSettings.printTimeHours);
    setDesignSetupFee(printCalculatorSettings.designSetupFee);
  }, [printCalculatorSettings.objectWeightGrams, printCalculatorSettings.printTimeHours, printCalculatorSettings.designSetupFee, printCalculatorSettings.printType]);


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
        // When a profile is selected, update the materialCostPerKg in settings
        materialCostPerKg: selectedMaterial.costPerKg,
      });
    }
  };

  const calculatePrice = () => {
    const isFilament = printCalculatorSettings.printType === 'filament';
    const unitConversionFactor = isFilament ? 1000 : 1000; // grams to kg (1000), ml to liter (1000)

    // Material Cost with Support Material
    const totalMaterialValue = objectValue * (1 + supportMaterialPercentage / 100);
    const materialCost = (totalMaterialValue / unitConversionFactor) * printCalculatorSettings.materialCostPerKg; // Use material cost from settings

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

    const finalPrice = (totalBaseCost * (1 + printCalculatorSettings.profitMarginPercentage / 100)) + shippingCost;

    return {
      materialCost,
      electricityCost,
      laborCost,
      designSetupFee,
      printerDepreciationCost,
      shippingCost,
      totalBaseCost,
      finalPrice,
    };
  };

  const { materialCost, electricityCost, laborCost, designSetupFee: calculatedDesignSetupFee, printerDepreciationCost, shippingCost: calculatedShippingCost, totalBaseCost, finalPrice } = calculatePrice();
  const currencySymbol = printCalculatorSettings.currency;

  const filteredPrinterProfiles = PRINTER_PROFILES.filter(p => p.type === printCalculatorSettings.printType || p.type === 'both');
  const filteredMaterialProfiles = MATERIAL_PROFILES.filter(m => m.type === printCalculatorSettings.printType);

  const objectValueLabel = printCalculatorSettings.printType === 'filament' ? "Object Weight (grams)" : "Object Volume (ml)";
  const materialUnitSymbol = printCalculatorSettings.printType === 'filament' ? 'kg' : 'L';

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
            {/* Material Cost per Unit input removed from here */}
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

            <div className="text-left">Shipping Cost:</div>
            <div className="text-right">{currencySymbol}{calculatedShippingCost.toFixed(2)}</div>
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