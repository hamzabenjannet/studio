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
import { filterEntities as datasetFetchMethod } from "@/services/users/users.service";
import {
  signup as createEntityUserService,
  updateItem as updateEntityUserService,
} from "@/services/auth/auth.service";

import { StatusEnum as SttsEnum } from "@/enums/status.enum";

import { TableSection } from "@/components/ui/table";
import {
  buildFetchElements,
  buildItemInitState,
  handleSaveEntity,
  IBaseEntity,
} from "@/services/commun";

export const entityName = "user";
export const entityPluralName = "users";
export const datasetFetchResponseItemsAttr = "users";

export interface IEntity extends IBaseEntity {
  givenName?: string;
  familyName?: string;
  email?: string;
  phone?: string;
  password?: string;
  createdAt?: string;
  archivedAt?: string;
}

export class Entity implements IEntity {
  _id: number = -2;
  givenName?: string | undefined = undefined;
  familyName?: string | undefined = undefined;
  email?: string = undefined;
  phone?: string = undefined;
  status?: SttsEnum | undefined = SttsEnum.ACTIVE;
  password?: string | undefined = undefined;
  createdAt?: string | undefined = undefined;
  archivedAt?: string | undefined = undefined;
}

export const itemInitState = buildItemInitState<IEntity>({
  EntityClass: Entity,
});

export const buildEntityForms = ({
  translation = (key: string) => key,
  handleFormInputChange = ({}: Record<string, any>) => {},
}: {
  translation?: (key: string) => string;
  handleFormInputChange?: (event: any) => void;
}) => {
  const entityForms = {
    editItemAttributes: {
      givenName: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("entityForms.editItemAttributes.givenName")
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "text",
          dataEntityAttrName: "givenName",
          Render: ({
            props,
            value = "",
            onChange = () => {},
          }: {
            props?: React.ComponentProps<typeof Input>;
            value?: string | number | undefined;
            onChange?: (event?: any) => void;
          }) => {
            return (
              <Input
                id="givenName"
                type="text"
                placeholder="Jean"
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="givenName"
                {...props}
              />
            );
          },
        },
      },
      familyName: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("entityForms.editItemAttributes.familyName")
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "text",
          dataEntityAttrName: "familyName",
          Render: ({
            props,
            value = "",
            onChange = () => {},
          }: {
            props?: React.ComponentProps<typeof Input>;
            value?: string | number | undefined;
            onChange?: (event?: any) => void;
          }) => {
            return (
              <Input
                id="familyName"
                type="text"
                placeholder="Dupont"
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="familyName"
                {...props}
              />
            );
          },
        },
      },
      email: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("entityForms.editItemAttributes.email")
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "text",
          dataEntityAttrName: "email",
          Render: ({
            props,
            value = "",
            onChange = () => {},
          }: {
            props?: React.ComponentProps<typeof Input>;
            value?: string | number | undefined;
            onChange?: (event?: any) => void;
          }) => {
            return (
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="j.dupont@example.com"
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="email"
                {...props}
              />
            );
          },
        },
      },
      password: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("entityForms.editItemAttributes.password")
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "text",
          dataEntityAttrName: "password",
          Render: ({
            props,
            value = "",
            onChange = () => {},
          }: {
            props?: React.ComponentProps<typeof Input>;
            value?: string | number | undefined;
            onChange?: (event?: any) => void;
          }) => {
            return (
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="password"
                {...props}
              />
            );
          },
        },
      },
      phone: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("entityForms.editItemAttributes.phone")
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "text",
          dataEntityAttrName: "phone",
          Render: ({
            props,
            value = "",
          }: {
            props?: React.ComponentProps<typeof Input>;
            value?: string | number | undefined;
          }) => {
            return (
              <Input
                id="phone"
                type="text"
                autoComplete="tel"
                placeholder="0612345678"
                value={value === null ? "" : value}
                onChange={handleFormInputChange || (() => {})}
                data-entity-attr-name="phone"
                {...props}
              />
            );
          },
        },
      },
      status: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("entityForms.editItemAttributes.status")
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "select",
          dataEntityAttrName: "status",
          Render: ({
            props,
            value = "",
          }: {
            props?: React.ComponentProps<typeof Select>;
            value?: string | number | undefined;
          }) => {
            const statusOptions = Object.values(SttsEnum);

            return (
              <Select
                {...props}
                value={(value === null ? "" : value) as string}
                onValueChange={(value) => {
                  handleFormInputChange?.({
                    target: {
                      value,
                      dataset: {
                        entityAttrName: "status",
                      },
                    },
                  } as unknown as React.ChangeEvent<HTMLInputElement>);
                }}
                data-entity-attr-name="status"
              >
                <SelectTrigger id="status">
                  <SelectValue
                    placeholder={translation(
                      "usersPage.itemSelectStatusPlaceholder",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          },
        },
      },
    },
  };

  return { entityForms };
};

