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
import { useTranslations } from "next-intl";

import "nextjs-reusable-table/dist/index.css";
import {
  filterEntities,
  FilterEntitiesPayloadDto,
} from "@/services/users/users.service";
import { signup, updateItem } from "@/services/auth/auth.service";
import { toast } from "@/hooks/use-toast";
import { StatusEnum } from "@/enums/status.enum";
import { TableSection } from "@/components/ui/table";

interface IEntity {
  _id?: number;
  givenName?: string;
  familyName?: string;
  email?: string;
  phone?: string;
  status?: StatusEnum | undefined;
  password?: string;
  createdAt?: string;
  archivedAt?: string;
}

export class Entity implements IEntity {
  _id: number = 0;
  givenName?: string | undefined = undefined;
  familyName?: string | undefined = undefined;
  email?: string = undefined;
  phone?: string = undefined;
  status?: StatusEnum | undefined = undefined;
  password?: string | undefined = undefined;
  createdAt?: string | undefined = undefined;
  archivedAt?: string | undefined = undefined;
}

const newItemInitialState: IEntity = Object.fromEntries(
  Object.entries(new Entity()).map(([key, value]) => [key, value]),
) as unknown as IEntity;

const entityForms = {
  createNewItem: {
    givenName: {
      label: {
        component: {
          Render: ({
            props,
            translation,
          }: {
            props?: React.ComponentProps<typeof Label>;
            translation?: (key: string) => string;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("itemAttrInputText1Label")
                  : "itemAttrInputText1Label"}
              </Label>
            );
          },
        },
      },
      input: {
        type: "text",
        component: {
          dataEntityAttrName: "givenName",
          Render: (props?: React.ComponentProps<typeof Input>) => {
            return (
              <Input
                id="givenName"
                type="text"
                placeholder="Jean"
                value={props?.value === null ? "" : props?.value}
                onChange={props?.onChange || (() => {})}
                data-entity-attr-name="givenName"
                {...props}
              />
            );
          },
        },
      },
    },
    // formInputText1: {
    //   label: {
    //     component: {
    //       Render: ({
    //         props,
    //         translation,
    //       }: {
    //         props?: React.ComponentProps<typeof Label>;
    //         translation?: (key: string) => string;
    //       }) => {
    //         return (
    //           <Label {...props}>
    //             {translation
    //               ? translation("itemAttrInputText1Label")
    //               : "itemAttrInputText1Label"}
    //           </Label>
    //         );
    //       },
    //     },
    //   },
    //   input: {
    //     type: "text",
    //     component: {
    //       dataEntityAttrName: "givenName",
    //       Render: (props?: React.ComponentProps<typeof Input>) => {
    //         return (
    //           <Input
    //             id="formInputText1"
    //             type="text"
    //             placeholder="Jean"
    //             value={props?.value === null ? "" : props?.value}
    //             onChange={props?.onChange || (() => {})}
    //             data-entity-attr-name="givenName"
    //             {...props}
    //           />
    //         );
    //       },
    //     },
    //   },
    // },
    familyName: {
      label: {
        component: {
          Render: ({
            props,
            translation,
          }: {
            props?: React.ComponentProps<typeof Label>;
            translation?: (key: string) => string;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("itemAttrInputText2Label")
                  : "itemAttrInputText2Label"}
              </Label>
            );
          },
        },
      },
      input: {
        type: "text",
        component: {
          dataEntityAttrName: "familyName",
          Render: (props?: React.ComponentProps<typeof Input>) => {
            return (
              <Input
                id="familyName"
                type="text"
                placeholder="Dupont"
                value={props?.value === null ? "" : props?.value}
                onChange={props?.onChange || (() => {})}
                data-entity-attr-name="familyName"
                {...props}
              />
            );
          },
        },
      },
    },
    email: {
      label: {
        component: {
          Render: ({
            props,
            translation,
          }: {
            props?: React.ComponentProps<typeof Label>;
            translation?: (key: string) => string;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("itemAttrEmailLabel")
                  : "itemAttrInputText3Label"}
              </Label>
            );
          },
        },
      },
      input: {
        type: "text",
        component: {
          dataEntityAttrName: "email",
          Render: (props?: React.ComponentProps<typeof Input>) => {
            return (
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="j.dupont@example.com"
                value={props?.value === null ? "" : props?.value}
                onChange={props?.onChange || (() => {})}
                data-entity-attr-name="email"
                {...props}
              />
            );
          },
        },
      },
    },
    password: {
      label: {
        component: {
          Render: ({
            props,
            translation,
          }: {
            props?: React.ComponentProps<typeof Label>;
            translation?: (key: string) => string;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("itemAttrPasswordLabel")
                  : "itemAttrInputText4Label"}
              </Label>
            );
          },
        },
      },
      input: {
        type: "text",
        component: {
          dataEntityAttrName: "password",
          Render: (props?: React.ComponentProps<typeof Input>) => {
            return (
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={props?.value === null ? "" : props?.value}
                onChange={props?.onChange || (() => {})}
                data-entity-attr-name="password"
                {...props}
              />
            );
          },
        },
      },
    },
    phone: {
      label: {
        component: {
          Render: ({
            props,
            translation,
          }: {
            props?: React.ComponentProps<typeof Label>;
            translation?: (key: string) => string;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("itemAttrPhoneLabel")
                  : "itemAttrInputText5Label"}
              </Label>
            );
          },
        },
      },
      input: {
        type: "text",
        component: {
          dataEntityAttrName: "phone",
          Render: (props?: React.ComponentProps<typeof Input>) => {
            return (
              <Input
                id="phone"
                type="text"
                autoComplete="tel"
                placeholder="0612345678"
                value={props?.value === null ? "" : props?.value}
                onChange={props?.onChange || (() => {})}
                data-entity-attr-name="phone"
                {...props}
              />
            );
          },
        },
      },
    },
    status: {
      label: {
        component: {
          Render: ({
            props,
            translation,
          }: {
            props?: React.ComponentProps<typeof Label>;
            translation?: (key: string) => string;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("itemStatusLabel")
                  : "itemAttrInputText6Label"}
              </Label>
            );
          },
        },
      },
      input: {
        type: "text",
        component: {
          dataEntityAttrName: "status",
          Render: (props?: React.ComponentProps<typeof Input>) => {
            return (
              <Input
                id="status"
                type="text"
                autoComplete="status"
                placeholder={Object.values(StatusEnum).join(", ")}
                value={props?.value === null ? "" : props?.value}
                onChange={props?.onChange || (() => {})}
                data-entity-attr-name="status"
                {...props}
              />
            );
          },
        },
      },
    },
  },
};

