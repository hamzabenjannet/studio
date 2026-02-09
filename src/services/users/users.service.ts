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

export const filterEntities = async (
  filterEntitiesPayloadDto: FilterEntitiesPayloadDto,
) => {
  return await fetch(`${API_URL}/filterUsers`, {
    method: "POST",
    body: JSON.stringify(filterEntitiesPayloadDto),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateUser = async (
  userDetailsPayloadDto: Record<string, string>,
) => {
  return await fetch(`${API_URL}/userDetails`, {
    method: "POST",
    body: JSON.stringify(userDetailsPayloadDto),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });
};
