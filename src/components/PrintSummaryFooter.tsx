"use client";

import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useTranslation } from "react-i18next";
import { generatePdfSummary, sendEmailSummary } from "@/utils/pdfExport"; // Import the new utility functions

interface PrintSummaryFooterProps {
  materialCost: number;
  electricityCost: number;
  laborCost: number;
  designSetupFee: number;
  printerDepreciationCost: number;
  shippingCost: number;
  supportMaterialCost: number;
  postProcessingMaterialCost: number;
  finalPrice: number;
  currencySymbol: string;
  pdfExportMode: 'standard' | 'professional';
  companyName: string;
  companyAddress: string;
  companyLogoUrl: string;
  printType: 'filament' | 'resin';
  selectedPrinterProfile: string;
  printerPowerWatts: number;
  selectedFilamentProfile: string;
  materialCostPerKg: number;
  objectWeightGrams: number;
  printTimeHours: number;
  electricityCostPerKWh: number;
  laborHourlyRate: number;
  profitMarginPercentage: number;
  failedPrintRatePercentage: number;
  supportMaterialPercentage: number;
  postProcessingTimeHours: number;
  selectedCountry: string;
  projectName: string;
  onToggleBreakdown: (isCollapsed: boolean) => void;
}

const PrintSummaryFooter: React.FC<PrintSummaryFooterProps> = ({
  materialCost,
  electricityCost,
  laborCost,
  designSetupFee,
  printerDepreciationCost,
  shippingCost,
  supportMaterialCost,
  postProcessingMaterialCost,
  finalPrice,
  currencySymbol,
  pdfExportMode,
  companyName,
  companyAddress,
  companyLogoUrl,
  printType,
  selectedPrinterProfile,
  printerPowerWatts,
  selectedFilamentProfile,
  materialCostPerKg,
  objectWeightGrams,
  printTimeHours,
  electricityCostPerKWh,
  laborHourlyRate,
  profitMarginPercentage,
  failedPrintRatePercentage,
  supportMaterialPercentage,
  postProcessingTimeHours,
  selectedCountry,
  projectName,
  onToggleBreakdown,
}) => {
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const { t } = useTranslation();

  React.useEffect(() => {
    onToggleBreakdown(!isBreakdownOpen);
  }, [isBreakdownOpen, onToggleBreakdown]);

  const handleExportSummary = async () => {
    const calculationData = {
      materialCost,
      electricityCost,
      laborCost,
      designSetupFee,
      printerDepreciationCost,
      shippingCost,
      supportMaterialCost,
      postProcessingMaterialCost,
      finalPrice,
      currency: currencySymbol,
      pdfExportMode,
      companyName,
      companyAddress,
      companyLogoUrl,
      printType,
      selectedPrinterProfile,
      printerPowerWatts,
      selectedFilamentProfile,
      materialCostPerKg,
      objectValue: objectWeightGrams, // Use objectValue for consistency with saved data
      printTimeHours,
      electricityCostPerKWh,
      laborHourlyRate,
      profitMarginPercentage,
      failedPrintRatePercentage,
      supportMaterialPercentage,
      postProcessingTimeHours,
      selectedCountry,
      projectName,
    };
    await generatePdfSummary({ project_name: projectName, calculation_data: calculationData });
  };

  const handleSendEmail = () => {
    const calculationData = {
      materialCost,
      electricityCost,
      laborCost,
      designSetupFee,
      printerDepreciationCost,
      shippingCost,
      supportMaterialCost,
      postProcessingMaterialCost,
      finalPrice,
      currency: currencySymbol,
      pdfExportMode,
      companyName,
      companyAddress,
      companyLogoUrl,
      printType,
      selectedPrinterProfile,
      printerPowerWatts,
      selectedFilamentProfile,
      materialCostPerKg,
      objectValue: objectWeightGrams,
      printTimeHours,
      electricityCostPerKWh,
      laborHourlyRate,
      profitMarginPercentage,
      failedPrintRatePercentage,
      supportMaterialPercentage,
      postProcessingTimeHours,
      selectedCountry,
      projectName,
    };
    sendEmailSummary({ project_name: projectName, calculation_data: calculationData });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg p-4 z-50 dark:bg-gray-800 dark:border-gray-700">
      <div className="w-full max-w-2xl mx-auto flex flex-col space-y-2">
        <Collapsible open={isBreakdownOpen} onOpenChange={setIsBreakdownOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between text-base font-medium px-0">
              <span>{t('summary.costBreakdownDetails')}</span>
              {isBreakdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Separator className="my-2" />
            <div className="w-full grid grid-cols-2 gap-2 text-base font-medium">
              <div className="text-left">{t('summary.materialCost')}:</div>
              <div className="text-right">{currencySymbol}{materialCost.toFixed(2)}</div>

              <div className="text-left">{t('summary.electricityCost')}:</div>
              <div className="text-right">{currencySymbol}{electricityCost.toFixed(2)}</div>

              <div className="text-left">{t('summary.laborCost')}:</div>
              <div className="text-right">{currencySymbol}{laborCost.toFixed(2)}</div>

              <div className="text-left">{t('summary.designSetupFee')}:</div>
              <div className="text-right">{currencySymbol}{designSetupFee.toFixed(2)}</div>

              <div className="text-left">{t('summary.printerDepreciation')}:</div>
              <div className="text-right">{currencySymbol}{printerDepreciationCost.toFixed(2)}</div>

              <div className="text-left">{t('summary.supportMaterialCost')}:</div>
              <div className="text-right">{currencySymbol}{supportMaterialCost.toFixed(2)}</div>

              <div className="text-left">{t('summary.postProcessingMaterialCost')}:</div>
              <div className="text-right">{currencySymbol}{postProcessingMaterialCost.toFixed(2)}</div>

              <div className="text-left">{t('summary.shippingCost')}:</div>
              <div className="text-right">{currencySymbol}{shippingCost.toFixed(2)}</div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Separator />
        <div className="w-full flex justify-between items-center text-xl font-bold mt-2">
          <span>{t('summary.totalEstimatedPrice')}:</span>
          <span>{currencySymbol}{finalPrice.toFixed(2)}</span>
        </div>
        <div className="w-full flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={handleExportSummary}>
            {t('summary.exportPdf')}
          </Button>
          <Button onClick={handleSendEmail}>
            {t('summary.sendEmail')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrintSummaryFooter;