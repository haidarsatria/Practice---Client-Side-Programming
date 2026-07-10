import AxiosInstance from "@/Utils/AxiosInstance";

export const getAllMataKuliah = () => AxiosInstance.get("/mata_kuliah");
export const getMataKuliah = (id) => AxiosInstance.get(`/mata_kuliah/${id}`);
export const storeMataKuliah = (data) => AxiosInstance.post("/mata_kuliah", data);
export const updateMataKuliah = (id, data) => AxiosInstance.put(`/mata_kuliah/${id}`, data);
export const deleteMataKuliah = (id) => AxiosInstance.delete(`/mata_kuliah/${id}`);