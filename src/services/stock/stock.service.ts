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

export const filterStocks = async (
  filterEntitiesPayloadDto: FilterEntitiesPayloadDto,
) => {
  return await fetch(`${API_URL}/filterStocks`, {
    method: "POST",
    body: JSON.stringify(filterEntitiesPayloadDto),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });
};

export const createStock = async (
  stockPayloadDto: Record<
    string,
    string | number | boolean | undefined | null
  >,
) => {
  return await fetch(`${API_URL}/createStock`, {
    method: "POST",
    body: JSON.stringify(stockPayloadDto),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });
};

export const updateStock = async (
  stockDetailsPayloadDto: Record<
    string,
    string | number | boolean | undefined | null
  >,
) => {
  return await fetch(`${API_URL}/updateStock`, {
    method: "POST",
    body: JSON.stringify(stockDetailsPayloadDto),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });
};

export const deleteStock = async (_id: number | string) => {
  return await fetch(`${API_URL}/deleteStock`, {
    method: "POST",
    body: JSON.stringify({ _id }),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });
};
