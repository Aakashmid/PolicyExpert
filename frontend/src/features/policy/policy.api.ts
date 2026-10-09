import api from "@/services/api";
import type { Policy, UploadPolicyPayload } from "./policy.types";

export const getPolicies = async () => {
  const { data } = await api.get<Policy[]>("/policies/");
  return data;
};

export const uploadPolicy = async (payload: UploadPolicyPayload) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, value);
  });

  const { data } = await api.post<Policy>("/policies/upload/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};


export const deletePolicy = async (id: number) => {
  await api.delete(`/policies/${id}/`);
};