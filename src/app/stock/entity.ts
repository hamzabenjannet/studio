import { StatusEnum } from "@/enums/status.enum";
import {
  buildDataTableFetchElements,
  buildItemInitState,
  IBaseEntity,
} from "@/services/common";

export const entityName = "stock";
export const entityPluralName = "stocks";
export const datasetFetchResponseItemsAttr = "stockItems";

export {
  createStock as createEntityService,
  filterStocks as datasetFetchMethod,
  updateStock as updateEntityService,
} from "@/services/stock/stock.service";

import { filterStocks as datasetFetchMethod } from "@/services/stock/stock.service";

export interface IEntity extends IBaseEntity {
  name?: string | undefined;
  sku?: string | undefined;
  quantity?: number | undefined;
  buyPrice?: number | undefined;
  sellPrice?: number | undefined;
  availableInInventory?: boolean | undefined;
  notes?: string | undefined;
}

export class Entity implements IEntity {
  _id: number = -2;
  name?: string | undefined = undefined;
  sku?: string | undefined = undefined;
  quantity?: number | undefined = 0;
  buyPrice?: number | undefined = 0;
  sellPrice?: number | undefined = 0;
  availableInInventory?: boolean | undefined = true;
  notes?: string | undefined = undefined;
  status?: StatusEnum | undefined = StatusEnum.ACTIVE;
}

export const itemInitState = buildItemInitState<IEntity>({
  EntityClass: Entity,
});

export const fetchElements = buildDataTableFetchElements<IEntity>({
  datasetFetchMethod,
  datasetFetchResponseItemsAttr,
});