function ElementsPage() {
  const translation = useTranslations("usersPage");

  const [elements, setElements] = useState<IEntity[]>([] as IEntity[]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IEntity | null>(null);
  const [formData, setFormData] = useState<IEntity>(newItemInitialState);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IEntity | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const fetchElements = async () => {
    const filterEntitiesPayloadDto: FilterEntitiesPayloadDto = {
      attributes: {},
      pagination: {
        perPage: itemsPerPage.toString(),
        // offset: "0",
        page: currentPage.toString(),
        sortField: "_id",
        sortOrder: "desc",
      },
      wildcard: "true",
    };
    const response = await filterEntities(filterEntitiesPayloadDto);
    const data = await response.json();
    console.log("response data", data);

    if (data?.users) {
      setElements(data.users);
    }
    if (data?.pagination?.totalPages) {
      setTotalPages(data.pagination.totalPages);
    }
  };

  useEffect(() => {
    fetchElements();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    if (!isFormOpen) {
      setEditingItem(null);
      setFormData(newItemInitialState);
    }
  }, [isFormOpen]);

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const { entityAttrName } = e.target.dataset;
    setFormData((prev) => ({
      ...prev,
      ...(entityAttrName ? { [entityAttrName]: value } : {}),
    }));
  };

  const handleAddNewClick = () => {
    setEditingItem(null);
    setFormData(newItemInitialState);
    setIsFormOpen(true);
  };

  const handleEditClick = (item: IEntity) => {
    setEditingItem(item);
    setFormData(item);
    setIsFormOpen(true);
  };

  const handleSaveEntity = async (event: React.FormEvent) => {
    event.preventDefault();

    const formattedFormData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => {
        if (key === "password" || key === "_id") {
          return [key, value];
        }
        return [key, typeof value === "string" ? value.toLowerCase() : value];
      }),
    );

    if (editingItem) {
      if (!editingItem._id) {
        return;
      }

      const updatedEntityData = await updateItem(formattedFormData);

      const { message } = updatedEntityData;
      console.log("updateItem data", updatedEntityData);

      if (!updatedEntityData?._id) {
        toast({
          title: message || "Error while updating item",
          variant: "destructive",
        });
        return;
      }

      if (message) {
        toast({
          title: message,
          variant: "default",
        });
      }

      setElements(
        elements.map((entityItem) =>
          entityItem._id === editingItem._id ? updatedEntityData : entityItem,
        ),
      );
      setIsFormOpen(false);
      return;
    }

    const createdEntityData = await signup(formattedFormData);
    const { message } = createdEntityData;
    console.log("signup data", createdEntityData);

    if (!createdEntityData?._id) {
      toast({
        title: message || "Error while creating",
        variant: "destructive",
      });
      return;
    }

    const newItem: IEntity = {
      _id: createdEntityData._id,
      ...createdEntityData,
    };

    toast({
      title: message || "created successfully",
      variant: "default",
    });

    setElements((prev) => [...prev, newItem]);

    setIsFormOpen(false);
  };

  const handleDeleteClick = (item: IEntity) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete?._id) {
      return;
    }

    const updatedEntityData = await updateItem({
      _id: itemToDelete._id,
      status: StatusEnum.ARCHIVED,
    });
    const { message } = updatedEntityData;
    console.debug("updatedEntityData", updatedEntityData);

    if (!updatedEntityData?._id) {
      toast({
        title: message || "Error while updating item",
        variant: "destructive",
      });
      return;
    }

    if (message) {
      toast({
        title: message,
        variant: "default",
      });
    }
    await fetchElements();

    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
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
                {translation("pageTitle")}
              </h1>
              <p className="text-muted-foreground">
                {translation("pageSubtitle")}
              </p>
            </div>
            <Button onClick={handleAddNewClick}>
              <Plus className="mr-2 h-4 w-4" />
              {translation("addItemButton")}
            </Button>
          </div>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>
                  {editingItem
                    ? translation("editItemDialogTitle")
                    : translation("addItemDialogTitle")}
                </DialogTitle>
                <DialogDescription>
                  {editingItem
                    ? translation("editItemDialogSubtitle")
                    : translation("addItemDialogSubtitle")}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveEntity}>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    {entityForms.createNewItem.givenName.label.component.Render(
                      {
                        translation,
                      },
                    )}

                    {entityForms.createNewItem.givenName.input.component.Render(
                      {
                        value:
                          formData[
                            entityForms.createNewItem.givenName.input.component
                              .dataEntityAttrName as keyof IEntity
                          ],
                        onChange: handleFormInputChange,
                      },
                    )}
                  </div>
                  <div className="space-y-2">
                    {entityForms.createNewItem.familyName.label.component.Render(
                      {
                        translation,
                      },
                    )}

                    {entityForms.createNewItem.familyName.input.component.Render(
                      {
                        value:
                          formData[
                            entityForms.createNewItem.familyName.input.component
                              .dataEntityAttrName as keyof IEntity
                          ],
                        onChange: handleFormInputChange,
                      },
                    )}
                  </div>
                  <div className="col-span-2 space-y-2">
                    {entityForms.createNewItem.email.label.component.Render({
                      translation,
                    })}

                    {entityForms.createNewItem.email.input.component.Render({
                      value:
                        formData[
                          entityForms.createNewItem.email.input.component
                            .dataEntityAttrName as keyof IEntity
                        ],
                      onChange: handleFormInputChange,
                    })}
                  </div>
                  <div className="col-span-2 space-y-2">
                    {entityForms.createNewItem.password.label.component.Render({
                      translation,
                    })}

                    {entityForms.createNewItem.password.input.component.Render({
                      value:
                        formData[
                          entityForms.createNewItem.password.input.component
                            .dataEntityAttrName as keyof IEntity
                        ],
                      onChange: handleFormInputChange,
                    })}
                  </div>

                  <div className="col-span-2 space-y-2">
                    {entityForms.createNewItem.phone.label.component.Render({
                      translation,
                    })}

                    {entityForms.createNewItem.phone.input.component.Render({
                      value:
                        formData[
                          entityForms.createNewItem.phone.input.component
                            .dataEntityAttrName as keyof IEntity
                        ],
                      onChange: handleFormInputChange,
                    })}
                  </div>
                  <div className="col-span-2 space-y-2">
                    {entityForms.createNewItem.status.label.component.Render({
                      translation,
                    })}

                    {entityForms.createNewItem.status.input.component.Render({
                      value:
                        formData[
                          entityForms.createNewItem.status.input.component
                            .dataEntityAttrName as keyof IEntity
                        ],
                      onChange: handleFormInputChange,
                    })}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormOpen(false)}
                  >
                    {translation("cancelText")}
                  </Button>
                  <Button type="submit">{translation("saveText")}</Button>
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
                  {translation("alertDeleteItemTitle")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {translation("alertDeleteItemDescription")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                  {translation("cancelText")}
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelete}>
                  {translation("alertDeleteItemConfirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Card>
            <CardHeader>
              <CardTitle>{translation("itemsTabeTitle")}</CardTitle>
              <CardDescription>
                {translation("itemsTabeSubtitle")}
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
                elements={elements}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
                newItemInitialState={newItemInitialState}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalPages={totalPages}
                searchTerm={searchTerm}
                columns={Object.keys(newItemInitialState).filter(
                  (key) => !["password"].includes(key),
                )}
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