function ElementsPage() {
  // begin ElementsPage states and handlers setup
  const translation = useTranslations();
  const [elements, setElements] = useState<IEntity[]>([] as IEntity[]);
  const [formData, setFormData] = useState<IEntity | undefined>(itemInitState);
  const [itemToDelete, setItemToDelete] = useState<IEntity | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const { entityAttrName } = e.target.dataset;
    setFormData((prev) => ({
      ...prev,
      ...(entityAttrName ? { [entityAttrName]: value } : {}),
    }));
  };
  const { entityForms } = buildEntityForms({
    translation,
    handleFormInputChange: handleFormInputChange,
  });
  const fetchElements = buildFetchElements<IEntity>({
    setElements,
    setTotalPages,
    datasetFetchMethod,
    datasetFetchResponseItemsAttr,
  });
  useEffect(() => {
    fetchElements({
      itemsPerPage,
      currentPage,
    });
  }, [formData?._id, currentPage, itemsPerPage]);
  // end ElementsPage states and handlers setup

  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h1 className="text-3xl font-headline font-bold tracking-tight">
                {translation("usersPage.pageTitle")}
              </h1>
              <p className="text-muted-foreground">
                {translation("usersPage.pageSubtitle")}
              </p>
            </div>
            <Button
              onClick={() => {
                setFormData({ ...itemInitState, _id: -1 });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              {translation("common.addItemButton")}
            </Button>
          </div>

          <Dialog
            open={
              formData?._id === -1 ||
              parseInt(formData?._id?.toString() || "0") >= 0
            }
            onOpenChange={() => {
              setFormData(itemInitState);
            }}
          >
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>
                  {formData?._id !== -1
                    ? translation("common.editItemDialogTitle")
                    : translation("common.addItemDialogTitle")}
                </DialogTitle>
                <DialogDescription>
                  {formData?._id !== -1
                    ? translation("common.editItemDialogSubtitle")
                    : translation("common.addItemDialogSubtitle")}
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(event) => {
                  handleSaveEntity({
                    formData,
                    createEntityService: createEntityUserService,
                    updateEntityService: updateEntityUserService,
                  })(event);

                  setFormData(itemInitState);
                }}
              >
                <div
                  // className="grid
                  // grid-cols-2
                  //  gap-4 py-4"
                  // className="grid
                  // grid-cols-6
                  //  gap-4 py-4"
                  className="grid grid-cols-4 gap-4 py-4"
                >
                  {Object.entries(entityForms.editItemAttributes).map(
                    ([inputKeyName, inputComponents]) => {
                      return (
                        <div
                          className="col-span-2 space-y-2"
                          key={inputKeyName}
                        >
                          {inputComponents.label.Render({})}

                          {inputComponents.input.Render({
                            value: formData?.[
                              inputComponents.input
                                .dataEntityAttrName as keyof IEntity
                            ] as string | number | undefined,

                            onChange: handleFormInputChange,
                          })}
                        </div>
                      );
                    },
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData(itemInitState)}
                  >
                    {translation("common.cancelText")}
                  </Button>
                  <Button type="submit">
                    {translation("common.saveText")}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <AlertDialog
            open={itemToDelete?._id ? true : false}
            onOpenChange={(open) => !open && setItemToDelete(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {translation("common.alertDeleteItemTitle")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {translation("common.alertDeleteItemDescription")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setItemToDelete(null);
                  }}
                >
                  {translation("common.cancelText")}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    const formDataDto = {
                      ...itemToDelete,
                      status: SttsEnum.TO_BE_DELETED,
                      ownerString: undefined,
                    };

                    handleSaveEntity({
                      formData: formDataDto,
                      createEntityService: createEntityUserService,
                      updateEntityService: updateEntityUserService,
                    })()?.finally(() => {
                      fetchElements({
                        currentPage,
                      });

                      // close the dialog
                      setFormData(itemInitState);
                    });
                  }}
                >
                  {translation("common.alertDeleteItemConfirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Card>
            <CardHeader>
              <CardTitle>{translation("usersPage.itemsTabeTitle")}</CardTitle>
              <CardDescription>
                {translation("usersPage.itemsTabeSubtitle")}
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
                // elements={elements}
                elements={(elements || []).map((user: IEntity) => {
                  return {
                    ...user,
                  };
                })}
                handleEditClick={(item: IEntity) => {
                  setFormData(item);
                }}
                handleDeleteClick={setItemToDelete}
                newItemInitialState={itemInitState}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalPages={totalPages}
                searchTerm={searchTerm}
                columns={Object.keys(itemInitState).filter(
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
