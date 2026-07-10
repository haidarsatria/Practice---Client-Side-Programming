import AxiosInstance from "@/Utils/AxiosInstance";

export const getAllKelas = () => AxiosInstance.get("/kelas");
export const getKelas = (id) => AxiosInstance.get(`/kelas/${id}`);
export const storeKelas = (data) => AxiosInstance.post("/kelas", data);
export const updateKelas = (id, data) => AxiosInstance.put(`/kelas/${id}`, data);
export const deleteKelas = (id) => AxiosInstance.delete(`/kelas/${id}`);