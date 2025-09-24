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

  const handleExportSummary = () => {
    const doc = new jsPDF();
    let yPos = 20;

    doc.setFontSize(22);
    doc.text("3D Print Price Summary", 105, yPos, { align: "center" });
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
      doc.text(line, 20, yPos);
      yPos += 10;
    });

    yPos += 5; // Add a little extra space before total

    doc.setFontSize(16);
    doc.text(`Total Estimated Price: ${currencySymbol}${finalPrice.toFixed(2)}`, 20, yPos);

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