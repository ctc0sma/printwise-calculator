"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useTranslation } from "react-i18next";

const Credits = () => {
  const { t } = useTranslation();
  const appVersion = "1.0.2";

  return (
    <Card className="w-full max-w-2xl shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">{t('credits.title')}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-700 dark:text-gray-300">
          {t('credits.appDescription')}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          {t('credits.thanksMessage')}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          {t('credits.developedBy')}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Version {appVersion}
        </p>
        <MadeWithDyad />
      </CardContent>
    </Card>
  );
};

export default Credits;