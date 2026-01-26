"use client";

import React, { useState, useEffect } from 'react';
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
    vin: string;
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
    { id: 'veh-1', make: 'Renault', model: 'Clio', year: 2022, plateNumber: 'AB-123-CD', vin: 'VF1CL0H...', owner: 'Jean Dupont', status: 'Active' },
    { id: 'veh-2', make: 'Peugeot', model: '208', year: 2021, plateNumber: 'EF-456-GH', vin: 'VF3UBH...', owner: 'Marie Curie', status: 'In-Repair' },
    { id: 'veh-3', make: 'Citroen', model: 'C3', year: 2020, plateNumber: 'IJ-789-KL', vin: 'VF7SCN...', owner: 'Pierre Martin', status: 'Archived' },
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

const newVehicleInitialState: Omit<Vehicle, 'id'> = {
    make: '',
    model: '',
    year: new Date().getFullYear(),
    plateNumber: '',
    vin: '',
    owner: '',
    status: 'Active',
};


function VehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [formData, setFormData] = useState<Omit<Vehicle, 'id'>>(newVehicleInitialState);
    
    const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: id === 'year' ? parseInt(value) || 0 : value }));
    };

    const handleFormSelectChange = (id: 'owner' | 'status', value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    
    const handleAddNewClick = () => {
        setEditingVehicle(null);
        setFormData(newVehicleInitialState);
        setIsFormOpen(true);
    };

    const handleEditClick = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle);
        setFormData(vehicle);
        setIsFormOpen(true);
    };

    const handleSaveVehicle = (event: React.FormEvent) => {
        event.preventDefault();
        if (editingVehicle) {
            setVehicles(vehicles.map(v => v.id === editingVehicle.id ? { ...formData, id: v.id } : v));
        } else {
            const newVehicle: Vehicle = {
                id: `veh-${Date.now()}`,
                ...formData
            };
            setVehicles(prev => [...prev, newVehicle]);
        }
        setIsFormOpen(false);
        setEditingVehicle(null);
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
            <Button onClick={handleAddNewClick}><Plus className='mr-2 h-4 w-4' />Ajouter un véhicule</Button>
          </div>
           
           <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingVehicle ? 'Modifier le véhicule' : 'Ajouter un nouveau véhicule'}</DialogTitle>
                  <DialogDescription>
                    {editingVehicle ? 'Mettez à jour les informations du véhicule.' : 'Remplissez les informations ci-dessous pour ajouter un nouveau véhicule.'}
                  </DialogDescription>
                </DialogHeader>
                 <form onSubmit={handleSaveVehicle}>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="make">Marque</Label>
                            <Input id="make" placeholder="Renault" value={formData.make} onChange={handleFormInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="model">Modèle</Label>
                            <Input id="model" placeholder="Clio" value={formData.model} onChange={handleFormInputChange} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="year">Année</Label>
                            <Input id="year" type="number" placeholder="2023" value={formData.year} onChange={handleFormInputChange} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="plateNumber">Immatriculation</Label>
                            <Input id="plateNumber" placeholder="AB-123-CD" value={formData.plateNumber} onChange={handleFormInputChange} />
                        </div>
                         <div className="col-span-2 space-y-2">
                            <Label htmlFor="vin">VIN</Label>
                            <Input id="vin" placeholder="VF123ABC..." value={formData.vin} onChange={handleFormInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="owner">Propriétaire</Label>
                            <Select value={formData.owner} onValueChange={(value) => handleFormSelectChange('owner', value)}>
                                <SelectTrigger id="owner">
                                <SelectValue placeholder="Sélectionnez un propriétaire" />
                                </SelectTrigger>
                                <SelectContent>
                                {mockClients.map(client => (
                                    <SelectItem key={client.id} value={client.name}>{client.name}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="status">Statut</Label>
                            <Select value={formData.status} onValueChange={(value) => handleFormSelectChange('status', value as Vehicle['status'])}>
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
                                        <DropdownMenuItem onClick={() => handleEditClick(vehicle)}>Modifier</DropdownMenuItem>
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
