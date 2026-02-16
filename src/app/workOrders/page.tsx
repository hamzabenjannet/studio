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

import { Checkbox } from "@/components/ui/checkbox";

import { IEntity as IEntityUser } from "@/app/users/page";
import { IEntity as IEntityVehicule } from "@/app/vehicles/page";
import { IEntity as IEntityStock } from "@/app/stock/page";
import { filterEntities as datasetFetchUsersMethod } from "@/services/users/users.service";
import {
  createVehicle as createEntityVehiclesService,
  filterVehicles as datasetFetchVehiclesMethod,
  updateVehicle as updateEntityVehiclesService,
} from "@/services/vehicles/vehicles.service";

import {
  createStock as createEntityStockService,
  filterStocks as datasetFetchStocksMethod,
  updateStock as updateEntityStockService,
} from "@/services/stock/stock.service";

import {
  createWorkOrder as createEntityWorkOrderService,
  filterWorkOrders as datasetFetchMethod,
  updateWorkOrder as updateEntityWorkOrderService,
} from "@/services/work-order/work-order.service";

import { StatusEnum as SttsEnum } from "@/enums/status.enum";
import { TableSection } from "@/components/ui/table";

import {
  buildFetchElements,
  buildItemInitState,
  handleSaveEntity,
  IBaseEntity,
} from "@/services/commun";

import { Entity as UserEntity } from "@/app/users/page";
import { Entity as VehiculeEntity } from "@/app/vehicles/page";
import { Entity as StockEntity } from "@/app/stock/page";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

const formatEntityRecursive = (
  entity: any,
  depth: number = 0,
): string | undefined => {
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
};

export const entityName = "workOrder";
export const entityPluralName = "workOrders";
export const datasetFetchResponseItemsAttr = "workOrders";

export interface IEntity extends IBaseEntity {
  startTime?: string | undefined;
  endTime?: string | undefined;
  estimatedDuration?: string | undefined;
  notes?: string | undefined;
  vehicle?: VehiculeEntity | undefined;
  vehicleString?: string | undefined;
  labors?: UserEntity[] | undefined;
  laborsString?: string | undefined;
  materials?: StockEntity[] | undefined;
  materialsString?: string | undefined;
  createdAt?: string | undefined;
}

