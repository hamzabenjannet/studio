"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { StatusEnum } from "@/enums/status.enum";

export const buildEntityForms = ({
  translation = (key: string) => key,
  handleFormInputChange = ({}: Record<string, any>) => {},
}: {
  translation?: (key: string) => string;
  handleFormInputChange?: (event: any) => void;
}) => {
  const entityForms = {
    editItemAttributes: {
      name: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("entityForms.editItemAttributes.name")
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "text",
          dataEntityAttrName: "name",
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
                id="name"
                type="text"
                placeholder="Stock item name"
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="name"
                {...props}
              />
            );
          },
        },
      },
      sku: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("entityForms.editItemAttributes.sku")
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "text",
          dataEntityAttrName: "sku",
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
                id="sku"
                type="text"
                placeholder="Stock item SKU"
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="sku"
                {...props}
              />
            );
          },
        },
      },
      quantity: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("entityForms.editItemAttributes.quantity")
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "number",
          dataEntityAttrName: "quantity",
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
                id="quantity"
                type="number"
                placeholder="Stock item quantity"
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="quantity"
                {...props}
              />
            );
          },
        },
      },
      buyPrice: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("entityForms.editItemAttributes.buyPrice")
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "number",
          dataEntityAttrName: "buyPrice",
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
                id="buyPrice"
                type="number"
                placeholder="Stock item buy price"
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="buyPrice"
                {...props}
              />
            );
          },
        },
      },
      sellPrice: {
        label: {
          Render: ({
            props,
          }: {
            props?: React.ComponentProps<typeof Label>;
          }) => {
            return (
              <Label {...props}>
                {translation
                  ? translation("entityForms.editItemAttributes.sellPrice")
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "number",
          dataEntityAttrName: "sellPrice",
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
                id="sellPrice"
                type="number"
                placeholder="Stock item sell price"
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="sellPrice"
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
            const selectOptions = Object.values(StatusEnum);

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
      availableInInventory: {
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
                      "entityForms.editItemAttributes.availableInInventory",
                    )
                  : "itemAttrInputTextLabel"}
              </Label>
            );
          },
        },
        input: {
          type: "checkbox",
          dataEntityAttrName: "availableInInventory",
          Render: ({
            props,
            value = "",
            onChange = () => {},
          }: {
            props?: React.ComponentProps<typeof Checkbox>;
            value?: string | number | undefined;
            onChange?: (event?: any) => void;
          }) => {
            return (
              <Checkbox
                id="availableInInventory"
                checked={Boolean(value)}
                onCheckedChange={(checkedState) => {
                  handleFormInputChange?.({
                    target: {
                      value: checkedState,
                      dataset: {
                        entityAttrName: "availableInInventory",
                      },
                    },
                  } as unknown as React.ChangeEvent<HTMLInputElement>);
                }}
                data-entity-attr-name="availableInInventory"
              />
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
              // <Input
              //   id="notes"
              //   type="text"
              //   placeholder=""
              //   value={value === null ? "" : value}
              //   onChange={onChange || (() => {})}
              //   data-entity-attr-name="notes"
              //   {...props}
              // />
              <Textarea
                id="notes"
                placeholder="Notes supplémentaires..."
                value={value === null ? "" : value}
                onChange={onChange || (() => {})}
                data-entity-attr-name="notes"
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
