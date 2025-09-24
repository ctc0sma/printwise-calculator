"use client";

import React, { useState, useEffect } from "react";
import { useSettings, PRINTER_PROFILES } from "@/context/SettingsContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
}
from "@/components/ui/select";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle"; // Import ThemeToggle

const Settings = () => {
  const { printCalculatorSettings, updatePrintCalculatorSettings, resetPrintCalculatorSettings } = useSettings();
  const [customPrinterPower, setCustomPrinterPower] = useState<number>(
    printCalculatorSettings.selectedPrinterProfile === "Custom Printer"
      ? printCalculatorSettings.printerPowerWatts
      : 0
  );

  // Update customPrinterPower when the context's printerPowerWatts changes and it's a custom profile
  useEffect(() => {
    if (printCalculatorSettings.selectedPrinterProfile === "Custom Printer") {
      setCustomPrinterPower(printCalculatorSettings.printerPowerWatts);
    }
  }, [printCalculatorSettings.selectedPrinterProfile, printCalculatorSettings.printerPowerWatts]);


  const handleSettingChange = (key: keyof typeof printCalculatorSettings, value: string | number) => {
    if (key === "currency" || key === "selectedPrinterProfile") {
      updatePrintCalculatorSettings({ [key]: value as string });
    } else {
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
        printerPowerWatts: selectedProfile.name === "Custom Printer" ? customPrinterPower : selectedProfile.powerWatts,
      });
    }
  };

  const handleCustomPrinterPowerChange = (value: string) => {
    const numValue = parseFloat(value);
    setCustomPrinterPower(isNaN(numValue) ? 0 : numValue);
    if (printCalculatorSettings.selectedPrinterProfile === "Custom Printer") {
      updatePrintCalculatorSettings({ printerPowerWatts: isNaN(numValue) ? 0 : numValue });
    }
  };

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="relative flex flex-row items-center justify-between p-6">
          <Link to="/" className="absolute top-4 left-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <CardTitle className="text-3xl font-bold text-center flex-grow">Application Settings</CardTitle>
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-2">3D Print Calculator Defaults</h3>
            <div>
              <Label htmlFor="materialCostPerKg">Material Cost per Kg ({printCalculatorSettings.currency})</Label>
              <Input
                id="materialCostPerKg"
                type="number"
                value={printCalculatorSettings.materialCostPerKg}
                onChange={(e) => handleSettingChange("materialCostPerKg", e.target.value)}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="objectWeightGrams">Object Weight (grams)</Label>
              <Input
                id="objectWeightGrams"
                type="number"
                value={printCalculatorSettings.objectWeightGrams}
                onChange={(e) => handleSettingChange("objectWeightGrams", e.target.value)}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="printTimeHours">Print Time (hours)</Label>
              <Input
                id="printTimeHours"
                type="number"
                value={printCalculatorSettings.printTimeHours}
                onChange={(e) => handleSettingChange("printTimeHours", e.target.value)}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="electricityCostPerKWh">Electricity Cost per kWh ({printCalculatorSettings.currency})</Label>
              <Input
                id="electricityCostPerKWh"
                type="number"
                value={printCalculatorSettings.electricityCostPerKWh}
                onChange={(e) => handleSettingChange("electricityCostPerKWh", e.target.value)}
                min="0"
                step="0.01"
              />
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
            {printCalculatorSettings.selectedPrinterProfile === "Custom Printer" && (
              <div>
                <Label htmlFor="customPrinterPowerWatts">Custom Printer Power (Watts)</Label>
                <Input
                  id="customPrinterPowerWatts"
                  type="number"
                  value={customPrinterPower}
                  onChange={(e) => handleCustomPrinterPowerChange(e.target.value)}
                  min="0"
                />
              </div>
            )}
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-2 invisible md:visible">_</h3> {/* Placeholder for alignment */}
            <div>
              <Label htmlFor="laborHourlyRate">Labor Hourly Rate ({printCalculatorSettings.currency})</Label>
              <Input
                id="laborHourlyRate"
                type="number"
                value={printCalculatorSettings.laborHourlyRate}
                onChange={(e) => handleSettingChange("laborHourlyRate", e.target.value)}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="designSetupFee">Design/Setup Fee ({printCalculatorSettings.currency})</Label>
              <Input
                id="designSetupFee"
                type="number"
                value={printCalculatorSettings.designSetupFee}
                onChange={(e) => handleSettingChange("designSetupFee", e.target.value)}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="profitMarginPercentage">Profit Margin (%)</Label>
              <Input
                id="profitMarginPercentage"
                type="number"
                value={printCalculatorSettings.profitMarginPercentage}
                onChange={(e) => handleSettingChange("profitMarginPercentage", e.target.value)}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="printerDepreciationHourly">Printer Depreciation/Maintenance Hourly Rate ({printCalculatorSettings.currency})</Label>
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
              <Label htmlFor="failedPrintRatePercentage">Failed Print Rate (%)</Label>
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
              <Label htmlFor="currency">Currency Symbol</Label>
              <Select
                value={printCalculatorSettings.currency}
                onValueChange={(value) => handleSettingChange("currency", value)}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="$">Dollar ($)</SelectItem>
                  <SelectItem value="€">Euro (€)</SelectItem>
                  <SelectItem value="£">Pound (£)</SelectItem>
                  <SelectItem value="¥">Yen (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-6">
          <Button variant="outline" onClick={resetPrintCalculatorSettings}>Reset to Defaults</Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Settings;