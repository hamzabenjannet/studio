import { StatusEnum } from "@/enums/status.enum";
import {
  buildDataTableFetchElements,
  buildItemInitState,
  IBaseEntity,
} from "@/services/common";

import { IEntity as IEntityUser } from "@/app/users/entity";

export const entityName = "vehicle";
export const entityPluralName = "vehicles";
export const datasetFetchResponseItemsAttr = "vehicles";

export {
  createVehicle as createEntityService,
  filterVehicles as datasetFetchMethod,
  updateVehicle as updateEntityService,
} from "@/services/vehicles/vehicles.service";

import { filterVehicles as datasetFetchMethod } from "@/services/vehicles/vehicles.service";

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
  status?: StatusEnum | undefined = StatusEnum.ACTIVE;
  createdAt?: string | undefined = undefined;
  archivedAt?: string | undefined = undefined;
}

export const itemInitState = buildItemInitState<IEntity>({
  EntityClass: Entity,
});

export const fetchElements = buildDataTableFetchElements<IEntity>({
  datasetFetchMethod,
  datasetFetchResponseItemsAttr,
});
