// AuthService

import { API_URL } from "@/app/consts";

// login
export const signin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  return data;
};

// signup
export const signup = async (signUpDto: Record<string, string>) => {
  const response = await fetch(`${API_URL}/signUp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signUpDto),
  });
  const data = await response.json();
  return data;
};

// update user details
export const updateItem = async (
  updateEntityDto: // Record<string, string>
  Record<string, string | number | boolean | undefined | null>,
) => {
  const response = await fetch(`${API_URL}/userDetails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(updateEntityDto),
  });
  const data = await response.json();
  return data;
};
