"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PrintCalculator = () => {
  const [materialCostPerKg, setMaterialCostPerKg] = useState<number>(20); // USD/kg
  const [objectWeightGrams, setObjectWeightGrams] = useState<number>(100); // grams
  const [printTimeHours, setPrintTimeHours] = useState<number>(5); // hours
  const [electricityCostPerKWh, setElectricityCostPerKWh] = useState<number>(0.15); // USD/kWh
  const [printerPowerWatts, setPrinterPowerWatts] = useState<number>(100); // Watts
  const [laborHourlyRate, setLaborHourlyRate] = useState<number>(25); // USD/hour
  const [designSetupFee, setDesignSetupFee] = useState<number>(5); // USD
  const [profitMarginPercentage, setProfitMarginPercentage] = useState<number>(20); // percentage

  const calculatePrice = () => {
    // Convert weight to kg for material cost calculation
    const objectWeightKg = objectWeightGrams / 1000;

    // 1. Material Cost
    const materialCost = objectWeightKg * materialCostPerKg;

    // 2. Electricity Cost (kWh = (Watts * hours) / 1000)
    const electricityConsumptionKWh = (printerPowerWatts * printTimeHours) / 1000;
    const electricityCost = electricityConsumptionKWh * electricityCostPerKWh;

    // 3. Labor Cost
    const laborCost = printTimeHours * laborHourlyRate;

    // 4. Total Base Cost
    const totalBaseCost = materialCost + electricityCost + laborCost + designSetupFee;

    // 5. Final Price with Profit Margin
    const finalPrice = totalBaseCost * (1 + profitMarginPercentage / 100);

    return {
      materialCost,
      electricityCost,
      laborCost,
      designSetupFee,
      totalBaseCost,
      finalPrice,
    };
  };

  const { materialCost, electricityCost, laborCost, designSetupFee: calculatedDesignSetupFee, totalBaseCost, finalPrice } = calculatePrice();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">3D Print Price Calculator</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="materialCostPerKg">Material Cost per Kg ($)</Label>
              <Input
                id="materialCostPerKg"
                type="number"
                value={materialCostPerKg}
                onChange={(e) => setMaterialCostPerKg(parseFloat(e.target.value) || 0)}
                min="0"
              />
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
            <div>
              <Label htmlFor="electricityCostPerKWh">Electricity Cost per kWh ($)</Label>
              <Input
                id="electricityCostPerKWh"
                type="number"
                value={electricityCostPerKWh}
                onChange={(e) => setElectricityCostPerKWh(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="printerPowerWatts">Printer Power (Watts)</Label>
              <Input
                id="printerPowerWatts"
                type="number"
                value={printerPowerWatts}
                onChange={(e) => setPrinterPowerWatts(parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="laborHourlyRate">Labor Hourly Rate ($)</Label>
              <Input
                id="laborHourlyRate"
                type="number"
                value={laborHourlyRate}
                onChange={(e) => setLaborHourlyRate(parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="designSetupFee">Design/Setup Fee ($)</Label>
              <Input
                id="designSetupFee"
                type="number"
                value={designSetupFee}
                onChange={(e) => setDesignSetupFee(parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="profitMarginPercentage">Profit Margin (%)</Label>
              <Input
                id="profitMarginPercentage"
                type="number"
                value={profitMarginPercentage}
                onChange={(e) => setProfitMarginPercentage(parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 p-6">
          <Separator />
          <div className="w-full grid grid-cols-2 gap-2 text-lg font-medium">
            <div className="text-left">Material Cost:</div>
            <div className="text-right">${materialCost.toFixed(2)}</div>

            <div className="text-left">Electricity Cost:</div>
            <div className="text-right">${electricityCost.toFixed(2)}</div>

            <div className="text-left">Labor Cost:</div>
            <div className="text-right">${laborCost.toFixed(2)}</div>

            <div className="text-left">Design/Setup Fee:</div>
            <div className="text-right">${calculatedDesignSetupFee.toFixed(2)}</div>
          </div>
          <Separator />
          <div className="w-full flex justify-between items-center text-2xl font-bold mt-4">
            <span>Total Estimated Price:</span>
            <span>${finalPrice.toFixed(2)}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PrintCalculator;