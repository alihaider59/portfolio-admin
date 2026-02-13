import { AxiosError } from "axios";
import { apiClient } from "./index";
import { type LoginRequest, type LoginResponseData, type MeResponse } from "../types/authTypes";
import { type ApiSuccess, type ApiFail } from "../types/common";

const invalidCredentialsMessage = "Invalid email or password.";

/** Login API: returns success with token & user, or fail with message (e.g. "Invalid email or password.") */
export const loginAdmin = async (data: LoginRequest): Promise<ApiSuccess<LoginResponseData>> => {
  try {
    const response = await apiClient.post<ApiSuccess<LoginResponseData> | ApiFail>(
      "/admin/login",
      data
    );
    const body = response.data;

    if (body.status === "fail" || body.status === "error") {
      throw new Error(body.message ?? invalidCredentialsMessage);
    }

    return body as ApiSuccess<LoginResponseData>;
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 401) {
      const message =
        (err.response.data as { message?: string })?.message ?? invalidCredentialsMessage;
      throw new Error(message);
    }
    throw err;
  }
};

export const checkAdminAuth = async (): Promise<ApiSuccess<MeResponse>> => {
  const response = await apiClient.get<ApiSuccess<MeResponse>>("/admin/me");
  return response.data;
};