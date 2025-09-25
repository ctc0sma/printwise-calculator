"use client";

import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf"; // Import jsPDF
import { ChevronDown, ChevronUp } from "lucide-react"; // Import icons
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"; // Import Collapsible components
import { useTranslation } from "react-i18next"; // Import useTranslation

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
  // New props for print details
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
  projectName: string; // New: Project name for PDF export
  onToggleBreakdown: (isCollapsed: boolean) => void; // New prop to communicate collapse state
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
  // Destructure new props
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
  projectName, // Use the project name
  onToggleBreakdown, // Destructure new prop
}) => {
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false); // State to manage collapsible section
  const { t } = useTranslation(); // Initialize useTranslation

  // Call the prop function when the breakdown state changes
  React.useEffect(() => {
    onToggleBreakdown(!isBreakdownOpen); // Pass true if collapsed, false if open
  }, [isBreakdownOpen, onToggleBreakdown]);

  const generateSummaryText = () => {
    return `PrintWise Calculator:

${t('summary.materialCost')}: ${currencySymbol}${materialCost.toFixed(2)}
${t('summary.electricityCost')}: ${currencySymbol}${electricityCost.toFixed(2)}
${t('summary.laborCost')}: ${currencySymbol}${laborCost.toFixed(2)}
${t('summary.designSetupFee')}: ${currencySymbol}${designSetupFee.toFixed(2)}
${t('summary.printerDepreciation')}: ${currencySymbol}${printerDepreciationCost.toFixed(2)}
${t('summary.supportMaterialCost')}: ${currencySymbol}${supportMaterialCost.toFixed(2)}
${t('summary.postProcessingMaterialCost')}: ${currencySymbol}${postProcessingMaterialCost.toFixed(2)}
${t('summary.shippingCost')}: ${currencySymbol}${shippingCost.toFixed(2)}

${t('summary.totalEstimatedPrice')}: ${currencySymbol}${finalPrice.toFixed(2)}
`;
  };

  const handleExportSummary = async () => {
    const doc = new jsPDF();
    let yPos = 20;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const isProfessional = pdfExportMode === 'professional';

    if (isProfessional) {
      // Company Logo
      if (companyLogoUrl) {
        try {
          const response = await fetch(companyLogoUrl);
          const blob = await response.blob();
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          await new Promise<void>((resolve) => {
            reader.onloadend = () => {
              const imgData = reader.result as string;
              const imgWidth = 50; // Adjust as needed
              const imgHeight = 25; // Adjust as needed
              const x = (pageWidth - imgWidth) / 2; // Center the image
              doc.addImage(imgData, 'PNG', x, yPos, imgWidth, imgHeight);
              yPos += imgHeight + 10; // Space after logo
              resolve();
            };
          });
        } catch (error) {
          console.error("Failed to load company logo:", error);
          // Continue without logo if it fails
        }
      }

      // Company Name and Address
      if (companyName) {
        doc.setFontSize(20);
        doc.text(companyName, pageWidth / 2, yPos, { align: "center" });
        yPos += 8;
      }
      if (companyAddress) {
        doc.setFontSize(12);
        doc.text(companyAddress, pageWidth / 2, yPos, { align: "center" });
        yPos += 15; // More space after address
      }
    }

    // Project Name (if provided)
    if (projectName) {
      doc.setFontSize(22);
      doc.setFont(undefined, 'bold');
      doc.text(projectName, pageWidth / 2, yPos, { align: "center" });
      doc.setFont(undefined, 'normal');
      yPos += 15;
    }

    // Main Title
    doc.setFontSize(24);
    doc.text(t('calculator.title'), pageWidth / 2, yPos, { align: "center" });
    yPos += 15;

    // Date of Generation
    doc.setFontSize(10);
    doc.text(`${t('summary.date')}: ${new Date().toLocaleDateString()}`, pageWidth - margin, yPos, { align: "right" });
    yPos += 10;

    // Print Details Section
    if (isProfessional) {
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text(t('summary.projectDetails'), margin, yPos);
      doc.setFont(undefined, 'normal');
      yPos += 10;

      doc.setFontSize(12);
      const printDetails = [
        { label: t('summary.printType'), value: printType === 'filament' ? t('settings.filamentPrinting') : t('settings.resinPrinting') },
        { label: t('summary.printerProfile'), value: `${selectedPrinterProfile} (${printerPowerWatts}W)` },
        { label: t('summary.materialType'), value: `${selectedFilamentProfile} (${currencySymbol}${materialCostPerKg.toFixed(2)}/${printType === 'filament' ? 'kg' : 'L'})` },
        { label: printType === 'filament' ? t('summary.objectWeightGrams') : t('summary.objectVolumeMl'), value: `${objectWeightGrams.toFixed(2)} ${printType === 'filament' ? 'grams' : 'ml'}` },
        { label: t('summary.printTime'), value: `${printTimeHours.toFixed(2)} ${t('summary.hours')}` },
        { label: t('summary.postProcessingTime'), value: `${postProcessingTimeHours.toFixed(2)} ${t('summary.hours')}` },
        { label: t('summary.countryElectricity'), value: `${selectedCountry} (${currencySymbol}${electricityCostPerKWh.toFixed(2)}/kWh)` },
        { label: t('summary.laborHourlyRate'), value: `${currencySymbol}${laborHourlyRate.toFixed(2)}` },
        { label: t('summary.profitMargin'), value: `${profitMarginPercentage.toFixed(2)}%` },
        { label: t('summary.failedPrintRate'), value: `${failedPrintRatePercentage.toFixed(2)}%` },
        { label: t('summary.supportMaterialOverhead'), value: `${supportMaterialPercentage.toFixed(2)}%` },
      ];

      printDetails.forEach(item => {
        doc.text(`${item.label}`, margin, yPos);
        doc.text(`${item.value}`, pageWidth - margin, yPos, { align: "right" });
        yPos += 8;
        if (yPos > pageHeight - margin - 50) { // Check if new page is needed
          doc.addPage();
          yPos = margin;
        }
      });
      yPos += 10; // Space after print details
    }

    // Cost Breakdown Section
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(t('summary.costBreakdownDetails'), margin, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 10;

    doc.setFontSize(12);
    const summaryItems = [
      { label: t('summary.materialCost'), value: materialCost },
      { label: t('summary.electricityCost'), value: electricityCost },
      { label: t('summary.laborCost'), value: laborCost },
      { label: t('summary.designSetupFee'), value: designSetupFee },
      { label: t('summary.printerDepreciation'), value: printerDepreciationCost },
      { label: t('summary.supportMaterialCost'), value: supportMaterialCost },
      { label: t('summary.postProcessingMaterialCost'), value: postProcessingMaterialCost },
      { label: t('summary.shippingCost'), value: shippingCost },
    ];

    summaryItems.forEach(item => {
      doc.text(`${item.label}`, margin, yPos);
      doc.text(`${currencySymbol}${item.value.toFixed(2)}`, pageWidth - margin, yPos, { align: "right" });
      yPos += 8;
      if (yPos > pageHeight - margin - 50) { // Check if new page is needed
        doc.addPage();
        yPos = margin;
      }
    });

    yPos += 10; // Space before total

    // Total Estimated Price
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold'); // Make total bold
    doc.text(`${t('summary.totalEstimatedPrice')}:`, margin, yPos);
    doc.text(`${currencySymbol}${finalPrice.toFixed(2)}`, pageWidth - margin, yPos, { align: "right" });
    doc.setFont(undefined, 'normal'); // Reset font style
    yPos += 15;

    // Footer
    doc.setFontSize(10);
    doc.text(t('summary.developedBy'), pageWidth / 2, pageHeight - 10, { align: "center" });

    doc.save("3d_print_summary.pdf");
  };

  const handleSendEmail = () => {
    const summaryText = generateSummaryText();
    const subject = encodeURIComponent(t('summary.emailSubject'));
    const body = encodeURIComponent(summaryText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
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