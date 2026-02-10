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

export const filterVehicles = async (
  filterEntitiesPayloadDto: FilterEntitiesPayloadDto,
) => {
  return await fetch(`${API_URL}/filterVehicles`, {
    method: "POST",
    body: JSON.stringify(filterEntitiesPayloadDto),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });
};

export const createVehicle = async (
  vehiclePayloadDto: Record<
    string,
    string | number | boolean | undefined | null
  >,
) => {
  return await fetch(`${API_URL}/createVehicle`, {
    method: "POST",
    body: JSON.stringify(vehiclePayloadDto),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });
};

export const updateVehicle = async (
  vehicleDetailsPayloadDto: Record<
    string,
    string | number | boolean | undefined | null
  >,
) => {
  return await fetch(`${API_URL}/updateVehicle`, {
    method: "POST",
    body: JSON.stringify(vehicleDetailsPayloadDto),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });
};

export const deleteVehicle = async (_id: number | string) => {
  return await fetch(`${API_URL}/deleteVehicle`, {
    method: "POST",
    body: JSON.stringify({ _id }),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });
};
