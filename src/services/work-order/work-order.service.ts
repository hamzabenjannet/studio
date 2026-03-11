import { API_URL } from "@/app/consts";
import { DatasetFilterDto, fetchWrapper } from "../common";

export const filterWorkOrders = async (
  filterEntitiesPayloadDto: DatasetFilterDto,
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
  vehiclePayloadDto: Record<
    string,
    string | number | boolean | undefined | null
  >,
) => {
  const response = await fetch(`${API_URL}/createWorkOrder`, {
    method: "POST",
    body: JSON.stringify(vehiclePayloadDto),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};

export const updateWorkOrder = async (
  vehicleDetailsPayloadDto: Record<
    string,
    string | number | boolean | undefined | null
  >,
) => {
  return await fetchWrapper({
    body: JSON.stringify(vehicleDetailsPayloadDto),
    method: "POST",
    url: `${API_URL}/updateWorkOrder`,
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
