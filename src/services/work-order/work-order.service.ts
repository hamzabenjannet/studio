import { API_URL } from "@/app/consts";

export class FilterPaginationParamsDto {
  perPage?: string = "10";
  offset?: string = "0";
  page?: string = "1";
  sortField?: string = "_id";
  sortOrder?: string = "asc";
}

export type FilterEntitiesPayloadDto = {
  attributes: Record<string, string | undefined | null | number | boolean>;
  pagination?: FilterPaginationParamsDto;
  wildcard?: string;
};

export const filterWorkOrders = async (
  filterEntitiesPayloadDto: FilterEntitiesPayloadDto,
) => {
  return await fetch(`${API_URL}/filterWorkOrders`, {
    method: "POST",
    body: JSON.stringify(filterEntitiesPayloadDto),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });
};

export const createWorkOrder = async (
  workOrderPayloadDto: Record<
    string,
    string | number | boolean | undefined | null | any
  >,
) => {
  return await fetch(`${API_URL}/createWorkOrder`, {
    method: "POST",
    body: JSON.stringify(workOrderPayloadDto),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });
};

export const updateWorkOrder = async (
  workOrderDetailsPayloadDto: Record<
    string,
    string | number | boolean | undefined | null | any
  >,
) => {
  return await fetch(`${API_URL}/updateWorkOrder`, {
    method: "POST",
    body: JSON.stringify(workOrderDetailsPayloadDto),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });
};

export const deleteWorkOrder = async (_id: number | string) => {
  return await fetch(`${API_URL}/deleteWorkOrder`, {
    method: "POST",
    body: JSON.stringify({ _id }),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });
};
