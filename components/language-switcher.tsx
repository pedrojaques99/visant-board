"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useI18n } from "@/context/i18n-context";
import { Check } from "lucide-react";
import { FlagIcon } from "@/components/ui/flag-icon";
import { cn } from "@/lib/utils";

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative w-8 h-8 p-0">
          <FlagIcon 
            country={locale === 'en' ? 'us' : 'br'} 
            className="text-muted-foreground"
          />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={handleLanguageChange}
        >
          <DropdownMenuRadioItem 
            className="flex items-center gap-2 px-3 py-2.5 cursor-pointer pl-3" 
            value="en"
          >
            <FlagIcon country="us" size={18} />
            <span className="ml-1">English</span>
            {locale === "en" && (
              <Check size={16} className="ml-auto text-primary" />
            )}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem 
            className="flex items-center gap-2 px-3 py-2.5 cursor-pointer pl-3" 
            value="pt-br"
          >
            <FlagIcon country="br" size={18} />
            <span className="ml-1">Português</span>
            {locale === "pt-br" && (
              <Check size={16} className="ml-auto text-primary" />
            )}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { LanguageSwitcher }; 