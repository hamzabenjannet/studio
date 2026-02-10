"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/main-sidebar";
import { Header } from "@/components/header";
import withAuth from "@/hoc/withAuth";

function TasksPage() {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-headline font-bold tracking-tight">
              Tasks
            </h1>
            <p className="text-muted-foreground">
              Manage your tasks and those of your team.
            </p>
          </div>
          {/* Placeholder for tasks content */}
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/20 py-32">
            <p className="text-muted-foreground">
              The tasks page content will be available soon.
            </p>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default withAuth(TasksPage);
