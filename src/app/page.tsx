import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/main-sidebar";
import { Header } from "@/components/header";
import { DashboardStats } from "@/components/dashboard-stats";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wrench, ListTodo, Receipt } from "lucide-react";

// Mock data
const recentRepairs = [
  { id: 'OR-12345', vehicle: 'Renault Clio - AB-123-CD', client: 'Jean Dupont', status: 'En cours', total: '250.00€' },
  { id: 'OR-12346', vehicle: 'Peugeot 208 - EF-456-GH', client: 'Marie Curie', status: 'Terminé', total: '150.00€' },
  { id: 'OR-12347', vehicle: 'Citroen C3 - IJ-789-KL', client: 'Pierre Martin', status: 'En attente', total: '450.00€' },
  { id: 'OR-12348', vehicle: 'VW Golf - MN-012-OP', client: 'Sophie Lambert', status: 'En cours', total: '80.00€' },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'En cours': return 'secondary';
    case 'Terminé': return 'default';
    case 'En attente': return 'outline';
    default: return 'secondary';
  }
};


export default function Home() {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
          <div className="space-y-2">
              <h1 className="text-3xl font-headline font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Un aperçu de votre garage.</p>
          </div>
          <DashboardStats />
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Réparations Récentes</CardTitle>
                <CardDescription>Les 4 derniers ordres de réparation.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Véhicule</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentRepairs.map((repair) => (
                      <TableRow key={repair.id}>
                        <TableCell>
                          <div className="font-medium">{repair.client}</div>
                          <div className="text-sm text-muted-foreground">{repair.id}</div>
                        </TableCell>
                        <TableCell>{repair.vehicle}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(repair.status) as any}>{repair.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{repair.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Activité Récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Wrench className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Nouvel ordre de réparation créé</p>
                      <p className="text-sm text-muted-foreground">#OR-12348 pour VW Golf</p>
                      <time className="text-xs text-muted-foreground">il y a 5 minutes</time>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                       <ListTodo className="h-4 w-4" />
                     </div>
                     <div>
                       <p className="font-medium">Tâche "Changer plaquettes" terminée</p>
                       <p className="text-sm text-muted-foreground">Assignée à Marc</p>
                       <time className="text-xs text-muted-foreground">il y a 30 minutes</time>
                     </div>
                   </div>
                   <div className="flex items-start gap-4">
                     <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                       <Receipt className="h-4 w-4" />
                     </div>
                     <div>
                       <p className="font-medium">Facture #FA-0987 envoyée</p>
                       <p className="text-sm text-muted-foreground">Client: Marie Curie</p>
                       <time className="text-xs text-muted-foreground">il y a 2 heures</time>
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
