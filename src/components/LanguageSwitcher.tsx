"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("en")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("es")}>
          Español
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("fil")}>
          Filipino
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("de")}>
          Deutsch
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("fr")}>
          Français
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("it")}>
          Italiano
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("pt")}>
          Português
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}