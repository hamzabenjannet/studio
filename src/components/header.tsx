"use client";

import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";
import { useI18n } from "@/components/providers/i18n-provider";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell } from "lucide-react";
import { Input } from "./ui/input";
import Link from "next/link";

const userAvatar = {
  id: "user-avatar",
  description: "User avatar placeholder",
  imageUrl: "https://picsum.photos/seed/U1/40/40",
  imageHint: "person face",
};

export function Header() {
  const { user, logout } = useAuth();
  const t = useTranslations("Header");
  const { locale, setLocale } = useI18n();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex w-full items-center gap-4">
        <div className="relative flex-1">
          {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("searchPlaceholder")}
            className="w-full appearance-none bg-card pl-8 md:w-2/3 lg:w-1/3"
          /> */}
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">{t("notifications")}</span>
        </Button>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={userAvatar.imageUrl}
                    alt={userAvatar.description}
                    data-ai-hint={userAvatar.imageHint}
                  />
                  <AvatarFallback>{user.givenName}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Language / Langue</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setLocale("en")}>
                {locale === "en" ? "✓ " : ""}English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale("fr")}>
                {locale === "fr" ? "✓ " : ""}Français
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">{t("profile")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/billing">{t("billing")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">{t("settings")}</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                {t("logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild>
            <a href="/login">Login</a>
          </Button>
        )}
      </div>
    </header>
  );
}
