"use client";

import React, { useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Download, Mail } from "lucide-react";
import { useSession } from "@/context/SessionContext";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { useTranslation } from "react-i18next";

const HistoricalCalculations = () => {
  const { savedCalculations, fetchSavedCalculations, deleteCalculation } = useSettings();
  const { session, loading, isGuest } = useSession();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && !session) {
      toast.error(t('history.loginToView'));
      navigate("/login");
    } else if (session) {
      fetchSavedCalculations();
    }
  }, [session, loading, navigate, fetchSavedCalculations, t]);

  const handleLoadCalculation = (calculationData: any) => {
    // This would ideally update the main calculator state, but for now, we'll just log it.
    // In a full implementation, you'd pass this data back to the PrintCalculator component.
    console.log("Loading calculation:", calculationData);
    toast.info(t('history.calculationLoaded'));
    // For now, we'll navigate to the calculator and let the user manually input values
    // A more advanced feature would be to pre-fill the calculator with this data.
    navigate("/");
  };

  const handleExportPdf = async (calculation: any) => {
    const doc = new jsPDF();
    let yPos = 20;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const data = calculation.calculation_data;

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
    doc.text(`${t('summary.date')}: ${new Date(calculation.created_at).toLocaleDateString()}`, pageWidth - margin, yPos, { align: "right" });
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

  const handleSendEmail = (calculation: any) => {
    const data = calculation.calculation_data;
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">{t('common.loading')}</div>;
  }

  if (!session) {
    return null; // Redirect handled by useEffect
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between p-6">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <CardTitle className="text-3xl font-bold text-center flex-grow-0">{t('history.title')}</CardTitle>
          <div className="w-10"></div> {/* Placeholder for alignment */}
        </CardHeader>
        <CardContent className="space-y-4">
          {savedCalculations.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">{t('history.noSavedCalculations')}</p>
          ) : (
            <div className="space-y-4">
              {savedCalculations.map((calculation) => (
                <Card key={calculation.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between dark:border-gray-700">
                  <div className="flex-grow mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold">{calculation.project_name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('history.savedOn')}: {new Date(calculation.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-md font-bold mt-1">
                      {t('summary.totalEstimatedPrice')}: {calculation.calculation_data.currency}{calculation.calculation_data.finalPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleLoadCalculation(calculation.calculation_data)}>
                      {t('history.load')}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExportPdf(calculation)}>
                      <Download className="h-4 w-4 mr-2" /> {t('summary.exportPdf')}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleSendEmail(calculation)}>
                      <Mail className="h-4 w-4 mr-2" /> {t('summary.sendEmail')}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteCalculation(calculation.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoricalCalculations;