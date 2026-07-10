import React from "react";
import Button from "@/Pages/Auth/Components/Button";
import Label from "@/Pages/Auth/Components/Label";

const ModalRencanaStudi = ({
    isOpen,
    onClose,
    onSubmit,
    onChange,
    form,
    dosen,
    mataKuliah
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)] z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">Buka Kelas Rencana Studi Baru</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-xl font-bold">
                        &times;
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-4 space-y-4 text-left">
                    <div>
                        <Label htmlFor="mata_kuliah_id">Mata Kuliah</Label>
                        <select
                            name="mata_kuliah_id"
                            value={form.mata_kuliah_id}
                            onChange={onChange}
                            className="w-full border p-2 mt-1 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">-- Pilih Mata Kuliah --</option>
                            {mataKuliah.map((m) => (
                                <option key={m.id} value={m.id}>{m.name} ({m.sks} SKS)</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor="dosen_id">Dosen Pengampu</Label>
                        <select
                            name="dosen_id"
                            value={form.dosen_id}
                            onChange={onChange}
                            className="w-full border p-2 mt-1 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">-- Pilih Dosen Pengampu --</option>
                            {dosen.map((d) => (
                                <option key={d.id} value={d.id}>{d.name} (Max: {d.max_sks} SKS)</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2 border-t mt-4">
                        <Button type="button" className="bg-gray-400 hover:bg-gray-500 text-white" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Buka Kelas
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalRencanaStudi;