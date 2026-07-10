import React, { useState, useEffect } from "react";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import TableRencanaStudi from "./TableRencanaStudi";
import ModalRencanaStudi from "./ModalRencanaStudi";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { getAllKelas, storeKelas, updateKelas, deleteKelas } from "@/Utils/Apis/KelasApi";
import { getAllDosen } from "@/Utils/Apis/DosenApi";
import { getAllMataKuliah } from "@/Utils/Apis/MataKuliahApi";
import { getAllMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { confirmDelete } from "@/Utils/Helpers/SwalHelpers";

const RencanaStudi = () => {
    const { user } = useAuthStateContext();
    const [kelas, setKelas] = useState([]);
    const [dosen, setDosen] = useState([]);
    const [mahasiswa, setMahasiswa] = useState([]);
    const [mataKuliah, setMataKuliah] = useState([]);

    const [selectedMhs, setSelectedMhs] = useState({});
    const [selectedDsn, setSelectedDsn] = useState({});

    const [form, setForm] = useState({ mata_kuliah_id: "", dosen_id: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [resKelas, resDosen, resMahasiswa, resMataKuliah] = await Promise.all([
                getAllKelas(),
                getAllDosen(),
                getAllMahasiswa(),
                getAllMataKuliah(),
            ]);
            setKelas(resKelas.data || []);
            setDosen(resDosen.data || []);
            setMahasiswa(resMahasiswa.data?.data || resMahasiswa.data || []);
            setMataKuliah(resMataKuliah.data || []);
        } catch (err) {
            toastError("Gagal mengambil data rencana studi.");
        } finally {
            setIsLoading(false);
        }
    };

    const mataKuliahSudahDipakai = kelas.map((k) => k.mata_kuliah_id);
    const mataKuliahBelumAdaKelas = mataKuliah.filter((m) => !mataKuliahSudahDipakai.includes(m.id));

    const getMaxSks = (id) => mahasiswa.find((m) => String(m.id) === String(id))?.max_sks || 0;
    const getDosenMaxSks = (id) => dosen.find((d) => String(d.id) === String(id))?.max_sks || 0;

    const handleAddMahasiswa = async (kelasItem, mhsId) => {
        if (!mhsId) {
            toastError("Pilih mahasiswa terlebih dahulu!");
            return;
        }

        const matkul = mataKuliah.find((m) => m.id === kelasItem.mata_kuliah_id);
        const sks = matkul?.sks || 0;

        const totalSksMahasiswa = kelas
            .filter((k) => k.mahasiswa_ids?.includes(String(mhsId)))
            .map((k) => mataKuliah.find((m) => m.id === k.mata_kuliah_id)?.sks || 0)
            .reduce((acc, curr) => acc + curr, 0);

        const maxSks = getMaxSks(mhsId);

        if (totalSksMahasiswa + sks > maxSks) {
            toastError(`SKS melebihi batas maksimal mahasiswa (${maxSks})`);
            return;
        }

        if (kelasItem.mahasiswa_ids?.includes(String(mhsId))) {
            toastError("Mahasiswa sudah terdaftar di kelas ini.");
            return;
        }

        const updated = {
            ...kelasItem,
            mahasiswa_ids: [...(kelasItem.mahasiswa_ids || []), String(mhsId)]
        };

        await updateKelas(kelasItem.id, updated);
        toastSuccess("Mahasiswa berhasil ditambahkan!");
        setSelectedMhs((prev) => ({ ...prev, [kelasItem.id]: "" }));
        fetchData();
    };

    const handleDeleteMahasiswa = async (kelasItem, mhsId) => {
        const updated = {
            ...kelasItem,
            mahasiswa_ids: (kelasItem.mahasiswa_ids || []).filter((id) => String(id) !== String(mhsId))
        };

        await updateKelas(kelasItem.id, updated);
        toastSuccess("Mahasiswa dihapus dari kelas");
        fetchData();
    };

    const handleChangeDosen = async (kelasItem) => {
        const dsnId = selectedDsn[kelasItem.id];
        if (!dsnId) return;

        const totalSksDosen = kelas
            .filter((k) => String(k.dosen_id) === String(dsnId))
            .map((k) => mataKuliah.find((m) => m.id === k.mata_kuliah_id)?.sks || 0)
            .reduce((acc, curr) => acc + curr, 0);

        const kelasSks = mataKuliah.find((m) => m.id === kelasItem.mata_kuliah_id)?.sks || 0;
        const maxSks = getDosenMaxSks(dsnId);

        if (totalSksDosen + kelasSks > maxSks) {
            toastError(`Dosen melebihi batas maksimal pengampuan SKS (${maxSks})`);
            return;
        }

        await updateKelas(kelasItem.id, { ...kelasItem, dosen_id: String(dsnId) });
        toastSuccess("Dosen pengampu berhasil diperbarui!");
        fetchData();
    };

    const handleDeleteKelas = async (kelasId) => {
        confirmDelete(async () => {
            await deleteKelas(kelasId);
            toastSuccess("Kelas berhasil dihapus");
            fetchData();
        });
    };

    const openAddModal = () => {
        setForm({ mata_kuliah_id: "", dosen_id: "" });
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.mata_kuliah_id || !form.dosen_id) {
            toastError("Form tidak lengkap");
            return;
        }
        await storeKelas({ ...form, mahasiswa_ids: [] });
        setIsModalOpen(false);
        toastSuccess("Kelas baru berhasil dibuka!");
        fetchData();
    };

    if (isLoading) return <div className="p-6 text-center text-gray-500">Memuat info Rencana Studi...</div>;

    return (
        <Card>
            <div className="flex justify-between items-center mb-6">
                <Heading as="h2" className="mb-0">Rencana Studi (KRS)</Heading>
                {user?.permission?.includes("rencana-studi.create") && (
                    <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white">
                        + Tambah Kelas
                    </Button>
                )}
            </div>

            <TableRencanaStudi
                kelas={kelas}
                mahasiswa={mahasiswa}
                dosen={dosen}
                mataKuliah={mataKuliah}
                selectedMhs={selectedMhs}
                setSelectedMhs={setSelectedMhs}
                selectedDsn={selectedDsn}
                setSelectedDsn={setSelectedDsn}
                handleAddMahasiswa={handleAddMahasiswa}
                handleDeleteMahasiswa={handleDeleteMahasiswa}
                handleChangeDosen={handleChangeDosen}
                handleDeleteKelas={handleDeleteKelas}
            />

            <ModalRencanaStudi
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onChange={handleChange}
                onSubmit={handleSubmit}
                form={form}
                dosen={dosen}
                mataKuliah={mataKuliahBelumAdaKelas}
            />
        </Card>
    );
};

export default RencanaStudi;