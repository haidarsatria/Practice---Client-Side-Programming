import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import { getMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

const MahasiswaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mahasiswa, setMahasiswa] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMahasiswa = async () => {
    try {
      const res = await getMahasiswa(id);
      setMahasiswa(res.data);
    } catch (err) {
      toastError("Gagal mengambil data mahasiswa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMahasiswa();
  }, [id]);

  if (loading) return <p className="text-center py-4">Memuat data...</p>;

  return (
    <Card>
      <Heading as="h2" className="text-left mb-6">Detail Mahasiswa</Heading>

      {mahasiswa ? (
        <div className="space-y-4 mb-6 text-gray-700">
          <p className="text-lg"><span className="font-semibold w-24 inline-block">NIM</span>: {mahasiswa.nim}</p>
          <p className="text-lg"><span className="font-semibold w-24 inline-block">Nama</span>: {mahasiswa.nama}</p>
        </div>
      ) : (
        <p className="text-red-500 mb-6 font-semibold">Data mahasiswa tidak ditemukan!</p>
      )}

      <Button
        className="bg-gray-500 hover:bg-gray-600 text-white"
        onClick={() => navigate(-1)}
      >
        Kembali
      </Button>
    </Card>
  );
};

export default MahasiswaDetail;