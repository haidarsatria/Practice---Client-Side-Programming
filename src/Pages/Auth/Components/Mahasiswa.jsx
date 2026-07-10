import React, { useState } from "react"; 
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import Modal from "@/Pages/Auth/Components/Modal"; 
import Label from "@/Pages/Auth/Components/Label";
import Input from "@/Pages/Auth/Components/Input";
import Form from "@/Pages/Auth/Components/Form";

const Mahasiswa = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (nama) => alert(`Edit data ${nama}`);
  const handleDelete = (nama) => {
    if (confirm(`Yakin ingin hapus ${nama}?`)) alert("Data berhasil dihapus!");
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("Data Mahasiswa Berhasil Disimpan!");
    setIsModalOpen(false);
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left text-blue-600">
            Daftar Mahasiswa
          </Heading>
          <Button onClick={() => setIsModalOpen(true)}>
            + Tambah Mahasiswa
          </Button>
        </div>

        <table className="w-full text-sm text-gray-700">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">NIM</th>
              <th className="py-2 px-4 text-left">Nama</th>
              <th className="py-2 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr className="odd:bg-white even:bg-gray-100">
              <td className="py-2 px-4">20211001</td>
              <td className="py-2 px-4">Budi Santoso</td>
              <td className="py-2 px-4 text-center space-x-2">
                <Button
                  size="sm"
                  className="bg-yellow-500 hover:bg-yellow-600"
                  onClick={() => handleEdit("Budi Santoso")}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => handleDelete("Budi Santoso")}
                >
                  Hapus
                </Button>
              </td>
            </tr>
            <tr className="odd:bg-white even:bg-gray-100">
              <td className="py-2 px-4">20211002</td>
              <td className="py-2 px-4">Siti Aminah</td>
              <td className="py-2 px-4 text-center space-x-2">
                <Button
                  size="sm"
                  className="bg-yellow-500 hover:bg-yellow-600"
                  onClick={() => handleEdit("Siti Aminah")}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => handleDelete("Siti Aminah")}
                >
                  Hapus
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Tambah Mahasiswa Baru"
      >
        <Form onSubmit={handleSave}>
          <div>
            <Label htmlFor="nim">NIM</Label>
            <Input type="text" name="nim" placeholder="Masukkan NIM" required />
          </div>
          <div>
            <Label htmlFor="nama">Nama Lengkap</Label>
            <Input type="text" name="nama" placeholder="Masukkan Nama Lengkap" required />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit">
              Simpan Data
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default Mahasiswa;