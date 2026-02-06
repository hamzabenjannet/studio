// AuthService

import { API_URL } from "@/app/consts";

// signin
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

export const signup = async ({
  email,
  password,
  givenName,
  familyName,
}: {
  email: string;
  password: string;
  givenName: string;
  familyName: string;
}) => {
  const response = await fetch(`${API_URL}/signUp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      given_name: givenName,
      family_name: familyName,
    }),
  });
  const data = await response.json();
  return data;
};
