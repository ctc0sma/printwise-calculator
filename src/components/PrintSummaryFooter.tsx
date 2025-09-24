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
}) => {
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false); // State to manage collapsible section
  const { t } = useTranslation("common"); // Use translation hook

  const generateSummaryText = () => {
    return `${t("appName")}:

${t("materialCost")} ${currencySymbol}${materialCost.toFixed(2)}
${t("electricityCost")} ${currencySymbol}${electricityCost.toFixed(2)}
${t("laborCost")} ${currencySymbol}${laborCost.toFixed(2)}
${t("designSetupFee")} ${currencySymbol}${designSetupFee.toFixed(2)}
${t("printerDepreciation")} ${currencySymbol}${printerDepreciationCost.toFixed(2)}
${t("supportMaterialCost")} ${currencySymbol}${supportMaterialCost.toFixed(2)}
${t("postProcessingMaterialCost")} ${currencySymbol}${postProcessingMaterialCost.toFixed(2)}
${t("shippingCost")} ${currencySymbol}${shippingCost.toFixed(2)}

${t("totalEstimatedPrice")} ${currencySymbol}${finalPrice.toFixed(2)}
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
    doc.text(t("appName"), pageWidth / 2, yPos, { align: "center" });
    yPos += 15;

    // Date of Generation
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin, yPos, { align: "right" });
    yPos += 10;

    // Print Details Section
    if (isProfessional) {
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text(t("projectDetails"), margin, yPos);
      doc.setFont(undefined, 'normal');
      yPos += 10;

      doc.setFontSize(12);
      const printDetails = [
        { label: t("printType"), value: printType === 'filament' ? t("filamentPrinting") : t("resinPrinting") },
        { label: t("printerProfile"), value: `${selectedPrinterProfile} (${printerPowerWatts}W)` },
        { label: t("materialType"), value: `${selectedFilamentProfile} (${currencySymbol}${materialCostPerKg.toFixed(2)}/${printType === 'filament' ? 'kg' : 'L'})` },
        { label: printType === 'filament' ? t("objectWeightGrams") : t("objectVolumeMl"), value: `${objectWeightGrams.toFixed(2)} ${printType === 'filament' ? 'grams' : 'ml'}` },
        { label: t("printTimeHours"), value: `${printTimeHours.toFixed(2)} hours` },
        { label: t("postProcessingTimeHours"), value: `${postProcessingTimeHours.toFixed(2)} hours` },
        { label: t("country") + " (" + t("electricityCost") + "):", value: `${selectedCountry} (${currencySymbol}${electricityCostPerKWh.toFixed(2)}/kWh)` },
        { label: t("laborHourlyRate") + ":", value: `${currencySymbol}${laborHourlyRate.toFixed(2)}` },
        { label: t("profitMarginPercentage") + ":", value: `${profitMarginPercentage.toFixed(2)}%` },
        { label: t("failedPrintRatePercentage") + ":", value: `${failedPrintRatePercentage.toFixed(2)}%` },
        { label: t("supportMaterialOverhead") + ":", value: `${supportMaterialPercentage.toFixed(2)}%` },
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
    doc.text(t("costBreakdownDetails"), margin, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 10;

    doc.setFontSize(12);
    const summaryItems = [
      { label: t("materialCost"), value: materialCost },
      { label: t("electricityCost"), value: electricityCost },
      { label: t("laborCost"), value: laborCost },
      { label: t("designSetupFee"), value: designSetupFee },
      { label: t("printerDepreciation"), value: printerDepreciationCost },
      { label: t("supportMaterialCost"), value: supportMaterialCost },
      { label: t("postProcessingMaterialCost"), value: postProcessingMaterialCost },
      { label: t("shippingCost"), value: shippingCost },
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
    doc.text(t("totalEstimatedPrice"), margin, yPos);
    doc.text(`${currencySymbol}${finalPrice.toFixed(2)}`, pageWidth - margin, yPos, { align: "right" });
    doc.setFont(undefined, 'normal'); // Reset font style
    yPos += 15;

    // Footer
    doc.setFontSize(10);
    doc.text(t("developedBy") + " " + t("appName"), pageWidth / 2, pageHeight - 10, { align: "center" });

    doc.save("3d_print_summary.pdf");
  };

  const handleSendEmail = () => {
    const summaryText = generateSummaryText();
    const subject = encodeURIComponent(t("appName") + " " + t("costBreakdownDetails"));
    const body = encodeURIComponent(summaryText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg p-4 z-50 dark:bg-gray-800 dark:border-gray-700">
      <div className="w-full max-w-2xl mx-auto flex flex-col space-y-2">
        <Collapsible open={isBreakdownOpen} onOpenChange={setIsBreakdownOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between text-base font-medium px-0">
              <span>{t("costBreakdownDetails")}</span>
              {isBreakdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Separator className="my-2" />
            <div className="w-full grid grid-cols-2 gap-2 text-base font-medium">
              <div className="text-left">{t("materialCost")}</div>
              <div className="text-right">{currencySymbol}{materialCost.toFixed(2)}</div>

              <div className="text-left">{t("electricityCost")}</div>
              <div className="text-right">{currencySymbol}{electricityCost.toFixed(2)}</div>

              <div className="text-left">{t("laborCost")}</div>
              <div className="text-right">{currencySymbol}{laborCost.toFixed(2)}</div>

              <div className="text-left">{t("designSetupFee")}</div>
              <div className="text-right">{currencySymbol}{designSetupFee.toFixed(2)}</div>

              <div className="text-left">{t("printerDepreciation")}</div>
              <div className="text-right">{currencySymbol}{printerDepreciationCost.toFixed(2)}</div>

              <div className="text-left">{t("supportMaterialCost")}</div>
              <div className="text-right">{currencySymbol}{supportMaterialCost.toFixed(2)}</div>

              <div className="text-left">{t("postProcessingMaterialCost")}</div>
              <div className="text-right">{currencySymbol}{postProcessingMaterialCost.toFixed(2)}</div>

              <div className="text-left">{t("shippingCost")}</div>
              <div className="text-right">{currencySymbol}{shippingCost.toFixed(2)}</div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Separator />
        <div className="w-full flex justify-between items-center text-xl font-bold mt-2">
          <span>{t("totalEstimatedPrice")}</span>
          <span>{currencySymbol}{finalPrice.toFixed(2)}</span>
        </div>
        <div className="w-full flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={handleExportSummary}>
            {t("exportSummaryPdf")}
          </Button>
          <Button onClick={handleSendEmail}>
            {t("sendViaEmail")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrintSummaryFooter;