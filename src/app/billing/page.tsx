"use client";

import React, { useEffect, useState } from "react";
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

import { IEntity as IEntityWorkOrder } from "@/app/workOrders/page";
import {
  createBilling as createEntityBillingService,
  filterBilling as datasetFetchMethod,
  updateBilling as updateEntityBillingService,
} from "@/services/billing/billing.service";
import { filterWorkOrders as datasetFetchWorkOrdersMethod } from "@/services/work-order/work-order.service";

import { StatusEnum as SttsEnum } from "@/enums/status.enum";
import { TableSection } from "@/components/ui/table";

import {
  buildFetchElements,
  buildItemInitState,
  handleSaveEntity,
  IBaseEntity,
} from "@/services/commun";

export const entityName = "billing";
export const entityPluralName = "billingItems";
export const datasetFetchResponseItemsAttr = "billingItems";

export interface IEntity extends IBaseEntity {
  workOrder?: IEntityWorkOrder | undefined;
  workOrderString?: string | undefined;
  totalPrice?: number | undefined;
  currency?: string | undefined;
  issueDate?: string | undefined;
  dueDate?: string | undefined;
  vatRate?: number | undefined;
  issuedBy?: string | undefined;
  issuedFor?: string | undefined;
  createdAt?: string | undefined;
}

export class Entity implements IEntity {
  _id: number = -2;
  workOrder?: IEntityWorkOrder | undefined = undefined;
  workOrderString?: string | undefined = undefined;
  totalPrice?: number | undefined = undefined;
  currency?: string | undefined = "EUR";
  issueDate?: string | undefined = undefined;
  dueDate?: string | undefined = undefined;
  vatRate?: number | undefined = undefined;
  issuedBy?: string | undefined = undefined;
  issuedFor?: string | undefined = undefined;
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
      workOrder: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return <Label {...props}>Ordre de réparation</Label>;
          },
        },
        input: {
          type: "select",
          dataEntityAttrName: "workOrder",
          Render: ({
            props,
            value = "",
          }: {
            props?: React.ComponentProps<typeof Select>;
            value?: string | number | undefined | IEntityWorkOrder;
          }) => {
            const [selectOptions, setSelectOptions] = useState<
              IEntityWorkOrder[]
            >([]);

            const fillSelectOptions = async () => {
              const response = await datasetFetchWorkOrdersMethod({
                attributes: {},
                pagination: {
                  perPage: "99999999",
                },
              });

              const { workOrders }: { workOrders: IEntityWorkOrder[] } =
                await response.json();

              setSelectOptions(workOrders.map((item: IEntityWorkOrder) => item));
            };

            React.useEffect(() => {
              fillSelectOptions();
            }, []);

            const workOrderId =
              selectOptions.find((workOrderItem: IEntityWorkOrder) => {
                return (
                  workOrderItem._id?.toString() ===
                  (value as IEntityWorkOrder)?._id?.toString()
                );
              })?._id ?? "";

            return (
              <Select
                {...props}
                value={workOrderId.toString()}
                onValueChange={(onValueChangeValue) => {
                  const selected = selectOptions.find(
                    (workOrderItem: IEntityWorkOrder) => {
                      return (
                        workOrderItem._id?.toString() ===
                        (onValueChangeValue as string)
                      );
                    },
                  );

                  handleFormInputChange?.({
                    target: {
                      value: selected,
                      dataset: {
                        entityAttrName: "workOrder",
                      },
                    },
                  } as unknown as React.ChangeEvent<HTMLInputElement>);
                }}
                data-entity-attr-name="workOrder"
              >
                <SelectTrigger id="workOrder">
                  <SelectValue placeholder="Sélectionner un ordre de réparation" />
                </SelectTrigger>
                <SelectContent>
                  {selectOptions.map((selectOptionsItem) => {
                    if (!selectOptionsItem._id) {
                      return null;
                    }
                    return (
                      <SelectItem
                        key={`workOrder_${selectOptionsItem._id}`}
                        value={selectOptionsItem._id.toString()}
                      >
                        {`#${selectOptionsItem._id} - ${
                          selectOptionsItem.vehicle
                            ? (selectOptionsItem.vehicle as any).plateNumber ||
                              (selectOptionsItem.vehicle as any).vin ||
                              ""
                            : ""
                        }`}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            );
          },
        },
      },
      totalPrice: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return <Label {...props}>Montant total</Label>;
          },
        },
        input: {
          type: "number",
          dataEntityAttrName: "totalPrice",
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
                id="totalPrice"
                type="number"
                placeholder="Montant total"
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="totalPrice"
                {...props}
              />
            );
          },
        },
      },
      currency: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return <Label {...props}>Devise</Label>;
          },
        },
        input: {
          type: "text",
          dataEntityAttrName: "currency",
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
                id="currency"
                type="text"
                placeholder="EUR"
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="currency"
                {...props}
              />
            );
          },
        },
      },
      issueDate: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return <Label {...props}>Date d&apos;émission</Label>;
          },
        },
        input: {
          type: "datetime-local",
          dataEntityAttrName: "issueDate",
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
                id="issueDate"
                type="datetime-local"
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="issueDate"
                {...props}
              />
            );
          },
        },
      },
      dueDate: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return <Label {...props}>Date d&apos;échéance</Label>;
          },
        },
        input: {
          type: "datetime-local",
          dataEntityAttrName: "dueDate",
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
                id="dueDate"
                type="datetime-local"
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="dueDate"
                {...props}
              />
            );
          },
        },
      },
      vatRate: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return <Label {...props}>TVA (%)</Label>;
          },
        },
        input: {
          type: "number",
          dataEntityAttrName: "vatRate",
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
                id="vatRate"
                type="number"
                placeholder="TVA"
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="vatRate"
                {...props}
              />
            );
          },
        },
      },
      issuedBy: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return <Label {...props}>Émis par</Label>;
          },
        },
        input: {
          type: "text",
          dataEntityAttrName: "issuedBy",
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
                id="issuedBy"
                type="text"
                placeholder="Garage"
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="issuedBy"
                {...props}
              />
            );
          },
        },
      },
      issuedFor: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return <Label {...props}>Émis pour</Label>;
          },
        },
        input: {
          type: "text",
          dataEntityAttrName: "issuedFor",
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
                id="issuedFor"
                type="text"
                placeholder="Client"
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="issuedFor"
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
                {translation("entityForms.editItemAttributes.status")}
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
                  <SelectValue placeholder="Sélectionnez le statut" />
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
    },
  };

  return { entityForms };
};

function BillingPage() {
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

  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h1 className="text-3xl font-headline font-bold tracking-tight">
                Facturation
              </h1>
              <p className="text-muted-foreground">
                Gérez les factures et la facturation liée aux ordres de
                réparation.
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
                    createEntityService: createEntityBillingService,
                    updateEntityService: updateEntityBillingService,
                  })(event);

                  setFormData(itemInitState);
                }}
              >
                <div className="grid grid-cols-4 gap-4 py-4">
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
                    };

                    handleSaveEntity({
                      formData: formDataDto,
                      createEntityService: createEntityBillingService,
                      updateEntityService: updateEntityBillingService,
                    })()?.finally(() => {
                      fetchElements({
                        currentPage,
                      });

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
              <CardTitle>Liste de facturation</CardTitle>
              <CardDescription>
                Consultez et gérez les factures liées aux ordres de réparation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="w-full">
                  <input
                    id="billingSearchInput"
                    type="text"
                    placeholder="Rechercher..."
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
                      <SelectValue placeholder="Éléments par page" />
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
                elements={(elements || []).map((elementsItem: IEntity) => {
                  const workOrder = elementsItem.workOrder as
                    | IEntityWorkOrder
                    | undefined;

                  return {
                    ...elementsItem,
                    workOrderString: workOrder
                      ? `#${workOrder._id} - ${
                          workOrder.vehicle
                            ? (workOrder.vehicle as any).plateNumber ||
                              (workOrder.vehicle as any).vin ||
                              ""
                            : ""
                        }`
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
                columns={Object.keys(itemInitState).filter((key) =>
                  [
                    "_id",
                    "workOrderString",
                    "totalPrice",
                    "currency",
                    "issueDate",
                    "dueDate",
                    "vatRate",
                    "issuedBy",
                    "issuedFor",
                    "status",
                    "createdAt",
                  ].includes(key),
                )}
              />
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default withAuth(BillingPage);
