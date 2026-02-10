"use client";

import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/main-sidebar";
import { Header } from "@/components/header";
import withAuth from "@/hoc/withAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TableSection } from "@/components/ui/table";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

import {
  createVehicle,
  deleteVehicle,
  filterVehicles,
  FilterEntitiesPayloadDto,
  updateVehicle,
} from "@/services/vehicles/vehicles.service";
import { filterEntities } from "@/services/users/users.service";
import { toast } from "@/hooks/use-toast";
import { StatusEnum } from "@/enums/status.enum";

interface IEntity {
  _id?: number | string | undefined;
  make?: string | undefined;
  model?: string | undefined;
  year?: string | undefined;
  plateNumber?: string | undefined;
  vin?: string | undefined;
  owner?: User | number | string | undefined; // Allow string for display, User/number for logic
  // ownerString?: string | undefined; // Allow string for display, User/number for logic
  status?: StatusEnum | undefined;
  // _originalOwner?: User | undefined; // Helper for frontend logic
}

interface User {
  _id?: number | string | undefined;
  givenName?: string;
  familyName?: string;
}

export class Entity implements IEntity {
  _id?: number | string | undefined = undefined;
  make?: string | undefined = undefined;
  model?: string | undefined = undefined;
  year?: string | undefined = undefined;
  plateNumber?: string | undefined = undefined;
  vin?: string | undefined = undefined;
  owner?: User | number | string | undefined = undefined;
  ownerString?: string | undefined = undefined;
  status?: StatusEnum | undefined = StatusEnum.ACTIVE;
  createdAt?: string | undefined = undefined;
  archivedAt?: string | undefined = undefined;
}

// Mock data removed
const statusOptions: string[] = ["active", "in-repair", "archived", "sold"];

const newItemInitialState: IEntity = Object.fromEntries(
  Object.entries(new Entity()).map(([key, value]) => [key, value]),
) as unknown as IEntity;

