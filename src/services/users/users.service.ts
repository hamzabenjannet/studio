import { API_URL } from "@/app/consts";
import { DatasetFilterDto } from "../common";

export const filterEntities = async (
  filterEntitiesPayloadDto: DatasetFilterDto,
) => {
  return await fetch(`${API_URL}/filterUsers`, {
    method: "POST",
    body: JSON.stringify(filterEntitiesPayloadDto),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
