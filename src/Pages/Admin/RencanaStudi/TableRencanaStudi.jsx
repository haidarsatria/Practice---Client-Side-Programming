import React from "react";
import Button from "@/Pages/Auth/Components/Button";
import Select from "@/Pages/Auth/Components/Select";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

export default function TableRencanaStudi({
    kelas,
    mahasiswa,
    dosen,
    mataKuliah,
    selectedMhs,
    setSelectedMhs,
    selectedDsn,
    setSelectedDsn,
    handleAddMahasiswa,
    handleDeleteMahasiswa,
    handleChangeDosen,
    handleDeleteKelas
}) {
    const { user } = useAuthStateContext();

    return (
        <div className="space-y-6 text-left">
            {kelas.length === 0 ? (
                <p className="text-center italic text-gray-500 py-6">Belum ada kelas yang dibuka.</p>
            ) : (
                kelas.map((kls) => {
                    const matkul = mataKuliah.find((m) => String(m.id) === String(kls.mata_kuliah_id));
                    const dosenPengampu = dosen.find((d) => String(d.id) === String(kls.dosen_id));
                    const mhsInClass = (kls.mahasiswa_ids || [])
                        .map((id) => mahasiswa.find((m) => String(m.id) === String(id)))
                        .filter(Boolean);

                    return (
                        <div key={kls.id} className="border rounded-lg shadow-sm bg-white overflow-hidden border-gray-200">
                            <div className="flex flex-wrap justify-between items-center px-4 py-3 border-b bg-gray-50 gap-2">
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">{matkul?.name || "Mata Kuliah Tidak Diketahui"} ({matkul?.sks || 0} SKS)</h3>
                                    <p className="text-xs text-gray-600">Dosen Pengampu: <span className="font-semibold text-blue-600">{dosenPengampu?.name || "-"}</span></p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {user?.permission?.includes("rencana-studi.update") && (
                                        <>
                                            <Select
                                                value={selectedDsn[kls.id] || ""}
                                                onChange={(e) => setSelectedDsn({ ...selectedDsn, [kls.id]: e.target.value })}
                                                size="sm"
                                                className="w-40 bg-white"
                                            >
                                                <option value="">-- Ganti Dosen --</option>
                                                {dosen.map((d) => (
                                                    <option key={d.id} value={d.id}>{d.name}</option>
                                                ))}
                                            </Select>
                                            <Button size="sm" onClick={() => handleChangeDosen(kls)}>Simpan</Button>
                                        </>
                                    )}
                                    {mhsInClass.length === 0 && user?.permission?.includes("rencana-studi.delete") && (
                                        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDeleteKelas(kls.id)}>
                                            Hapus Kelas
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 border-b text-gray-700">
                                    <tr>
                                        <th className="py-2 px-4 w-12 text-left">No</th>
                                        <th className="py-2 px-4 text-left">Nama</th>
                                        <th className="py-2 px-4 text-left">NIM</th>
                                        <th className="py-2 px-4 text-center">Total SKS Terambil</th>
                                        <th className="py-2 px-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mhsInClass.length > 0 ? (
                                        mhsInClass.map((m, i) => {
                                            const totalSks = kelas
                                                .filter((k) => k.mahasiswa_ids?.includes(String(m.id)))
                                                .map((k) => mataKuliah.find((mk) => mk.id === k.mata_kuliah_id)?.sks || 0)
                                                .reduce((a, b) => a + b, 0);

                                            return (
                                                <tr key={m.id} className="border-b hover:bg-gray-50">
                                                    <td className="py-2 px-4">{i + 1}</td>
                                                    <td className="py-2 px-4 font-medium text-gray-900">{m.nama || m.name}</td>
                                                    <td className="py-2 px-4 text-gray-600">{m.nim}</td>
                                                    <td className="py-2 px-4 text-center font-semibold text-gray-700">{totalSks} / {m.max_sks}</td>
                                                    <td className="py-2 px-4 text-center">
                                                        {user?.permission?.includes("rencana-studi.delete") && (
                                                            <button
                                                                onClick={() => handleDeleteMahasiswa(kls, m.id)}
                                                                className="text-xs text-red-600 hover:text-red-800 font-medium"
                                                            >
                                                                Keluarkan
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-4 px-4 text-center italic text-gray-400 bg-white">
                                                Belum ada mahasiswa yang mengambil kelas ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {user?.permission?.includes("rencana-studi.update") && (
                                <div className="flex items-center gap-2 px-4 py-2 border-t bg-gray-50">
                                    <Select
                                        value={selectedMhs[kls.id] || ""}
                                        onChange={(e) => setSelectedMhs({ ...selectedMhs, [kls.id]: e.target.value })}
                                        size="sm"
                                        className="w-52 bg-white"
                                    >
                                        <option value="">-- Daftarkan Mahasiswa --</option>
                                        {mahasiswa.map((m) => (
                                            <option key={m.id} value={m.id}>{m.nama || m.name} ({m.nim})</option>
                                        ))}
                                    </Select>
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleAddMahasiswa(kls, selectedMhs[kls.id])}
                                    >
                                        Tambah
                                    </Button>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}