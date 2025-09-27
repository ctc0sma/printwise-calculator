import { jsPDF } from "jspdf";
import i18n from "@/i18n"; // Import i18n instance directly

interface CalculationData {
  materialCost: number;
  electricityCost: number;
  laborCost: number;
  designSetupFee: number;
  printerDepreciationCost: number;
  shippingCost: number;
  supportMaterialCost: number;
  postProcessingMaterialCost: number;
  finalPrice: number;
  currency: string;
  pdfExportMode: 'standard' | 'professional';
  companyName: string;
  companyAddress: string;
  companyLogoUrl: string;
  printType: 'filament' | 'resin';
  selectedPrinterProfile: string;
  printerPowerWatts: number;
  selectedFilamentProfile: string;
  materialCostPerKg: number;
  objectValue: number; // Can be grams or ml
  printTimeHours: number;
  electricityCostPerKWh: number;
  laborHourlyRate: number;
  profitMarginPercentage: number;
  failedPrintRatePercentage: number;
  supportMaterialPercentage: number;
  postProcessingTimeHours: number;
  selectedCountry: string;
  projectName: string;
  created_at?: string; // Optional for historical calculations
}

export const generatePdfSummary = async (calculation: { project_name: string; calculation_data: CalculationData; created_at?: string }) => {
  const doc = new jsPDF();
  let yPos = 20;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const data = calculation.calculation_data;
  const t = i18n.t; // Use i18n.t for translations

  const isProfessional = data.pdfExportMode === 'professional';

  if (isProfessional) {
    if (data.companyLogoUrl) {
      try {
        const response = await fetch(data.companyLogoUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        await new Promise<void>((resolve) => {
          reader.onloadend = () => {
            const imgData = reader.result as string;
            const imgWidth = 50;
            const imgHeight = 25;
            const x = (pageWidth - imgWidth) / 2;
            doc.addImage(imgData, 'PNG', x, yPos, imgWidth, imgHeight);
            yPos += imgHeight + 10;
            resolve();
          };
        });
      } catch (error) {
        console.error("Failed to load company logo:", error);
      }
    }

    if (data.companyName) {
      doc.setFontSize(20);
      doc.text(data.companyName, pageWidth / 2, yPos, { align: "center" });
      yPos += 8;
    }
    if (data.companyAddress) {
      doc.setFontSize(12);
      doc.text(data.companyAddress, pageWidth / 2, yPos, { align: "center" });
      yPos += 15;
    }
  }

  if (data.projectName) {
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text(data.projectName, pageWidth / 2, yPos, { align: "center" });
    doc.setFont(undefined, 'normal');
    yPos += 15;
  }

  doc.setFontSize(24);
  doc.text(t('calculator.title'), pageWidth / 2, yPos, { align: "center" });
  yPos += 15;

  doc.setFontSize(10);
  const dateToDisplay = calculation.created_at ? new Date(calculation.created_at).toLocaleDateString() : new Date().toLocaleDateString();
  doc.text(`${t('summary.date')}: ${dateToDisplay}`, pageWidth - margin, yPos, { align: "right" });
  yPos += 10;

  if (isProfessional) {
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(t('summary.projectDetails'), margin, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 10;

    doc.setFontSize(12);
    const printDetails = [
      { label: t('summary.printType'), value: data.printType === 'filament' ? t('settings.filamentPrinting') : t('settings.resinPrinting') },
      { label: t('summary.printerProfile'), value: `${data.selectedPrinterProfile} (${data.printerPowerWatts}W)` },
      { label: t('summary.materialType'), value: `${data.selectedFilamentProfile} (${data.currency}${data.materialCostPerKg.toFixed(2)}/${data.printType === 'filament' ? 'kg' : 'L'})` },
      { label: data.printType === 'filament' ? t('summary.objectWeightGrams') : t('summary.objectVolumeMl'), value: `${data.objectValue.toFixed(2)} ${data.printType === 'filament' ? 'grams' : 'ml'}` },
      { label: t('summary.printTime'), value: `${data.printTimeHours.toFixed(2)} ${t('summary.hours')}` },
      { label: t('summary.postProcessingTime'), value: `${data.postProcessingTimeHours.toFixed(2)} ${t('summary.hours')}` },
      { label: t('summary.countryElectricity'), value: `${data.selectedCountry} (${data.currency}${data.electricityCostPerKWh.toFixed(2)}/kWh)` },
      { label: t('summary.laborHourlyRate'), value: `${data.currency}${data.laborHourlyRate.toFixed(2)}` },
      { label: t('summary.profitMargin'), value: `${data.profitMarginPercentage.toFixed(2)}%` },
      { label: t('summary.failedPrintRate'), value: `${data.failedPrintRatePercentage.toFixed(2)}%` },
      { label: t('summary.supportMaterialOverhead'), value: `${data.supportMaterialPercentage.toFixed(2)}%` },
    ];

    printDetails.forEach(item => {
      doc.text(`${item.label}`, margin, yPos);
      doc.text(`${item.value}`, pageWidth - margin, yPos, { align: "right" });
      yPos += 8;
      if (yPos > pageHeight - margin - 50) {
        doc.addPage();
        yPos = margin;
      }
    });
    yPos += 10;
  }

  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text(t('summary.costBreakdownDetails'), margin, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 10;

  doc.setFontSize(12);
  const summaryItems = [
    { label: t('summary.materialCost'), value: data.materialCost },
    { label: t('summary.electricityCost'), value: data.electricityCost },
    { label: t('summary.laborCost'), value: data.laborCost },
    { label: t('summary.designSetupFee'), value: data.designSetupFee },
    { label: t('summary.printerDepreciation'), value: data.printerDepreciationCost },
    { label: t('summary.supportMaterialCost'), value: data.supportMaterialCost },
    { label: t('summary.postProcessingMaterialCost'), value: data.postProcessingMaterialCost },
    { label: t('summary.shippingCost'), value: data.shippingCost },
  ];

  summaryItems.forEach(item => {
    doc.text(`${item.label}`, margin, yPos);
    doc.text(`${data.currency}${item.value.toFixed(2)}`, pageWidth - margin, yPos, { align: "right" });
    yPos += 8;
    if (yPos > pageHeight - margin - 50) {
      doc.addPage();
      yPos = margin;
    }
  });

  yPos += 10;

  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text(`${t('summary.totalEstimatedPrice')}:`, margin, yPos);
  doc.text(`${data.currency}${data.finalPrice.toFixed(2)}`, pageWidth - margin, yPos, { align: "right" });
  doc.setFont(undefined, 'normal');
  yPos += 15;

  doc.setFontSize(10);
  doc.text(t('summary.developedBy'), pageWidth / 2, pageHeight - 10, { align: "center" });

  doc.save(`${calculation.project_name || '3d_print_summary'}.pdf`);
};

export const sendEmailSummary = (calculation: { project_name: string; calculation_data: CalculationData }) => {
  const data = calculation.calculation_data;
  const t = i18n.t; // Use i18n.t for translations

  const summaryText = `PrintWise Calculator:

${t('summary.materialCost')}: ${data.currency}${data.materialCost.toFixed(2)}
${t('summary.electricityCost')}: ${data.currency}${data.electricityCost.toFixed(2)}
${t('summary.laborCost')}: ${data.currency}${data.laborCost.toFixed(2)}
${t('summary.designSetupFee')}: ${data.currency}${data.designSetupFee.toFixed(2)}
${t('summary.printerDepreciation')}: ${data.currency}${data.printerDepreciationCost.toFixed(2)}
${t('summary.supportMaterialCost')}: ${data.currency}${data.supportMaterialCost.toFixed(2)}
${t('summary.postProcessingMaterialCost')}: ${data.currency}${data.postProcessingMaterialCost.toFixed(2)}
${t('summary.shippingCost')}: ${data.currency}${data.shippingCost.toFixed(2)}

${t('summary.totalEstimatedPrice')}: ${data.currency}${data.finalPrice.toFixed(2)}
`;
  const subject = encodeURIComponent(`${t('summary.emailSubject')} - ${calculation.project_name}`);
  const body = encodeURIComponent(summaryText);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
};