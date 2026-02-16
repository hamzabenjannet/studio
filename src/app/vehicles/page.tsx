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
import { filterEntities as filterEntitiesUsersService } from "@/services/users/users.service";
import { IEntity as IEntityUser } from "@/app/users/page";

import {
  createVehicle as createEntityVehiclesService,
  filterVehicles as datasetFetchMethod,
  updateVehicle as updateEntityVehiclesService,
} from "@/services/vehicles/vehicles.service";

import { StatusEnum as SttsEnum } from "@/enums/status.enum";
import { TableSection } from "@/components/ui/table";

import {
  buildFetchElements,
  buildItemInitState,
  handleSaveEntity,
  IBaseEntity,
} from "@/services/commun";

import { Entity as UserEntity } from "@/app/users/page";

export const entityName = "vehicle";
export const entityPluralName = "vehicles";
export const datasetFetchResponseItemsAttr = "vehicles";

export interface IEntity extends IBaseEntity {
  make?: string | undefined;
  model?: string | undefined;
  year?: string | undefined;
  plateNumber?: string | undefined;
  vin?: string | undefined;
  owner?: IEntityUser | number | string | undefined;
  ownerString?: string | undefined;
}

export class Entity implements IEntity {
  _id: number = -2;
  make?: string | undefined = undefined;
  model?: string | undefined = undefined;
  year?: string | undefined = undefined;
  plateNumber?: string | undefined = undefined;
  vin?: string | undefined = undefined;
  owner?: IEntityUser | number | string | undefined = undefined;
  ownerString?: string | undefined = undefined;
  status?: SttsEnum | undefined = SttsEnum.ACTIVE;
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
      make: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("entityForms.editItemAttributes.make")
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "text",
          dataEntityAttrName: "make",
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
                id="make"
                type="text"
                placeholder="Renault"
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="make"
                {...props}
              />
            );
          },
        },
      },
      model: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("entityForms.editItemAttributes.model")
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "text",
          dataEntityAttrName: "model",
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
                id="model"
                type="text"
                placeholder="Clio"
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="model"
                {...props}
              />
            );
          },
        },
      },
      year: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("entityForms.editItemAttributes.year")
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "text",
          dataEntityAttrName: "year",
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
                id="year"
                type="text"
                placeholder="2020"
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="year"
                {...props}
              />
            );
          },
        },
      },
      plateNumber: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("entityForms.editItemAttributes.plateNumber")
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "text",
          dataEntityAttrName: "plateNumber",
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
                id="plateNumber"
                type="text"
                placeholder="AB-123-CD"
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="plateNumber"
                {...props}
              />
            );
          },
        },
      },
      vin: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("entityForms.editItemAttributes.vin")
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "text",
          dataEntityAttrName: "vin",
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
                id="vin"
                type="text"
                placeholder="VF123ABC..."
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="vin"
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
            const selectOptions = Object.values(SttsEnum);

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
                  {selectOptions.map((mapItemValue) => (
                    <SelectItem
                      key={`status_${mapItemValue}`}
                      value={mapItemValue}
                    >
                      {mapItemValue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          },
        },
      },
      viewOwner: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("entityForms.editItemAttributes.owner")
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "text",
          dataEntityAttrName: "owner",
          Render: ({
            props,
            value = "",
            onChange = () => {},
          }: {
            props?: React.ComponentProps<typeof Input>;
            value?: string | number | undefined;
            onChange?: (event?: any) => void;
          }) => {
            const [preview, setPreview] = useState<boolean>(false);

            return (
              <div className="space-y-2">
                <Button type="button" onClick={() => setPreview(!preview)}>
                  {/* {"view"} */}
                  {preview ? "hide" : "view"}
                </Button>
                {!preview ? null : (
                  <p className="text-sm text-gray-500 overflow-scroll whitespace-nowrap h-20 overflow-auto">
                    {JSON.stringify(value)}
                  </p>
                )}
              </div>
            );
          },
        },
      },
      owner: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("common.selectOwner")
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "select",
          dataEntityAttrName: "owner",
          Render: ({
            props,
            value = "",
          }: {
            props?: React.ComponentProps<typeof Select>;
            value?: string | number | undefined | UserEntity;
          }) => {
            const [selectOptions, setSelectOptions] = useState<UserEntity[]>(
              [],
            );

            const fillSelectOptions = async () => {
              const response = await filterEntitiesUsersService({
                attributes: {},
                pagination: {
                  perPage: "99999999",
                },
              });

              const { users }: { users: UserEntity[] } = await response.json();

              setSelectOptions(users.map((item: UserEntity) => item));
            };
            React.useEffect(() => {
              fillSelectOptions();
            }, [filterEntitiesUsersService]);

            const ownerId =
              selectOptions.find((UserItem: UserEntity) => {
                return (
                  UserItem._id?.toString() ===
                  (value as UserEntity)?._id?.toString()
                );
              })?._id ?? "";

            return (
              <Select
                {...props}
                value={ownerId.toString()}
                onValueChange={(onValueChangeValue) => {
                  const _onValueChangeValue = selectOptions.find(
                    (UserItem: UserEntity) => {
                      return (
                        UserItem._id?.toString() ===
                        (onValueChangeValue as string)
                      );
                    },
                  );

                  handleFormInputChange?.({
                    target: {
                      value: _onValueChangeValue,
                      dataset: {
                        entityAttrName: "owner",
                      },
                    },
                  } as unknown as React.ChangeEvent<HTMLInputElement>);
                }}
                data-entity-attr-name="owner"
              >
                <SelectTrigger id="owner">
                  <SelectValue
                    placeholder={translation(
                      "entityForms.editItemAttributes.owner",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {selectOptions.map((mapItemValue) => {
                    if (!mapItemValue._id) {
                      return null;
                    }
                    return (
                      <SelectItem
                        key={`owner_${mapItemValue._id}`}
                        value={mapItemValue._id.toString()}
                      >
                        {mapItemValue.givenName} {mapItemValue.familyName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            );
          },
        },
      },
    },
    // editItemAttributes: {} as Record<string, any>,
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
                {translation("vehicles.page.pageTitle")}
              </h1>
              <p className="text-muted-foreground">
                {translation("vehicles.page.pageSubtitle")}
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
                    createEntityService: createEntityVehiclesService,
                    updateEntityService: updateEntityVehiclesService,
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
                      createEntityService: createEntityVehiclesService,
                      updateEntityService: updateEntityVehiclesService,
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
              <CardTitle>
                {translation("vehicles.page.itemsTabeTitle")}
              </CardTitle>
              <CardDescription>
                {translation("vehicles.page.itemsTabeSubtitle")}
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
                  (key) => !["owner"].includes(key),
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
