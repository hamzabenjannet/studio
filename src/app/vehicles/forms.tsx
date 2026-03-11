"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { filterEntities as filterEntitiesUsersService } from "@/services/users/users.service";

import { StatusEnum } from "@/enums/status.enum";
import Button from "@mui/material/Button";

import { Entity as UserEntity } from "@/app/users/entity";

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
