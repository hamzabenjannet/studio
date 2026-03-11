import { StatusEnum } from "@/enums/status.enum";
import {
  buildDataTableFetchElements,
  buildItemInitState,
  IBaseEntity,
} from "@/services/common";

import { IEntity as IEntityUser } from "@/app/users/entity";

import { Entity as StockEntity } from "@/app/stock/entity";
import { Entity as VehicleEntity } from "@/app/vehicles/entity";
import { Entity as UserEntity } from "@/app/users/entity";

export const entityName = "workOrder";
export const entityPluralName = "workOrders";
export const datasetFetchResponseItemsAttr = "workOrders";

export {
  createWorkOrder as createEntityService,
  filterWorkOrders as datasetFetchMethod,
  updateWorkOrder as updateEntityService,
} from "@/services/work-order/work-order.service";

import { filterWorkOrders as datasetFetchMethod } from "@/services/work-order/work-order.service";

export const fetchElements = buildDataTableFetchElements<IEntity>({
  datasetFetchMethod,
  datasetFetchResponseItemsAttr,
});

export interface IEntity extends IBaseEntity {
  startTime?: string | undefined;
  endTime?: string | undefined;
  estimatedDuration?: string | undefined;
  notes?: string | undefined;
  vehicle?: VehicleEntity | undefined;
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
  vehicle?: VehicleEntity | undefined = undefined;
  vehicleString?: string | undefined = undefined;
  labors?: UserEntity[] | undefined = [];
  laborsString?: string | undefined = undefined;
  materials?: StockEntity[] | undefined = [];
  materialsString?: string | undefined = undefined;
  status?: StatusEnum | undefined = StatusEnum.ACTIVE;
}

export const itemInitState = buildItemInitState<IEntity>({
  EntityClass: Entity,
});
