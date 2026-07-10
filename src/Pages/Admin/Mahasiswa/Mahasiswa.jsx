import React, { useState, useEffect } from "react";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import MahasiswaTable from "./MahasiswaTable";
import MahasiswaModal from "./MahasiswaModal";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { getAllKelas } from "@/Utils/Apis/KelasApi";
import { getAllMataKuliah } from "@/Utils/Apis/MataKuliahApi";

import {
  useMahasiswa,
  useStoreMahasiswa,
  useUpdateMahasiswa,
  useDeleteMahasiswa,
} from "@/Utils/Hooks/useMahasiswa";

const Mahasiswa = () => {
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const { user } = useAuthStateContext();

  const [kelas, setKelas] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("nama");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const { data: result, isLoading } = useMahasiswa({
    nama: search.trim() !== "" ? `ilike.*${search.trim()}*` : undefined,
    order: `${sortBy === "name" ? "nama" : sortBy}.${sortOrder}`,
    offset: (page - 1) * limit,
    limit: limit,
  });

  const mahasiswa = Array.isArray(result) ? result : (result?.data ?? []);
  const totalCount = result?.items ?? mahasiswa.length;
  const totalPages = result?.pages ?? (Math.ceil(totalCount / limit) || 1);

  const { mutate: store } = useStoreMahasiswa();
  const { mutate: update } = useUpdateMahasiswa();
  const { mutate: remove } = useDeleteMahasiswa();

  useEffect(() => {
    const fetchSksDependencies = async () => {
      try {
        const [resKelas, resMatkul] = await Promise.all([
          getAllKelas(),
          getAllMataKuliah()
        ]);
        setKelas(resKelas.data || []);
        setMataKuliah(resMatkul.data || []);
      } catch (err) {
        console.error("Gagal memuat dependensi SKS", err);
      }
    };
    fetchSksDependencies();
  }, [result]);

  const getTotalSks = (mhsId) => {
    return kelas
      .filter((k) => k.mahasiswa_ids?.includes(String(mhsId)))
      .map((k) => mataKuliah.find((mk) => mk.id === k.mata_kuliah_id)?.sks || 0)
      .reduce((a, b) => a + b, 0);
  };

  const openAddModal = () => {
    setModalOpen(true);
    setSelectedMahasiswa(null);
  };

  const openEditModal = (mhs) => {
    setModalOpen(true);
    setSelectedMahasiswa(mhs);
  };

  const handleSubmit = async (formData) => {
    if (!formData.nim || !formData.nama || !formData.max_sks) {
      toastError("NIM, Nama, dan Max SKS wajib diisi!");
      return false;
    }

    if (selectedMahasiswa) {
      confirmUpdate(() => {
        update(
          { id: selectedMahasiswa.id, data: formData },
          { onSuccess: () => setModalOpen(false) }
        );
      });
    } else {
      const listMahasiswa = Array.isArray(mahasiswa) ? mahasiswa : [];
      const isDuplicate = listMahasiswa.find((m) => m.nim === formData.nim);
      if (isDuplicate) {
        toastError("NIM sudah terdaftar!");
        return false;
      }

      store(formData, {
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  const handleDelete = async (id) => {
    confirmDelete(() => {
      remove(id);
    });
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left">Daftar Mahasiswa</Heading>
        {user?.permission?.includes("mahasiswa.create") && (
          <Button onClick={openAddModal}>+ Tambah Mahasiswa</Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Cari nama/NIM..."
          className="border px-3 py-1 text-sm rounded flex-grow focus:outline-none focus:border-blue-500"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-1 text-sm rounded bg-white"
        >
          <option value="nama">Sort by Nama</option>
          <option value="nim">Sort by NIM</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-1 text-sm rounded bg-white"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="border px-3 py-1 text-sm rounded bg-white"
        >
          <option value={5}>5 / halaman</option>
          <option value={10}>10 / halaman</option>
          <option value={25}>25 / halaman</option>
        </select>
      </div>

      {isLoading ? (
        <p className="text-center py-10 text-gray-500">Memuat data dari server...</p>
      ) : (
        <>
          <MahasiswaTable
            mahasiswa={mahasiswa}
            openEditModal={openEditModal}
            onDelete={handleDelete}
            getTotalSks={getTotalSks}
          />

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Halaman {page} dari {totalPages} (Total: {totalCount} data)
            </p>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:hover:bg-gray-200 transition-colors"
                onClick={handlePrev}
                disabled={page === 1}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:hover:bg-gray-200 transition-colors"
                onClick={handleNext}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      <MahasiswaModal
        isModalOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        selectedMahasiswa={selectedMahasiswa}
      />
    </Card>
  );
};

export default Mahasiswa;