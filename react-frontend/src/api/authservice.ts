import { User, UserRole } from "@/types";
import api, { handleApiError } from "./axios";

export const registerUser = async (
  full_name: string,
  email: string,
  role: UserRole,
  password: string
): Promise<{
  status: number;
  data: { message: string };
}> => {
  try {
    const response = api.post("/users/register", {
      name: full_name,
      email,
      role,
      password,
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{
  status: number;
  data: { access_token: string; user: User };
}> => {
  try {
    const response = api.post("/users/login", {
      email,
      password,
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};
