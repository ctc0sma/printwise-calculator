"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Credits = () => {
  return (
    <Card className="w-full max-w-2xl shadow-lg mt-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Credits</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-700 dark:text-gray-300">
          This application was developed to help you calculate 3D print costs efficiently.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Special thanks to the open-source community and libraries used in this project.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Developed by Tokyo with assistance from Dyad .

          putankinamo 🌴 🇵🇭 🫰
          
          chikiamou 🫏 🇨🇾 ✌️
        </p>
        <MadeWithDyad />
      </CardContent>
    </Card>
  );
};

export default Credits;