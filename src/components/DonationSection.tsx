"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const DonationSection = () => {
  return (
    <Card className="w-full max-w-2xl shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Support Our Work</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-700 dark:text-gray-300">
          If you find PrintWise Calculator useful, please consider making a small donation to help us continue developing and improving the app. Your support is greatly appreciated!
        </p>
        <Button className="w-full md:w-auto" onClick={() => window.open("https://www.buymeacoffee.com/yourusername", "_blank")}>
          <Heart className="mr-2 h-4 w-4" /> Donate Now
        </Button>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          (Note: This is a placeholder link. Please replace "YOUR_ACTUAL_DONATION_LINK_HERE" with your actual donation link.)
        </p>
      </CardContent>
    </Card>
  );
};

export default DonationSection;