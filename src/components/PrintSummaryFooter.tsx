"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf"; // Import jsPDF

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
  isCompanyMode: boolean; // New: Company mode flag
  companyName: string; // New: Company name
  companyAddress: string; // New: Company address
  companyLogoUrl: string; // New: Company logo URL
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
  isCompanyMode,
  companyName,
  companyAddress,
  companyLogoUrl,
}) => {
  const generateSummaryText = () => {
    return `3D Print Price Summary:

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

    if (isCompanyMode && companyName) {
      if (companyLogoUrl) {
        try {
          const response = await fetch(companyLogoUrl);
          const blob = await response.blob();
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          await new Promise<void>((resolve) => {
            reader.onloadend = () => {
              const imgData = reader.result as string;
              const imgWidth = 40; // Adjust as needed
              const imgHeight = 20; // Adjust as needed
              const x = (pageWidth - imgWidth) / 2; // Center the image
              doc.addImage(imgData, 'PNG', x, yPos, imgWidth, imgHeight);
              yPos += imgHeight + 5; // Space after logo
              resolve();
            };
          });
        } catch (error) {
          console.error("Failed to load company logo:", error);
          // Continue without logo if it fails
        }
      }

      doc.setFontSize(18);
      doc.text(companyName, pageWidth / 2, yPos, { align: "center" });
      yPos += 7;

      if (companyAddress) {
        doc.setFontSize(10);
        doc.text(companyAddress, pageWidth / 2, yPos, { align: "center" });
        yPos += 10;
      }
      yPos += 10; // Extra space after company details
    }

    doc.setFontSize(22);
    doc.text("3D Print Price Summary", pageWidth / 2, yPos, { align: "center" });
    yPos += 15;

    doc.setFontSize(12);
    const summaryLines = [
      `Material Cost: ${currencySymbol}${materialCost.toFixed(2)}`,
      `Electricity Cost: ${currencySymbol}${electricityCost.toFixed(2)}`,
      `Labor Cost: ${currencySymbol}${laborCost.toFixed(2)}`,
      `Design/Setup Fee: ${currencySymbol}${designSetupFee.toFixed(2)}`,
      `Printer Depreciation: ${currencySymbol}${printerDepreciationCost.toFixed(2)}`,
      `Support Material Cost: ${currencySymbol}${supportMaterialCost.toFixed(2)}`,
      `Post-processing Material Cost: ${currencySymbol}${postProcessingMaterialCost.toFixed(2)}`,
      `Shipping Cost: ${currencySymbol}${shippingCost.toFixed(2)}`,
    ];

    summaryLines.forEach(line => {
      doc.text(line, margin, yPos);
      yPos += 10;
    });

    yPos += 5; // Add a little extra space before total

    doc.setFontSize(16);
    doc.text(`Total Estimated Price: ${currencySymbol}${finalPrice.toFixed(2)}`, margin, yPos);

    doc.save("3d_print_summary.pdf");
  };

  const handleSendEmail = () => {
    const summaryText = generateSummaryText();
    const subject = encodeURIComponent("3D Print Price Summary");
    const body = encodeURIComponent(summaryText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg p-4 z-50 dark:bg-gray-800 dark:border-gray-700">
      <div className="w-full max-w-2xl mx-auto flex flex-col space-y-2">
        <Separator />
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