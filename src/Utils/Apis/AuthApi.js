import AxiosInstance from "@/Utils/AxiosInstance";

export const login = async (email, password) => {
  const response = await AxiosInstance.get(`/user?email=eq.${email}&password=eq.${password}`);
  return response.data; 
};