"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

// import { filterEntities as filterEntitiesUsersService } from "@/services/users/users.service";
// import Button from "@mui/material/Button";

import { StatusEnum } from "@/enums/status.enum";

import {
  Entity as StockEntity,
  datasetFetchMethod as datasetFetchStocksMethod,
} from "@/app/stock/entity";
import {
  datasetFetchMethod as datasetFetchVehiclesMethod,
  Entity as VehicleEntity,
} from "@/app/vehicles/entity";
import {
  Entity as UserEntity,
  datasetFetchMethod as datasetFetchUsersMethod,
} from "@/app/users/entity";

// import * as React from 'react';
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];
export function MultipleSelectCheckmarks() {
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected: any) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {names.map((name) => {
            const selected = personName.includes(name);
            const SelectionIcon = selected
              ? CheckBoxIcon
              : CheckBoxOutlineBlankIcon;

            return (
              <MenuItem key={name} value={name}>
                <SelectionIcon
                  fontSize="small"
                  style={{
                    marginRight: 8,
                    padding: 9,
                    boxSizing: "content-box",
                  }}
                />
                <ListItemText primary={name} />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}

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
            // return <Label {...props}>{"vehicle"}</Label>;
            return null;
          },
        },
        input: {
          type: "select",
          dataEntityAttrName: "vehicle",
          Render: ({
            props,
            value = "",
          }: {
            // props?: React.ComponentProps<typeof Select>;
            props?: React.ComponentProps<typeof UiSelect>;
            value?: string | number | undefined | VehicleEntity;
          }) => {
            const [selectOptions, setSelectOptions] = useState<VehicleEntity[]>(
              [],
            );

            const handleChange = (event: SelectChangeEvent) => {
              const eventTargetValue = event.target.value as string;

              const onValueChangeValue = selectOptions.find(
                (entityItem: VehicleEntity) => {
                  return (
                    entityItem._id?.toString() === (eventTargetValue as string)
                  );
                },
              );
              console.log("onValueChangeValue", onValueChangeValue);

              handleFormInputChange?.({
                target: {
                  value: onValueChangeValue,
                  dataset: {
                    entityAttrName: "vehicle",
                  },
                },
              } as unknown as React.ChangeEvent<HTMLInputElement>);
            };

            const fetchSelectOptions = async () => {
              const response = await datasetFetchVehiclesMethod({
                attributes: {},
                pagination: {
                  perPage: "99999999",
                },
              });

              const { vehicles }: { vehicles: VehicleEntity[] } =
                await response.json();

              setSelectOptions(vehicles.map((item: VehicleEntity) => item));
            };

            React.useEffect(() => {
              fetchSelectOptions();
            }, [datasetFetchVehiclesMethod]);

            const vehicleId =
              selectOptions.find((entityItem: VehicleEntity) => {
                return (
                  entityItem._id?.toString() ===
                  (value as VehicleEntity)?._id?.toString()
                );
              })?._id ?? "";

            // return (
            //   <Box sx={{ minWidth: 120, position: "relative" }}>
            //     <FormControl fullWidth>
            //       <InputLabel id="work-order-vehicle-select-label">
            //         {"vehicle"}
            //       </InputLabel>
            //       <Select
            //         labelId="work-order-vehicle-select-label"
            //         id="work-order-vehicle-select"
            //         value={vehicleId as string}
            //         label={"vehicle"}
            //         onChange={handleChange}
            //         MenuProps={{
            //           disablePortal: true,
            //           // anchorOrigin: {
            //           //   vertical: "bottom",
            //           //   horizontal: "left",
            //           // },
            //           // transformOrigin: {
            //           //   vertical: "top",
            //           //   horizontal: "left",
            //           // },
            //           // sx: {
            //           //   position: "absolute",
            //           //   top: "100% !important",
            //           //   left: "-100px !important",
            //           //   width: "100%",
            //           //   height: "200px",
            //           //   // Remove any transform that might shift it
            //           //   transform: "none !important",
            //           //   zIndex: 1300,
            //           // },
            //         }}
            //         // data-entity-attr-name="vehicle"
            //       >
            //         {selectOptions.map((selectOptionsItem) => {
            //           if (!selectOptionsItem._id) {
            //             return null;
            //           }
            //           return (
            //             <MenuItem
            //               key={`vehicle_${selectOptionsItem._id}`}
            //               value={selectOptionsItem._id.toString()}
            //             >
            //               {(selectOptionsItem.plateNumber
            //                 ? selectOptionsItem.plateNumber
            //                 : selectOptionsItem.vin) ||
            //                 `_id: ${selectOptionsItem._id}`}
            //             </MenuItem>
            //           );
            //         })}
            //       </Select>
            //     </FormControl>
            //   </Box>
            // );

            return (
              <UiSelect
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
              </UiSelect>
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
            return null;
            // <Label {...props}>
            //   {/* {translation
            //           ? translation("common.selectOwner")
            //           : "itemAttrInputTextLabel"} */}
            //   {"labors"}
            // </Label>
          },
        },
        input: {
          type: "multiselect",
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

            const fetchSelectOptions = async () => {
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
              fetchSelectOptions();
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

      // labors: {
      //   label: {
      //     Render: ({
      //       props,
      //     }: {
      //       props?: React.ComponentProps<typeof Label>;
      //     }) => {
      //       return (
      //         <Label {...props}>
      //           {/* {translation
      //                   ? translation("common.selectOwner")
      //                   : "itemAttrInputTextLabel"} */}
      //           {"labors"}
      //         </Label>
      //       );
      //     },
      //   },
      //   input: {
      //     type: "multiselect",
      //     dataEntityAttrName: "labors",
      //     Render: ({
      //       props,
      //       value = [],
      //     }: {
      //       props?: React.ComponentProps<typeof Select>;
      //       value?: UserEntity[];
      //     }) => {
      //       const [selectOptions, setSelectOptions] = useState<UserEntity[]>(
      //         [],
      //       );

      //       const fillSelectOptions = async () => {
      //         const response = await datasetFetchUsersMethod({
      //           attributes: {},
      //           pagination: {
      //             perPage: "99999999",
      //           },
      //         });

      //         const { users }: { users: UserEntity[] } = await response.json();

      //         setSelectOptions(users.map((item: UserEntity) => item));
      //       };
      //       const handleItemsToggle = (
      //         userSelected: UserEntity,
      //         checkedState: string | boolean,
      //       ) => {
      //         const _onValueChangeValue: UserEntity[] = checkedState
      //           ? [...value, userSelected]
      //           : value.filter((item) => item._id !== userSelected._id);

      //         handleFormInputChange?.({
      //           target: {
      //             value: _onValueChangeValue,
      //             dataset: {
      //               entityAttrName: "labors",
      //             },
      //           },
      //         } as unknown as React.ChangeEvent<HTMLInputElement>);
      //       };

      //       React.useEffect(() => {
      //         fillSelectOptions();
      //       }, [datasetFetchUsersMethod]);

      //       return (
      //         <ScrollArea className="h-full p-4">
      //           <div className="space-y-2">
      //             {selectOptions.map((selectOptionsItem) => (
      //               <div
      //                 key={selectOptionsItem._id}
      //                 className="flex items-center space-x-2"
      //               >
      //                 <Checkbox
      //                   id={`labor-${selectOptionsItem._id}`}
      //                   checked={value?.some(
      //                     (l) => l._id === selectOptionsItem._id,
      //                   )}
      //                   onCheckedChange={(checkedState) =>
      //                     handleItemsToggle(selectOptionsItem, checkedState)
      //                   }
      //                 />
      //                 <label
      //                   htmlFor={`labor-${selectOptionsItem._id}`}
      //                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      //                 >
      //                   {selectOptionsItem.givenName}{" "}
      //                   {selectOptionsItem.familyName}
      //                 </label>
      //               </div>
      //             ))}
      //           </div>
      //         </ScrollArea>
      //       );
      //     },
      //   },
      // },

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
          type: "multiselect",
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

            // return (
            //   <div >
            //     {selectOptions.length}
            //   </div>
            // )

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
            const selectOptions = Object.values(StatusEnum);

            return <div>{selectOptions.length}</div>;

            // return (
            //   <Select
            //     {...props}
            //     value={(value === null ? "" : value) as string}
            //     onValueChange={(value) => {
            //       handleFormInputChange?.({
            //         target: {
            //           value,
            //           dataset: {
            //             entityAttrName: "status",
            //           },
            //         },
            //       } as unknown as React.ChangeEvent<HTMLInputElement>);
            //     }}
            //     data-entity-attr-name="status"
            //   >
            //     <SelectTrigger id="status">
            //       <SelectValue
            //         placeholder={translation(
            //           "usersPage.itemSelectStatusPlaceholder",
            //         )}
            //       />
            //     </SelectTrigger>
            //     <SelectContent>
            //       {selectOptions.map((mapItemValue) => (
            //         <SelectItem
            //           key={`status_${mapItemValue}`}
            //           value={mapItemValue}
            //         >
            //           {mapItemValue}
            //         </SelectItem>
            //       ))}
            //     </SelectContent>
            //   </Select>
            // );
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
