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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  createWorkOrder,
  deleteWorkOrder,
  filterWorkOrders,
  FilterEntitiesPayloadDto,
  updateWorkOrder,
} from "@/services/work-order/work-order.service";
import { filterVehicles } from "@/services/vehicles/vehicles.service";
import { filterEntities as filterUsers } from "@/services/users/users.service";
import { filterStocks } from "@/services/stock/stock.service";
import { toast } from "@/hooks/use-toast";

interface User {
  _id?: number | string;
  givenName?: string;
  familyName?: string;
}

interface Stock {
  _id?: number | string;
  name?: string;
  quantity?: number;
}

interface Vehicle {
  _id?: number | string;
  make?: string;
  model?: string;
  plateNumber?: string;
}

interface IWorkOrder {
  _id?: number | string | undefined;
  startTime?: string | undefined;
  endTime?: string | undefined;
  estimatedDuration?: string | undefined;
  notes?: string | undefined;
  vehicle?: Vehicle | undefined;
  vehicleString?: string | undefined;
  labors?: User[] | undefined;
  laborsString?: string | undefined;
  materials?: Stock[] | undefined;
  materialsString?: string | undefined;
  createdAt?: string | undefined;
}

export class WorkOrderEntity implements IWorkOrder {
  _id?: number | string | undefined = undefined;
  startTime?: string | undefined = undefined;
  endTime?: string | undefined = undefined;
  estimatedDuration?: string | undefined = undefined;
  notes?: string | undefined = undefined;
  vehicle?: Vehicle | undefined = undefined;
  vehicleString?: string | undefined = undefined;
  labors?: User[] | undefined = [];
  laborsString?: string | undefined = undefined;
  materials?: Stock[] | undefined = [];
  materialsString?: string | undefined = undefined;
}

const formatEntityRecursive = (entity: any, depth: number = 0): string => {
  if (entity === null || entity === undefined) return "";
  if (typeof entity !== "object") return String(entity);
  if (entity instanceof Date) return entity.toLocaleString();

  const indent = " ".repeat(depth * 2);

  if (Array.isArray(entity)) {
    if (entity.length === 0) return "[]";
    return (
      entity
        .map((item, index) => {
          const val = formatEntityRecursive(item, depth + 1);
          return `${indent}- [${index}]: item._id:${item?._id || "N/A"} \n${val}`;
        })
        // .filter((item) => !item)
        .join("\n --- \n")
    );
  }

  const entries = Object.entries(entity).filter(
    ([key]) =>
      ![
        "_id",
        "password",
        "passwordSalt",
        "createdAt",
        "updatedAt",
        "__v",
        "id",
      ].includes(key),
  );

  if (entries.length === 0) return String(entity);

  return entries
    .map(([key, value]) => {
      if (!value) {
        return "";
      }

      let valueStr = "";

      if (
        typeof value === "object" &&
        value !== null &&
        !(value instanceof Date)
      ) {
        valueStr = `^__ ${formatEntityRecursive(value, depth + 1)}`;
      } else {
        valueStr = String(
          value instanceof Date ? value.toLocaleString() : value,
        );
      }
      return `-- key: ${key} | value: ${valueStr} \n`;
    })
    .join("");
};

const newItemInitialState: IWorkOrder = new WorkOrderEntity();

