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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

interface Client {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: 'Actif' | 'Inactif';
}

const initialClients: Client[] = [
    { id: 'client-1', firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@email.com', phone: '0612345678', status: 'Actif' },
    { id: 'client-2', firstName: 'Marie', lastName: 'Curie', email: 'marie.curie@email.com', phone: '0687654321', status: 'Actif' },
    { id: 'client-3', firstName: 'Pierre', lastName: 'Martin', email: 'pierre.martin@email.com', phone: '0611223344', status: 'Inactif' },
];

const statusOptions: Client['status'][] = ['Actif', 'Inactif'];

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Actif': return 'secondary';
    case 'Inactif': return 'outline';
    default: return 'secondary';
  }
};

const newClientInitialState: Omit<Client, 'id'> = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: 'Actif',
};

function ClientsPage() {
    const [clients, setClients] = useState<Client[]>(initialClients);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [formData, setFormData] = useState<Omit<Client, 'id'>>(newClientInitialState);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

    useEffect(() => {
        if (!isFormOpen) {
            setEditingClient(null);
            setFormData(newClientInitialState);
        }
    }, [isFormOpen]);
    
    const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleFormSelectChange = (id: 'status', value: string) => {
        setFormData(prev => ({ ...prev, [id]: value as Client['status'] }));
    };
    
    const handleAddNewClick = () => {
        setEditingClient(null);
        setFormData(newClientInitialState);
        setIsFormOpen(true);
    };

    const handleEditClick = (client: Client) => {
        setEditingClient(client);
        setFormData(client);
        setIsFormOpen(true);
    };

    const handleSaveClient = (event: React.FormEvent) => {
        event.preventDefault();
        if (editingClient) {
            setClients(clients.map(c => c.id === editingClient.id ? { ...formData, id: c.id } : c));
        } else {
            const newClient: Client = {
                id: `client-${Date.now()}`,
                ...formData
            };
            setClients(prev => [...prev, newClient]);
        }
        setIsFormOpen(false);
    };

    const handleDeleteClick = (client: Client) => {
        setClientToDelete(client);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (clientToDelete) {
            setClients(clients.filter(c => c.id !== clientToDelete.id));
        }
        setIsDeleteDialogOpen(false);
        setClientToDelete(null);
    };

  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <h1 className="text-3xl font-headline font-bold tracking-tight">Clients</h1>
                <p className="text-muted-foreground">Gérez votre base de clients.</p>
              </div>
              <Button onClick={handleAddNewClick}><Plus className='mr-2 h-4 w-4' />Ajouter un client</Button>
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>{editingClient ? 'Modifier le client' : 'Ajouter un nouveau client'}</DialogTitle>
                  <DialogDescription>
                    {editingClient ? 'Mettez à jour les informations du client.' : 'Remplissez les informations ci-dessous.'}
                  </DialogDescription>
                </DialogHeader>
                 <form onSubmit={handleSaveClient}>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Prénom</Label>
                            <Input id="firstName" placeholder="Jean" value={formData.firstName} onChange={handleFormInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Nom</Label>
                            <Input id="lastName" placeholder="Dupont" value={formData.lastName} onChange={handleFormInputChange} />
                        </div>
                         <div className="col-span-2 space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="j.dupont@email.com" value={formData.email} onChange={handleFormInputChange} />
                        </div>
                         <div className="col-span-2 space-y-2">
                            <Label htmlFor="phone">Téléphone</Label>
                            <Input id="phone" placeholder="0612345678" value={formData.phone} onChange={handleFormInputChange} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="status">Statut</Label>
                            <Select value={formData.status} onValueChange={(value) => handleFormSelectChange('status', value)}>
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

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Cette action est irréversible. Le client sera définitivement supprimé.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmDelete}>Supprimer</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Card>
                <CardHeader>
                    <CardTitle>Liste des clients</CardTitle>
                    <CardDescription>Consultez et gérez tous les clients enregistrés.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell>
                                    <div className="font-medium">{client.firstName} {client.lastName}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm text-muted-foreground">{client.email}</div>
                                    <div className="text-sm text-muted-foreground">{client.phone}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(client.status)}>{client.status}</Badge>
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
                                        <DropdownMenuItem onClick={() => handleEditClick(client)}>Modifier</DropdownMenuItem>
                                        <DropdownMenuItem>Voir les véhicules</DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                            onClick={() => handleDeleteClick(client)}
                                        >
                                            Supprimer
                                        </DropdownMenuItem>
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

export default withAuth(ClientsPage);
