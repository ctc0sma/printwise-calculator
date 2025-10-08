"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next"; // Import useTranslation

const DonationSection = () => {
  const { t } = useTranslation(); // Initialize useTranslation

  return (
    <Card className="w-full max-w-2xl shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">{t('donation.title')}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-700 dark:text-gray-300">
          {t('donation.description')}
        </p>
        <Button className="w-full md:w-auto" onClick={() => window.open("https://www.buymeacoffee.com/ctcosma", "_blank")}>
          <Heart className="mr-2 h-4 w-4" /> {t('donation.donateNow')}
        </Button>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('donation.note')}
        </p>
      </CardContent>
    </Card>
  );
};

export default DonationSection;