function WorkOrdersPage() {
  const [elements, setElements] = useState<IWorkOrder[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IWorkOrder | null>(null);
  const [formData, setFormData] = useState<IWorkOrder>(newItemInitialState);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IWorkOrder | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch Work Orders
  const fetchWorkOrders = async () => {
    try {
      const filterPayload: FilterEntitiesPayloadDto = {
        attributes: {},
        pagination: {
          perPage: itemsPerPage.toString(),
          page: currentPage.toString(),
          sortField: "createdAt",
          sortOrder: "desc",
        },
        wildcard: "true",
      };

      const response = await filterWorkOrders(filterPayload);
      const data = await response.json();

      if (data?.workOrders) {
        setElements(data.workOrders);
      } else {
        setElements([]);
      }

      if (data?.pagination?.totalPages) {
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch work orders", error);
      toast({ title: "Failed to fetch work orders", variant: "destructive" });
    }
  };

  // Fetch Dependencies
  const fetchDependencies = async () => {
    try {
      // Fetch Vehicles
      const vehiclesRes = await filterVehicles({
        attributes: {},
        pagination: { perPage: "100", page: "1" },
      });
      const vehiclesData = await vehiclesRes.json();
      if (vehiclesData?.vehicles) setVehicles(vehiclesData.vehicles);

      // Fetch Users (Labors)
      const usersRes = await filterUsers({
        attributes: {},
        pagination: { perPage: "100", page: "1" },
      });
      // users service returns raw response or data? checking stock page it says response.json()
      // checking users service usage in stock/vehicles page:
      // const response = await filterEntities(payload); if(response.ok) const data = await response.json(); setClients(data.users);
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        if (usersData?.users) setUsers(usersData.users);
      }

      // Fetch Stocks (Materials)
      const stocksRes = await filterStocks({
        attributes: {},
        pagination: { perPage: "100", page: "1" },
      });
      const stocksData = await stocksRes.json();
      if (stocksData?.stockItems) setStocks(stocksData.stockItems);
    } catch (error) {
      console.error("Failed to fetch dependencies", error);
    }
  };

  useEffect(() => {
    fetchWorkOrders();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchDependencies();
  }, []);

  useEffect(() => {
    if (!isFormOpen) {
      setEditingItem(null);
      setFormData(new WorkOrderEntity());
    }
  }, [isFormOpen]);

  const handleFormInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleVehicleChange = (value: string) => {
    const selectedVehicle = vehicles.find((v) => v._id?.toString() === value);
    setFormData((prev) => ({
      ...prev,
      vehicle: selectedVehicle,
    }));
  };

  const handleLaborToggle = (user: User) => {
    setFormData((prev) => {
      const labors = prev.labors || [];
      const exists = labors.find((l) => l._id === user._id);
      if (exists) {
        return { ...prev, labors: labors.filter((l) => l._id !== user._id) };
      } else {
        return { ...prev, labors: [...labors, user] };
      }
    });
  };

  const handleMaterialToggle = (stock: Stock) => {
    setFormData((prev) => {
      const materials = prev.materials || [];
      const exists = materials.find((m) => m._id === stock._id);
      if (exists) {
        return {
          ...prev,
          materials: materials.filter((m) => m._id !== stock._id),
        };
      } else {
        return { ...prev, materials: [...materials, stock] };
      }
    });
  };

  const handleAddNewClick = () => {
    setEditingItem(null);
    setFormData(new WorkOrderEntity());
    setIsFormOpen(true);
  };

  const handleEditClick = (item: IWorkOrder) => {
    setEditingItem(item);
    // Ensure arrays are initialized
    setFormData({
      ...item,
      labors: item.labors || [],
      materials: item.materials || [],
      // Handle date formatting for input type="datetime-local"
      // Expected format: YYYY-MM-DDThh:mm
      startTime: item.startTime
        ? new Date(item.startTime).toISOString().slice(0, 16)
        : undefined,
      endTime: item.endTime
        ? new Date(item.endTime).toISOString().slice(0, 16)
        : undefined,
    });
    setIsFormOpen(true);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const payload = { ...formData };

      // Ensure relations are passed as array of objects with _id (which they are)
      // Ensure vehicle is passed as object with _id (which it is)

      if (editingItem && editingItem._id) {
        await updateWorkOrder(payload);
        toast({ title: "Work order updated successfully" });
      } else {
        await createWorkOrder(payload);
        toast({ title: "Work order created successfully" });
      }

      setIsFormOpen(false);
      fetchWorkOrders();
    } catch (error) {
      console.error("Failed to save work order", error);
      toast({ title: "Failed to save work order", variant: "destructive" });
    }
  };

  const handleDeleteClick = (item: IWorkOrder) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete?._id) return;
    try {
      await deleteWorkOrder(itemToDelete._id);
      toast({ title: "Work order deleted successfully" });
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
      fetchWorkOrders();
    } catch (error) {
      console.error("Failed to delete work order", error);
      toast({ title: "Failed to delete work order", variant: "destructive" });
    }
  };

  // const columns = [
  //   { key: "notes", label: "Notes" },
  //   { key: "estimatedDuration", label: "Durée Est." },
  //   {
  //     key: "vehicle",
  //     label: "Véhicule",
  //     render: (row: IWorkOrder) =>
  //       row.vehicle
  //         ? `${row.vehicle.make} ${row.vehicle.model} (${row.vehicle.plateNumber})`
  //         : "-",
  //   },
  //   {
  //     key: "startTime",
  //     label: "Début",
  //     render: (row: IWorkOrder) =>
  //       row.startTime ? new Date(row.startTime).toLocaleDateString() : "-",
  //   },
  //   {
  //     key: "labors",
  //     label: "Main d'œuvre",
  //     render: (row: IWorkOrder) =>
  //       row.labors?.length ? row.labors.length : "0",
  //   },
  //   {
  //     key: "materials",
  //     label: "Pièces",
  //     render: (row: IWorkOrder) =>
  //       row.materials?.length ? row.materials.length : "0",
  //   },
  // ];

  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h1 className="text-3xl font-headline font-bold tracking-tight">
                Ordres de Réparation
              </h1>
              <p className="text-muted-foreground">
                Gérez tous les ordres de réparation.
              </p>
            </div>
            <Button onClick={handleAddNewClick}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une réparation
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Liste des réparations</CardTitle>
              <CardDescription>
                Consultez et gérez vos ordres de réparation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TableSection
                elements={elements.map((item) => {
                  const { vehicle, labors, materials } = item;
                  return {
                    ...item,
                    vehicleString: vehicle
                      ? formatEntityRecursive(vehicle)
                      : "-",
                    laborsString:
                      labors && labors.length > 0
                        ? formatEntityRecursive(labors)
                        : "-",
                    materialsString:
                      materials && materials.length > 0
                        ? formatEntityRecursive(materials)
                        : "-",
                  };
                })}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
                newItemInitialState={newItemInitialState}
                columns={Object.keys(newItemInitialState).filter(
                  (key) => !["vehicle", "labors", "materials"].includes(key),
                )}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalPages={totalPages}
                searchTerm={searchTerm}
              />
            </CardContent>
          </Card>

          {/* Create/Edit Dialog */}
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem
                    ? "Modifier la réparation"
                    : "Nouvelle réparation"}
                </DialogTitle>
                <DialogDescription>
                  Remplissez les détails ci-dessous.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Véhicule</Label>
                    <Select
                      value={formData.vehicle?._id?.toString()}
                      onValueChange={handleVehicleChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un véhicule" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((v) => (
                          <SelectItem
                            key={v._id}
                            value={v._id?.toString() || ""}
                          >
                            {v.make} {v.model} ({v.plateNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedDuration">Durée Estimée</Label>
                    <Input
                      id="estimatedDuration"
                      value={formData.estimatedDuration || ""}
                      onChange={handleFormInputChange}
                      placeholder="ex: 2h 30m"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Date de début</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={formData.startTime || ""}
                      onChange={handleFormInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Date de fin</Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      value={formData.endTime || ""}
                      onChange={handleFormInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes || ""}
                    onChange={handleFormInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Main d'œuvre (Labors)</Label>
                    <Card className="h-40">
                      <ScrollArea className="h-full p-4">
                        <div className="space-y-2">
                          {users.map((user) => (
                            <div
                              key={user._id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`labor-${user._id}`}
                                checked={formData.labors?.some(
                                  (l) => l._id === user._id,
                                )}
                                onCheckedChange={() => handleLaborToggle(user)}
                              />
                              <label
                                htmlFor={`labor-${user._id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {user.givenName} {user.familyName}
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <Label>Pièces (Matériels)</Label>
                    <Card className="h-40">
                      <ScrollArea className="h-full p-4">
                        <div className="space-y-2">
                          {stocks.map((stock) => (
                            <div
                              key={stock._id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`material-${stock._id}`}
                                checked={formData.materials?.some(
                                  (m) => m._id === stock._id,
                                )}
                                onCheckedChange={() =>
                                  handleMaterialToggle(stock)
                                }
                              />
                              <label
                                htmlFor={`material-${stock._id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {stock.name} ({stock.quantity})
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </Card>
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
                  <Button type="submit">Enregistrer</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Alert Dialog */}
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne peut pas être annulée. Cela supprimera
                  définitivement cet ordre de réparation.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelete}>
                  Continuer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default withAuth(WorkOrdersPage);
