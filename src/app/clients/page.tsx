"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/main-sidebar";
import { Header } from "@/components/header";
import withAuth from "@/hoc/withAuth";

function ClientsPage() {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-headline font-bold tracking-tight">Clients & Véhicules</h1>
            <p className="text-muted-foreground">Gérez votre base de clients et leurs véhicules.</p>
          </div>
           {/* Placeholder for clients content */}
           <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/20 py-32">
            <p className="text-muted-foreground">Le contenu de la page des clients et véhicules sera bientôt disponible.</p>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default withAuth(ClientsPage);