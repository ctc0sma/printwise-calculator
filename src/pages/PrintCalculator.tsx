"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/context/SettingsContext";
import { Link } from "react-router-dom";
import { Settings as SettingsIcon } from "lucide-react";

const PrintCalculator = () => {
  const { printCalculatorSettings } = useSettings();

  const [objectWeightGrams, setObjectWeightGrams] = useState<number>(printCalculatorSettings.objectWeightGrams);
  const [printTimeHours, setPrintTimeHours] = useState<number>(printCalculatorSettings.printTimeHours);
  const [designSetupFee, setDesignSetupFee] = useState<number>(printCalculatorSettings.designSetupFee);
  const [postProcessingTimeHours, setPostProcessingTimeHours] = useState<number>(0); // New: Local state for post-processing time
  const [supportMaterialPercentage, setSupportMaterialPercentage] = useState<number>(0); // New: Local state for support material

  useEffect(() => {
    setObjectWeightGrams(printCalculatorSettings.objectWeightGrams);
    setPrintTimeHours(printCalculatorSettings.printTimeHours);
    setDesignSetupFee(printCalculatorSettings.designSetupFee);
    // Reset post-processing and support material when settings change, or keep them if they are per-print
    setPostProcessingTimeHours(0); // Assuming these are per-print and should reset or start at 0
    setSupportMaterialPercentage(0); // Assuming these are per-print and should reset or start at 0
  }, [printCalculatorSettings]);

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
      printerDepreciationCost, // New: Depreciation cost
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
          </div>
          <div className="space-y-4">
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