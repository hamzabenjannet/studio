import { API_URL } from "@/app/consts";
import { DatasetFilterDto, fetchWrapper } from "../common";

export const filterStocks = async (
  filterEntitiesPayloadDto: DatasetFilterDto,
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
  vehiclePayloadDto: Record<
    string,
    string | number | boolean | undefined | null
  >,
) => {
  const response = await fetch(`${API_URL}/createStock`, {
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

export const updateStock = async (
  vehicleDetailsPayloadDto: Record<
    string,
    string | number | boolean | undefined | null
  >,
) => {
  return await fetchWrapper({
    body: JSON.stringify(vehicleDetailsPayloadDto),
    method: "POST",
    url: `${API_URL}/updateStock`,
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