function ElementsPage() {
  const [elements, setElements] = useState<IEntity[]>([] as IEntity[]);
  const [clients, setClients] = useState<User[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IEntity | null>(null);
  const [formData, setFormData] = useState<IEntity>(newItemInitialState);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<IEntity | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVehicles = async () => {
    try {
      const filterEntitiesPayloadDto: FilterEntitiesPayloadDto = {
        attributes: {},
        pagination: {
          perPage: itemsPerPage.toString(),
          page: currentPage.toString(),
          sortField: "_id",
          sortOrder: "asc",
        },
        wildcard: "true",
      };
      const response = await filterVehicles(filterEntitiesPayloadDto);
      const data = await response.json();

      if (!clients.length) {
        // fetchClients(); // Don't block if clients fail, but good to try
      }

      if (!data?.vehicles) {
        setElements([]);
        return;
      }

      const mappedEntitiesUsers = data.vehicles.map((vehicle: IEntity) => ({
        ...vehicle,
      }));

      setElements(mappedEntitiesUsers);

      if (data?.pagination?.totalPages) {
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch vehicles", error);
      toast({ title: "Failed to fetch vehicles", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [currentPage, itemsPerPage]); // Add dependencies

  const fetchClients = async () => {
    try {
      const payload: FilterEntitiesPayloadDto = {
        attributes: {},
        pagination: { perPage: "100", page: "1" },
      };
      const response = await filterEntities(payload);
      if (response.ok) {
        const data = await response.json();
        setClients(data.users || []);
      }
    } catch (error) {
      console.error("Failed to fetch clients", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (!isFormOpen) {
      setEditingItem(null);
      setFormData(newItemInitialState);
    }
  }, [isFormOpen]);

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFormSelectChange = (
    id: "owner" | "status",
    value: string | number | StatusEnum | User | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddNewClick = () => {
    setEditingItem(null);
    setFormData(newItemInitialState);
    setIsFormOpen(true);
  };

  const handleEditClick = (vehicle: IEntity) => {
    const originalVehicle = {
      ...vehicle,
    };
    setEditingItem(originalVehicle);
    setFormData(originalVehicle);
    setIsFormOpen(true);
  };

  const handleSaveVehicle = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const payload: Record<string, any> = { ...formData };

      if (editingItem && editingItem._id) {
        const response = await updateVehicle({
          ...payload,
          ownerString: undefined,
        } as unknown as Record<
          string,
          string | number | boolean | undefined | null
        >);

        const { message } = await response.json();

        if (response.ok) {
          toast({ title: message || "updated successfully" });
          fetchVehicles();
        } else {
          toast({ title: "Failed to update vehicle", variant: "destructive" });
        }
      } else {
        const response = await createVehicle(
          payload as unknown as Record<
            string,
            string | number | boolean | undefined | null
          >,
        );

        const { message } = await response.json();

        if (response.ok) {
          toast({ title: message || "created successfully" });
          fetchVehicles();
        } else {
          toast({
            title: message || "Failed to create item",
            variant: "destructive",
          });
        }
      }

      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving", error);
      toast({ title: "Error saving", variant: "destructive" });
    }
  };

  const handleDeleteClick = (vehicle: IEntity) => {
    setVehicleToDelete(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (vehicleToDelete && vehicleToDelete._id) {
      try {
        const response = await deleteVehicle(vehicleToDelete._id);
        const { message } = await response.json();
        if (response.ok) {
          toast({ title: message || "Deleted successfully" });
          fetchVehicles();
        } else {
          toast({
            title: message || "Failed to delete item",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error deleting item", error);
        toast({
          title: "Error deleting item",
          variant: "destructive",
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setVehicleToDelete(null);
  };

  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h1 className="text-3xl font-headline font-bold tracking-tight">
                Véhicules
              </h1>
              <p className="text-muted-foreground">
                Gérez la flotte de véhicules de vos clients.
              </p>
            </div>
            <Button onClick={handleAddNewClick}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un véhicule
            </Button>
          </div>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingItem
                    ? "Modifier le véhicule"
                    : "Ajouter un nouveau véhicule"}
                </DialogTitle>
                <DialogDescription>
                  {editingItem
                    ? "Mettez à jour les informations du véhicule."
                    : "Remplissez les informations ci-dessous pour ajouter un nouveau véhicule."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveVehicle}>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="make">Marque</Label>
                    <Input
                      id="make"
                      placeholder="Renault"
                      value={formData.make}
                      onChange={handleFormInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Modèle</Label>
                    <Input
                      id="model"
                      placeholder="Clio"
                      value={formData.model}
                      onChange={handleFormInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Année</Label>
                    <Input
                      id="year"
                      type="text"
                      placeholder="2023"
                      value={formData.year}
                      onChange={handleFormInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plateNumber">Immatriculation</Label>
                    <Input
                      id="plateNumber"
                      placeholder="AB-123-CD"
                      value={formData.plateNumber}
                      onChange={handleFormInputChange}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="vin">VIN</Label>
                    <Input
                      id="vin"
                      placeholder="VF123ABC..."
                      value={formData.vin}
                      onChange={handleFormInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner">Propriétaire</Label>
                    <Select
                      value={(() => {
                        const { _id: ownedIdStr = "" } =
                          (formData.owner as User | undefined) || {};
                        return String(ownedIdStr);
                      })()}
                      onValueChange={(value) => {
                        const owner = clients.find(
                          (client) => Number(client._id) === Number(value),
                        );
                        return handleFormSelectChange("owner", owner);
                      }}
                    >
                      <SelectTrigger id="owner">
                        <SelectValue placeholder="Sélectionnez un propriétaire" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client._id} value={`${client._id}`}>
                            {client.givenName} {client.familyName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleFormSelectChange(
                          "status",
                          value as IEntity["status"] as StatusEnum,
                        )
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Sélectionnez un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">Sauvegarder</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Êtes-vous sûr de vouloir supprimer?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Le véhicule sera définitivement
                  supprimé.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                  Annuler
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelete}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Card>
            <CardHeader>
              <CardTitle>Liste des véhicules</CardTitle>
              <CardDescription>
                Consultez et gérez tous les véhicules enregistrés.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="w-full">
                  <input
                    id="formInputText7Search1"
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="w-full p-2">
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => setItemsPerPage(Number(value))}
                  >
                    <SelectTrigger id="itemsPerPageSelectInputId">
                      <SelectValue placeholder="Items per page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TableSection
                elements={(elements || []).map((vehicle: IEntity) => {
                  const { owner = undefined } = vehicle;
                  const ownerString = owner
                    ? typeof owner === "object" && owner.givenName
                      ? `${owner.givenName} ${owner.familyName}`
                      : String(owner)
                    : undefined;

                  return {
                    ...vehicle,
                    ownerString,
                  };
                })}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
                newItemInitialState={newItemInitialState}
                columns={Object.keys(newItemInitialState).filter(
                  (key) => !["owner"].includes(key),
                )}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalPages={totalPages}
                searchTerm={searchTerm}
              />

              {/* Debug: item details */}
              {/* {elements.map((entityItem) => (
                <div key={entityItem._id}>
                  {Object.keys(entityItem).map((key) => (
                    <div key={key}>
                      {key}: {entityItem[key as keyof IEntity]}
                    </div>
                  ))}
                </div>
              ))} */}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default withAuth(ElementsPage);
