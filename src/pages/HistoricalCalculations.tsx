"use client";

import React, { useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Download, Mail } from "lucide-react";
import { useSession } from "@/context/SessionContext";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { generatePdfSummary, sendEmailSummary } from "@/utils/pdfExport"; // Import the new utility functions

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
    console.log("Loading calculation:", calculationData);
    toast.info(t('history.calculationLoaded'));
    navigate("/");
  };

  const handleExportPdf = async (calculation: any) => {
    await generatePdfSummary(calculation);
  };

  const handleSendEmail = (calculation: any) => {
    sendEmailSummary(calculation);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">{t('common.loading')}</div>;
  }

  if (!session) {
    return null;
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
          <div className="w-10"></div>
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