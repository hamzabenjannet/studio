"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Wrench,
  Users,
  Box,
  Receipt,
  Settings,
  ListTodo,
  Car,
  Shapes,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const logo = {
  id: "app-logo",
  description: "Application logo placeholder",
  imageUrl: "https://picsum.photos/seed/logo/40/40",
  imageHint: "abstract gear",
};

export function MainSidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <Image
            src={logo.imageUrl}
            alt={logo.description}
            data-ai-hint={logo.imageHint}
            width={40}
            height={40}
            className="rounded-lg"
          />
          <div className="flex flex-col">
            <h2 className="text-lg font-headline font-semibold text-sidebar-foreground">
              AutoAssistant Pro
            </h2>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/")}
              tooltip="Dashboard"
            >
              <Link href="/">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/tasks")}
              tooltip="Tâches"
            >
              <Link href="/tasks">
                <ListTodo />
                <span>Tâches</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/workOrders")}
              tooltip="Ordres de Réparation"
            >
              <Link href="/workOrders">
                <Wrench />
                <span>Ordres de Réparation</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/clients")}
              tooltip="Clients"
            >
              <Link href="/clients">
                <Users />
                <span>Clients</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/vehicles")}
              tooltip="Véhicules"
            >
              <Link href="/vehicles">
                <Car />
                <span>Véhicules</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/stock")}
              tooltip="Stock"
            >
              <Link href="/stock">
                <Box />
                <span>Stock</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/billing")}
              tooltip="Facturation"
            >
              <Link href="/billing">
                <Receipt />
                <span>Facturation</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/entities")}
              tooltip="Entities"
            >
              <Link href="/entities">
                <Shapes />
                <span>Entities</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/settings")}
              tooltip="Paramètres"
            >
              <Link href="/settings">
                <Settings />
                <span>Paramètres</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
