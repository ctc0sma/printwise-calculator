"use client";

import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf"; // Import jsPDF
import { ChevronDown, ChevronUp } from "lucide-react"; // Import icons
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"; // Import Collapsible components

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

  // Call the prop function when the breakdown state changes
  React.useEffect(() => {
    onToggleBreakdown(!isBreakdownOpen); // Pass true if collapsed, false if open
  }, [isBreakdownOpen, onToggleBreakdown]);

  const generateSummaryText = () => {
    return `PrintWise Calculator:

Material Cost: ${currencySymbol}${materialCost.toFixed(2)}
Electricity Cost: ${currencySymbol}${electricityCost.toFixed(2)}
Labor Cost: ${currencySymbol}${laborCost.toFixed(2)}
Design/Setup Fee: ${currencySymbol}${designSetupFee.toFixed(2)}
Printer Depreciation: ${currencySymbol}${printerDepreciationCost.toFixed(2)}
Support Material Cost: ${currencySymbol}${supportMaterialCost.toFixed(2)}
Post-processing Material Cost: ${currencySymbol}${postProcessingMaterialCost.toFixed(2)}
Shipping Cost: ${currencySymbol}${shippingCost.toFixed(2)}

Total Estimated Price: ${currencySymbol}${finalPrice.toFixed(2)}
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
    doc.text("PrintWise Calculator", pageWidth / 2, yPos, { align: "center" });
    yPos += 15;

    // Date of Generation
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin, yPos, { align: "right" });
    yPos += 10;

    // Print Details Section
    if (isProfessional) {
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text("Project Details", margin, yPos);
      doc.setFont(undefined, 'normal');
      yPos += 10;

      doc.setFontSize(12);
      const printDetails = [
        { label: "Print Type:", value: printType === 'filament' ? "Filament Printing" : "Resin Printing" },
        { label: "Printer Profile:", value: `${selectedPrinterProfile} (${printerPowerWatts}W)` },
        { label: "Material Type:", value: `${selectedFilamentProfile} (${currencySymbol}${materialCostPerKg.toFixed(2)}/${printType === 'filament' ? 'kg' : 'L'})` },
        { label: printType === 'filament' ? "Object Weight (grams):" : "Object Volume (ml):", value: `${objectWeightGrams.toFixed(2)} ${printType === 'filament' ? 'grams' : 'ml'}` },
        { label: "Print Time:", value: `${printTimeHours.toFixed(2)} hours` },
        { label: "Post-processing Time:", value: `${postProcessingTimeHours.toFixed(2)} hours` },
        { label: "Country (Electricity):", value: `${selectedCountry} (${currencySymbol}${electricityCostPerKWh.toFixed(2)}/kWh)` },
        { label: "Labor Hourly Rate:", value: `${currencySymbol}${laborHourlyRate.toFixed(2)}` },
        { label: "Profit Margin:", value: `${profitMarginPercentage.toFixed(2)}%` },
        { label: "Failed Print Rate:", value: `${failedPrintRatePercentage.toFixed(2)}%` },
        { label: "Support Material Overhead:", value: `${supportMaterialPercentage.toFixed(2)}%` },
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
    doc.text("Cost Breakdown Details", margin, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 10;

    doc.setFontSize(12);
    const summaryItems = [
      { label: "Material Cost:", value: materialCost },
      { label: "Electricity Cost:", value: electricityCost },
      { label: "Labor Cost:", value: laborCost },
      { label: "Design/Setup Fee:", value: designSetupFee },
      { label: "Printer Depreciation:", value: printerDepreciationCost },
      { label: "Support Material Cost:", value: supportMaterialCost },
      { label: "Post-processing Material Cost:", value: postProcessingMaterialCost },
      { label: "Shipping Cost:", value: shippingCost },
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
    doc.text("Total Estimated Price:", margin, yPos);
    doc.text(`${currencySymbol}${finalPrice.toFixed(2)}`, pageWidth - margin, yPos, { align: "right" });
    doc.setFont(undefined, 'normal'); // Reset font style
    yPos += 15;

    // Footer
    doc.setFontSize(10);
    doc.text("Developed by PrintWise Calculator", pageWidth / 2, pageHeight - 10, { align: "center" });

    doc.save("3d_print_summary.pdf");
  };

  const handleSendEmail = () => {
    const summaryText = generateSummaryText();
    const subject = encodeURIComponent("PrintWise Calculator Cost Breakdown Details");
    const body = encodeURIComponent(summaryText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg p-4 z-50 dark:bg-gray-800 dark:border-gray-700">
      <div className="w-full max-w-2xl mx-auto flex flex-col space-y-2">
        <Collapsible open={isBreakdownOpen} onOpenChange={setIsBreakdownOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between text-base font-medium px-0">
              <span>Cost Breakdown Details</span>
              {isBreakdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Separator className="my-2" />
            <div className="w-full grid grid-cols-2 gap-2 text-base font-medium">
              <div className="text-left">Material Cost:</div>
              <div className="text-right">{currencySymbol}{materialCost.toFixed(2)}</div>

              <div className="text-left">Electricity Cost:</div>
              <div className="text-right">{currencySymbol}{electricityCost.toFixed(2)}</div>

              <div className="text-left">Labor Cost:</div>
              <div className="text-right">{currencySymbol}{laborCost.toFixed(2)}</div>

              <div className="text-left">Design/Setup Fee:</div>
              <div className="text-right">{currencySymbol}{designSetupFee.toFixed(2)}</div>

              <div className="text-left">Printer Depreciation:</div>
              <div className="text-right">{currencySymbol}{printerDepreciationCost.toFixed(2)}</div>

              <div className="text-left">Support Material Cost:</div>
              <div className="text-right">{currencySymbol}{supportMaterialCost.toFixed(2)}</div>

              <div className="text-left">Post-processing Material Cost:</div>
              <div className="text-right">{currencySymbol}{postProcessingMaterialCost.toFixed(2)}</div>

              <div className="text-left">Shipping Cost:</div>
              <div className="text-right">{currencySymbol}{shippingCost.toFixed(2)}</div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Separator />
        <div className="w-full flex justify-between items-center text-xl font-bold mt-2">
          <span>Total Estimated Price:</span>
          <span>{currencySymbol}{finalPrice.toFixed(2)}</span>
        </div>
        <div className="w-full flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={handleExportSummary}>
            Export Summary (PDF)
          </Button>
          <Button onClick={handleSendEmail}>
            Send via Email
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrintSummaryFooter;