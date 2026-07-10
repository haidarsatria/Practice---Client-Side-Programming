import React, { useState, useEffect } from "react";
import Input from "@/Pages/Auth/Components/Input";
import Label from "@/Pages/Auth/Components/Label";
import Button from "@/Pages/Auth/Components/Button";

const MahasiswaModal = ({ isModalOpen, onClose, onSubmit, selectedMahasiswa }) => {
  const [form, setForm] = useState({ nim: "", nama: "", max_sks: 20 });

  useEffect(() => {
    if (selectedMahasiswa) {
      setForm({
        nim: selectedMahasiswa.nim,
        nama: selectedMahasiswa.nama || selectedMahasiswa.name || "",
        max_sks: selectedMahasiswa.max_sks ?? 20
      });
    } else {
      setForm({ nim: "", nama: "", max_sks: 20 });
    }
  }, [selectedMahasiswa, isModalOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nim || !form.nama || !form.max_sks) {
      alert("NIM, Nama, dan Max SKS tidak boleh kosong!");
      return;
    }
    onSubmit({ ...form, max_sks: Number(form.max_sks) });
    onClose();
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {selectedMahasiswa ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-xl font-bold">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <Label htmlFor="nim">NIM</Label>
            <Input
              type="text"
              name="nim"
              value={form.nim}
              onChange={handleChange}
              readOnly={!!selectedMahasiswa}
              placeholder="Masukkan NIM"
              required
            />
          </div>
          <div>
            <Label htmlFor="nama">Nama</Label>
            <Input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Masukkan Nama"
              required
            />
          </div>
          <div>
            <Label htmlFor="max_sks">Max SKS</Label>
            <Input
              type="number"
              name="max_sks"
              value={form.max_sks}
              onChange={handleChange}
              placeholder="Masukkan Batas SKS"
              min={1}
              max={24}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" className="bg-gray-400 hover:bg-gray-500 text-white" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MahasiswaModal;