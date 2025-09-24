"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";

interface PrintSummaryFooterProps {
  materialCost: number;
  electricityCost: number;
  laborCost: number;
  designSetupFee: number;
  printerDepreciationCost: number;
  shippingCost: number;
  supportMaterialCost: number; // New prop
  postProcessingMaterialCost: number; // New prop
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
  supportMaterialCost, // Destructure new prop
  postProcessingMaterialCost, // Destructure new prop
  finalPrice,
  currencySymbol,
}) => {
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

          <div className="text-left">Support Material Cost:</div> {/* Display new cost */}
          <div className="text-right">{currencySymbol}{supportMaterialCost.toFixed(2)}</div>

          <div className="text-left">Post-processing Material Cost:</div> {/* Display new cost */}
          <div className="text-right">{currencySymbol}{postProcessingMaterialCost.toFixed(2)}</div>

          <div className="text-left">Shipping Cost:</div>
          <div className="text-right">{currencySymbol}{shippingCost.toFixed(2)}</div>
        </div>
        <Separator />
        <div className="w-full flex justify-between items-center text-xl font-bold mt-2">
          <span>Total Estimated Price:</span>
          <span>{currencySymbol}{finalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default PrintSummaryFooter;