"use client";

import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/main-sidebar";
import { Header } from "@/components/header";
import withAuth from "@/hoc/withAuth";
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    plateNumber: string;
    owner: string;
    status: 'Active' | 'In-Repair' | 'Archived' | 'Sold';
}

// Mock data
const mockClients = [
    { id: 'client-1', name: 'Jean Dupont' },
    { id: 'client-2', name: 'Marie Curie' },
    { id: 'client-3', name: 'Pierre Martin' },
];

const initialVehicles: Vehicle[] = [
    { id: 'veh-1', make: 'Renault', model: 'Clio', year: 2022, plateNumber: 'AB-123-CD', owner: 'Jean Dupont', status: 'Active' },
    { id: 'veh-2', make: 'Peugeot', model: '208', year: 2021, plateNumber: 'EF-456-GH', owner: 'Marie Curie', status: 'In-Repair' },
    { id: 'veh-3', make: 'Citroen', model: 'C3', year: 2020, plateNumber: 'IJ-789-KL', owner: 'Pierre Martin', status: 'Archived' },
];

const statusOptions: Vehicle['status'][] = ['Active', 'In-Repair', 'Archived', 'Sold'];


const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Active': return 'secondary';
    case 'In-Repair': return 'default';
    case 'Archived':
    case 'Sold':
        return 'outline';
    default: return 'secondary';
  }
};


function VehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    // You would manage form state here, e.g., with useState or react-hook-form
    const handleSaveVehicle = (event: React.FormEvent) => {
        event.preventDefault();
        // Logic to save the new vehicle
        // For demonstration, we'll just log and close the form
        console.log("Saving vehicle...");
        // Add to list
        // const newVehicle = ...
        // setVehicles(prev => [...prev, newVehicle]);
        setIsFormOpen(false);
    };

  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h1 className="text-3xl font-headline font-bold tracking-tight">Véhicules</h1>
              <p className="text-muted-foreground">Gérez la flotte de véhicules de vos clients.</p>
            </div>
             <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button><Plus className='mr-2 h-4 w-4' />Ajouter un véhicule</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations ci-dessous pour ajouter un nouveau véhicule.
                  </DialogDescription>
                </DialogHeader>
                 <form onSubmit={handleSaveVehicle}>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="make">Marque</Label>
                            <Input id="make" placeholder="Renault" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="model">Modèle</Label>
                            <Input id="model" placeholder="Clio" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="year">Année</Label>
                            <Input id="year" type="number" placeholder="2023" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="plateNumber">Immatriculation</Label>
                            <Input id="plateNumber" placeholder="AB-123-CD" />
                        </div>
                         <div className="col-span-2 space-y-2">
                            <Label htmlFor="vin">VIN</Label>
                            <Input id="vin" placeholder="VF123ABC..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="owner">Propriétaire</Label>
                            <Select>
                                <SelectTrigger id="owner">
                                <SelectValue placeholder="Sélectionnez un propriétaire" />
                                </SelectTrigger>
                                <SelectContent>
                                {mockClients.map(client => (
                                    <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="status">Statut</Label>
                            <Select defaultValue='Active'>
                                <SelectTrigger id="status">
                                <SelectValue placeholder="Sélectionnez un statut" />
                                </SelectTrigger>
                                <SelectContent>
                                {statusOptions.map(status => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Annuler</Button>
                    <Button type="submit">Sauvegarder</Button>
                    </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
           
           <Card>
                <CardHeader>
                    <CardTitle>Liste des véhicules</CardTitle>
                    <CardDescription>Consultez et gérez tous les véhicules enregistrés.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Véhicule</TableHead>
                            <TableHead>Immatriculation</TableHead>
                            <TableHead>Propriétaire</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vehicles.map((vehicle) => (
                            <TableRow key={vehicle.id}>
                                <TableCell>
                                    <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                                    <div className="text-sm text-muted-foreground">{vehicle.year}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-mono text-sm">{vehicle.plateNumber}</div>
                                </TableCell>
                                <TableCell>{vehicle.owner}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(vehicle.status)}>{vehicle.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                                        <DropdownMenuItem>Créer OR</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
           </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default withAuth(VehiclesPage);
