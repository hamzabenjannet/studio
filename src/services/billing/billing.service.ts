import { API_URL } from "@/app/consts";
import { DatasetFilterDto, fetchWrapper } from "../common";

export const filterBilling = async (
  filterEntitiesPayloadDto: DatasetFilterDto,
) => {
  return await fetch(`${API_URL}/filterBilling`, {
    method: "POST",
    body: JSON.stringify(filterEntitiesPayloadDto),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });
};

export const createBilling = async (
  billingPayloadDto: Record<
    string,
    string | number | boolean | undefined | null | any
  >,
) => {
  const response = await fetch(`${API_URL}/createBilling`, {
    method: "POST",
    body: JSON.stringify(billingPayloadDto),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};

export const updateBilling = async (
  billingDetailsPayloadDto: Record<
    string,
    string | number | boolean | undefined | null | any
  >,
) => {
  return await fetchWrapper({
    body: JSON.stringify(billingDetailsPayloadDto),
    method: "POST",
    url: `${API_URL}/updateBilling`,
  });
};

export const deleteBilling = async (_id: number | string) => {
  return await fetch(`${API_URL}/deleteBilling`, {
    method: "POST",
    body: JSON.stringify({ _id }),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });
};
