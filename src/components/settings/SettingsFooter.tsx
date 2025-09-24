"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { useSettings } from "@/context/SettingsContext";

const SettingsFooter = () => {
  const { resetPrintCalculatorSettings } = useSettings();

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <CardFooter className="flex justify-between p-6">
      <Button variant="outline" onClick={resetPrintCalculatorSettings}>Reset to Defaults</Button>
      <Button onClick={handleSave}>Save Settings</Button>
    </CardFooter>
  );
};

export default SettingsFooter;