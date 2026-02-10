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

import {
  createStock,
  deleteStock,
  filterStocks,
  FilterEntitiesPayloadDto,
  updateStock,
} from "@/services/stock/stock.service";
import { toast } from "@/hooks/use-toast";

interface IEntity {
  _id?: number | string | undefined;
  name?: string | undefined;
  sku?: string | undefined;
  quantity?: number | undefined;
  buyPrice?: number | undefined;
  sellPrice?: number | undefined;
  availableInInventory?: boolean | undefined;
  notes?: string | undefined;
}

export class Entity implements IEntity {
  _id?: number | string | undefined = undefined;
  name?: string | undefined = undefined;
  sku?: string | undefined = undefined;
  quantity?: number | undefined = 0;
  buyPrice?: number | undefined = 0;
  sellPrice?: number | undefined = 0;
  availableInInventory?: boolean | undefined = true;
  notes?: string | undefined = undefined;
}

const newItemInitialState: IEntity = Object.fromEntries(
  Object.entries(new Entity()).map(([key, value]) => [key, value]),
) as unknown as IEntity;

function StockPage() {
  const [elements, setElements] = useState<IEntity[]>([] as IEntity[]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IEntity | null>(null);
  const [formData, setFormData] = useState<IEntity>(newItemInitialState);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [stockToDelete, setStockToDelete] = useState<IEntity | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStocks = async () => {
    try {
      const filterEntitiesPayloadDto: FilterEntitiesPayloadDto = {
        attributes: {}, // No search term here if we want local filtering or if we want to fetch all and filter client side.
        pagination: {
          perPage: itemsPerPage.toString(),
          page: currentPage.toString(),
          sortField: "name", // Default sort by name
          sortOrder: "desc",
        },
        wildcard: "true",
      };

      const response = await filterStocks(filterEntitiesPayloadDto);
      const data = await response.json();

      if (!data?.stockItems) {
        setElements([]);
        return;
      }

      setElements(data.stockItems);

      if (data?.pagination?.totalPages) {
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch stock items", error);
      toast({ title: "Failed to fetch stock items", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchStocks();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    if (!isFormOpen) {
      setEditingItem(null);
      setFormData(newItemInitialState);
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

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      availableInInventory: checked,
    }));
  };

  const handleAddNewClick = () => {
    setEditingItem(null);
    setFormData(newItemInitialState);
    setIsFormOpen(true);
  };

  const handleEditClick = (stockItem: IEntity) => {
    setEditingItem(stockItem);
    setFormData({ ...stockItem });
    setIsFormOpen(true);
  };

  const handleSaveStock = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const payload: Record<string, any> = { ...formData };

      // Ensure numbers are numbers
      if (payload.quantity) payload.quantity = Number(payload.quantity);
      if (payload.buyPrice) payload.buyPrice = Number(payload.buyPrice);
      if (payload.sellPrice) payload.sellPrice = Number(payload.sellPrice);

      if (editingItem && editingItem._id) {
        const response = await updateStock(
          payload as unknown as Record<
            string,
            string | number | boolean | undefined | null
          >,
        );

        const { message } = await response.json();

        if (response.ok) {
          toast({ title: message || "Updated successfully" });
          fetchStocks();
        } else {
          toast({
            title: "Failed to update stock item",
            variant: "destructive",
          });
        }
      } else {
        const response = await createStock(
          payload as unknown as Record<
            string,
            string | number | boolean | undefined | null
          >,
        );

        const { message } = await response.json();

        if (response.ok) {
          toast({ title: message || "Created successfully" });
          fetchStocks();
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

  const handleDeleteClick = (stockItem: IEntity) => {
    setStockToDelete(stockItem);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (stockToDelete && stockToDelete._id) {
      try {
        const response = await deleteStock(stockToDelete._id);
        const { message } = await response.json();
        if (response.ok) {
          toast({ title: message || "Deleted successfully" });
          fetchStocks();
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
    setStockToDelete(null);
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
                Stock
              </h1>
              <p className="text-muted-foreground">
                Gérez votre inventaire et stock.
              </p>
            </div>
            <Button onClick={handleAddNewClick}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un article
            </Button>
          </div>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingItem
                    ? "Modifier l'article"
                    : "Ajouter un nouvel article"}
                </DialogTitle>
                <DialogDescription>
                  {editingItem
                    ? "Mettez à jour les informations de l'article."
                    : "Remplissez les informations ci-dessous pour ajouter un nouvel article."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveStock}>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      placeholder="Filtre à huile"
                      value={formData.name}
                      onChange={handleFormInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      placeholder="SKU-123"
                      value={formData.sku}
                      onChange={handleFormInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantité</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="0"
                      value={formData.quantity}
                      onChange={handleFormInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyPrice">Prix d'achat</Label>
                    <Input
                      id="buyPrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.buyPrice}
                      onChange={handleFormInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellPrice">Prix de vente</Label>
                    <Input
                      id="sellPrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.sellPrice}
                      onChange={handleFormInputChange}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox
                      id="availableInInventory"
                      checked={formData.availableInInventory}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="availableInInventory">
                      Disponible en inventaire
                    </Label>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Notes supplémentaires..."
                      value={formData.notes || ""}
                      onChange={handleFormInputChange}
                    />
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
                  Cette action est irréversible. L'article sera définitivement
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
              <CardTitle>Liste du stock</CardTitle>
              <CardDescription>
                Consultez et gérez tous les articles en stock.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="w-full">
                  <input
                    id="stockSearchInput"
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
                    <SelectTrigger id="itemsPerPageSelect">
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
                elements={elements}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
                newItemInitialState={newItemInitialState}
                columns={Object.keys(newItemInitialState).filter(
                  (key) => key !== "_id", // Filter out internal fields if needed
                )}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalPages={totalPages}
                searchTerm={searchTerm}
              />
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default withAuth(StockPage);
