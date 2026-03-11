import { StatusEnum } from "@/enums/status.enum";
import {
  buildDataTableFetchElements,
  buildItemInitState,
  IBaseEntity,
} from "@/services/common";

export const entityName = "user";
export const entityPluralName = "users";
export const datasetFetchResponseItemsAttr = "users";

export { filterEntities as datasetFetchMethod } from "@/services/users/users.service";
import { filterEntities as datasetFetchMethod } from "@/services/users/users.service";
export {
  signup as createEntityService,
  updateItem as updateEntityService,
} from "@/services/auth/auth.service";

export interface IEntity extends IBaseEntity {
  givenName?: string;
  familyName?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export class Entity implements IEntity {
  _id: number = -2;
  status?: StatusEnum | undefined = StatusEnum.ACTIVE;
  givenName?: string | undefined = undefined;
  familyName?: string | undefined = undefined;
  email?: string = undefined;
  phone?: string = undefined;
  password?: string | undefined = undefined;
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
