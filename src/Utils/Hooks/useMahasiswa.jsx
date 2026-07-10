import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
    getAllMahasiswa,
    storeMahasiswa,
    updateMahasiswa,
    deleteMahasiswa,
} from "@/Utils/Apis/MahasiswaApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

export const useMahasiswa = (query = {}) =>
    useQuery({
        queryKey: ["mahasiswa", query],
        queryFn: () => getAllMahasiswa(query),
        select: (res) => res?.data ?? { data: [], items: 0, pages: 1 },
        placeholderData: keepPreviousData,
    });
export const useStoreMahasiswa = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: storeMahasiswa,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
            toastSuccess("Mahasiswa berhasil ditambahkan!");
        },
        onError: () => toastError("Gagal menambahkan mahasiswa."),
    });
};

export const useUpdateMahasiswa = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateMahasiswa(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
            toastSuccess("Mahasiswa berhasil diperbarui!");
        },
        onError: () => toastError("Gagal memperbarui mahasiswa."),
    });
};

export const useDeleteMahasiswa = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteMahasiswa,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
            toastSuccess("Mahasiswa berhasil dihapus!");
        },
        onError: () => toastError("Gagal menghapus mahasiswa."),
    });
};