export class Entity implements IEntity {
  _id: number = -2;
  startTime?: string | undefined = undefined;
  endTime?: string | undefined = undefined;
  estimatedDuration?: string | undefined = undefined;
  notes?: string | undefined = undefined;
  vehicle?: VehiculeEntity | undefined = undefined;
  vehicleString?: string | undefined = undefined;
  labors?: UserEntity[] | undefined = [];
  laborsString?: string | undefined = undefined;
  materials?: StockEntity[] | undefined = [];
  materialsString?: string | undefined = undefined;
  status?: SttsEnum | undefined = SttsEnum.ACTIVE;
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
      vehicle: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {/* {translation
                        ? translation("common.selectOwner")
                        : "itemAttrInputTextLabel"} */}
                {"vehicle"}
              </Label>
            );
          },
        },
        input: {
          type: "select",
          dataEntityAttrName: "vehicle",
          Render: ({
            props,
            value = "",
          }: {
            props?: React.ComponentProps<typeof Select>;
            value?: string | number | undefined | VehiculeEntity;
          }) => {
            const [selectOptions, setSelectOptions] = useState<
              VehiculeEntity[]
            >([]);

            const fillSelectOptions = async () => {
              const response = await datasetFetchVehiclesMethod({
                attributes: {},
                pagination: {
                  perPage: "99999999",
                },
              });

              const { vehicles }: { vehicles: VehiculeEntity[] } =
                await response.json();

              setSelectOptions(vehicles.map((item: VehiculeEntity) => item));
            };
            React.useEffect(() => {
              fillSelectOptions();
            }, [datasetFetchVehiclesMethod]);

            const vehicleId =
              selectOptions.find((VehicleItem: VehiculeEntity) => {
                return (
                  VehicleItem._id?.toString() ===
                  (value as VehiculeEntity)?._id?.toString()
                );
              })?._id ?? "";

            return (
              <Select
                {...props}
                value={vehicleId.toString()}
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
                        entityAttrName: "vehicle",
                      },
                    },
                  } as unknown as React.ChangeEvent<HTMLInputElement>);
                }}
                data-entity-attr-name="vehicle"
              >
                <SelectTrigger id="vehicle">
                  <SelectValue
                    placeholder={translation(
                      "entityForms.editItemAttributes.vehicle",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {selectOptions.map((selectOptionsItem) => {
                    if (!selectOptionsItem._id) {
                      return null;
                    }
                    return (
                      <SelectItem
                        key={`vehicle_${selectOptionsItem._id}`}
                        value={selectOptionsItem._id.toString()}
                      >
                        {(selectOptionsItem.plateNumber
                          ? selectOptionsItem.plateNumber
                          : selectOptionsItem.vin) ||
                          `_id: ${selectOptionsItem._id}`}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            );
          },
        },
      },

      labors: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {/* {translation
                        ? translation("common.selectOwner")
                        : "itemAttrInputTextLabel"} */}
                {"labors"}
              </Label>
            );
          },
        },
        input: {
          type: "select",
          dataEntityAttrName: "labors",
          Render: ({
            props,
            value = [],
          }: {
            props?: React.ComponentProps<typeof Select>;
            value?: UserEntity[];
          }) => {
            const [selectOptions, setSelectOptions] = useState<UserEntity[]>(
              [],
            );

            const fillSelectOptions = async () => {
              const response = await datasetFetchUsersMethod({
                attributes: {},
                pagination: {
                  perPage: "99999999",
                },
              });

              const { users }: { users: UserEntity[] } = await response.json();

              setSelectOptions(users.map((item: UserEntity) => item));
            };
            const handleItemsToggle = (
              userSelected: UserEntity,
              checkedState: string | boolean,
            ) => {
              const _onValueChangeValue: UserEntity[] = checkedState
                ? [...value, userSelected]
                : value.filter((item) => item._id !== userSelected._id);

              handleFormInputChange?.({
                target: {
                  value: _onValueChangeValue,
                  dataset: {
                    entityAttrName: "labors",
                  },
                },
              } as unknown as React.ChangeEvent<HTMLInputElement>);
            };

            React.useEffect(() => {
              fillSelectOptions();
            }, [datasetFetchUsersMethod]);

            return (
              <ScrollArea className="h-full p-4">
                <div className="space-y-2">
                  {selectOptions.map((selectOptionsItem) => (
                    <div
                      key={selectOptionsItem._id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`labor-${selectOptionsItem._id}`}
                        checked={value?.some(
                          (l) => l._id === selectOptionsItem._id,
                        )}
                        onCheckedChange={(checkedState) =>
                          handleItemsToggle(selectOptionsItem, checkedState)
                        }
                      />
                      <label
                        htmlFor={`labor-${selectOptionsItem._id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {selectOptionsItem.givenName}{" "}
                        {selectOptionsItem.familyName}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            );
          },
        },
      },

      materials: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {/* {translation
                        ? translation("common.selectOwner")
                        : "itemAttrInputTextLabel"} */}
                {"materials"}
              </Label>
            );
          },
        },
        input: {
          type: "select",
          dataEntityAttrName: "materials",
          Render: ({
            props,
            value = [],
          }: {
            props?: React.ComponentProps<typeof Select>;
            value?: StockEntity[];
          }) => {
            const [selectOptions, setSelectOptions] = useState<StockEntity[]>(
              [],
            );

            const fillSelectOptions = async () => {
              const response = await datasetFetchStocksMethod({
                attributes: {},
                pagination: {
                  perPage: "99999999",
                },
              });

              const { stockItems }: { stockItems: StockEntity[] } =
                await response.json();

              setSelectOptions(stockItems.map((item: StockEntity) => item));
            };
            const handleItemsToggle = (
              itemSelected: StockEntity,
              checkedState: string | boolean,
            ) => {
              const _onValueChangeValue: StockEntity[] = checkedState
                ? [...value, itemSelected]
                : value.filter((item) => item._id !== itemSelected._id);

              handleFormInputChange?.({
                target: {
                  value: _onValueChangeValue,
                  dataset: {
                    entityAttrName: "materials",
                  },
                },
              } as unknown as React.ChangeEvent<HTMLInputElement>);
            };

            React.useEffect(() => {
              fillSelectOptions();
            }, [datasetFetchStocksMethod]);

            return (
              <ScrollArea className="h-full p-4">
                <div className="space-y-2">
                  {selectOptions.map((selectOptionsItem) => (
                    <div
                      key={selectOptionsItem._id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`material-${selectOptionsItem._id}`}
                        checked={value?.some(
                          (l) => l._id === selectOptionsItem._id,
                        )}
                        onCheckedChange={(checkedState) =>
                          handleItemsToggle(selectOptionsItem, checkedState)
                        }
                      />
                      <label
                        htmlFor={`material-${selectOptionsItem._id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {selectOptionsItem.name || selectOptionsItem._id}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            );
          },
        },
      },

      estimatedDuration: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation(
                      "entityForms.editItemAttributes.estimatedDuration",
                    )
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "number",
          dataEntityAttrName: "estimatedDuration",
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
                id="estimatedDuration"
                type="number"
                placeholder="Estimated duration in minutes"
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="estimatedDuration"
                {...props}
              />
            );
          },
        },
      },
      startTime: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("entityForms.editItemAttributes.startTime")
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "datetime-local",
          dataEntityAttrName: "startTime",
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
                id="startTime"
                type="datetime-local"
                placeholder="Start Time"
                value={value === null ? "" : value?.toString().split(".")?.[0]}
                onChange={onChange || (() => {})}
                data-entity-attr-name="startTime"
                {...props}
              />
            );
          },
        },
      },
      endTime: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("entityForms.editItemAttributes.endTime")
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "datetime-local",
          dataEntityAttrName: "endTime",
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
                id="endTime"
                type="datetime-local"
                placeholder="End Time"
                value={value === null ? "" : value?.toString().split(".")?.[0]}
                onChange={onChange || (() => {})}
                data-entity-attr-name="endTime"
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

      notes: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("entityForms.editItemAttributes.notes")
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "text",
          dataEntityAttrName: "notes",
          Render: ({
            props,
            value = "",
            onChange = () => {},
          }: {
            props?: React.ComponentProps<typeof Textarea>;
            value?: string | number | undefined;
            onChange?: (event?: any) => void;
          }) => {
            return (
              <Textarea
                id="notes"
                placeholder="Notes supplémentaires..."
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
              />
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
                {translation("workOrders.page.pageTitle")}
              </h1>
              <p className="text-muted-foreground">
                {translation("workOrders.page.pageSubtitle")}
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
                    createEntityService: createEntityWorkOrderService,
                    updateEntityService: updateEntityWorkOrderService,
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
                      const value = formData?.[
                        inputComponents.input
                          .dataEntityAttrName as keyof IEntity
                      ] as unknown as any;

                      return (
                        <div
                          className="col-span-2 space-y-2"
                          key={inputKeyName}
                        >
                          {inputComponents.label.Render({})}

                          {inputComponents.input.Render({
                            // value: formData?.[
                            //   inputComponents.input
                            //     .dataEntityAttrName as keyof IEntity
                            // ] as unknown as string | number | undefined | IEntityUser[] | IEntityVehicule[] | IEntityStock[] | IEntity[],
                            value,
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
                      createEntityService: createEntityWorkOrderService,
                      updateEntityService: updateEntityWorkOrderService,
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
                {translation("workOrders.page.itemsTabeTitle")}
              </CardTitle>
              <CardDescription>
                {translation("workOrders.page.itemsTabeSubtitle")}
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
                elements={(elements || []).map((elementsItem: IEntity) => {
                  const { vehicle, labors, materials } = elementsItem;
                  return {
                    ...elementsItem,
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
