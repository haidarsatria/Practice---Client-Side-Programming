import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/Pages/Auth/Components/Button";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const MahasiswaTable = ({ mahasiswa, openEditModal, onDelete, getTotalSks }) => {
  const navigate = useNavigate();
  const { user } = useAuthStateContext();

  const dataAman = Array.isArray(mahasiswa)
    ? mahasiswa
    : (mahasiswa?.data && Array.isArray(mahasiswa.data) ? mahasiswa.data : []);

  return (
    <table className="w-full text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="py-2 px-4 text-left">NIM</th>
          <th className="py-2 px-4 text-left">Nama</th>
          <th className="py-2 px-4 text-center">Max SKS</th>
          <th className="py-2 px-4 text-center">SKS Terpakai</th>
          <th className="py-2 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {dataAman.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center py-4">Data kosong / sedang memuat...</td>
          </tr>
        ) : (
          dataAman.map((mhs, index) => {
            const totalSks = getTotalSks ? getTotalSks(mhs.id) : 0;
            return (
              <tr key={mhs.id || mhs.nim} className="odd:bg-white even:bg-gray-100 border-b">
                <td className="py-2 px-4">{mhs.nim}</td>
                <td className="py-2 px-4">{mhs.nama || mhs.name}</td>
                <td className="py-2 px-4 text-center">{mhs.max_sks ?? "-"}</td>
                <td className="py-2 px-4 text-center">
                  <span className={`font-semibold ${totalSks > (mhs.max_sks || 0) ? "text-red-600" : "text-green-600"}`}>
                    {totalSks}
                  </span>
                </td>
                <td className="py-2 px-4 text-center space-x-2">
                  <Button
                    size="sm"
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    onClick={() => navigate(`/admin/mahasiswa/${mhs.id}`)}
                  >
                    Detail
                  </Button>
                  {user?.permission?.includes("mahasiswa.update") && (
                    <Button
                      size="sm"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      onClick={() => openEditModal(mhs)}
                    >
                      Edit
                    </Button>
                  )}
                  {user?.permission?.includes("mahasiswa.delete") && (
                    <Button
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => onDelete(mhs.id)}
                    >
                      Hapus
                    </Button>
                  )}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};

export default MahasiswaTable;