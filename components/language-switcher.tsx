"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/context/i18n-context";
import { Check } from "lucide-react";

const LanguageSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { locale, setLocale } = useI18n();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLocale(newLanguage);
  };

  const ICON_SIZE = 16;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"sm"} className="relative">
          <Languages
            size={ICON_SIZE}
            className={"text-muted-foreground"}
          />
          <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center">
            {locale === 'en' ? 'EN' : 'PT'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32" align="end">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={handleLanguageChange}
        >
          <DropdownMenuRadioItem 
            className="flex items-center justify-between px-3 py-2 cursor-pointer" 
            value="en"
          >
            <span>English</span>
            {locale === "en" && <Check size={16} className="text-primary" />}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem 
            className="flex items-center justify-between px-3 py-2 cursor-pointer" 
            value="pt-br"
          >
            <span>Português</span>
            {locale === "pt-br" && <Check size={16} className="text-primary" />}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { LanguageSwitcher }; 