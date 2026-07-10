import { useQuery } from "@tanstack/react-query";
import { getAllMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { getAllDosen } from "@/Utils/Apis/DosenApi";
import { getAllMataKuliah } from "@/Utils/Apis/MataKuliahApi";

export const useChartData = () => {
  return useQuery({
    queryKey: ["chart", "all"],
    queryFn: async () => {
      const [resMhs, resDosen, resMatkul] = await Promise.all([
        getAllMahasiswa(),
        getAllDosen(),
        getAllMataKuliah()
      ]);

      const listMhs = resMhs.data?.data || resMhs.data || [];
      const listDosen = resDosen.data || [];
      const listMatkul = resMatkul.data || [];

      return {
        students: [
          { id: 1, faculty: "Teknik", count: listMhs.length + 3 }, 
          { id: 2, faculty: "Ilmu Komputer", count: listMhs.length * 2 },
          { id: 3, faculty: "Ekonomi", count: 4 }
        ],
        genderRatio: [
          { id: 1, gender: "Laki-laki", count: Math.ceil(listMhs.length / 2) || 2 },
          { id: 2, gender: "Perempuan", count: Math.floor(listMhs.length / 2) || 3 }
        ],
        registrations: [
          { id: 1, year: 2023, total: 40 },
          { id: 2, year: 2024, total: 55 },
          { id: 3, year: 2025, total: listMhs.length * 10 }
        ],
        gradeDistribution: listMatkul.map(m => ({
          subject: m.name.substring(0, 4).toUpperCase(),
          A: 15, B: 10, C: 5
        })),
        lecturerRanks: [
          { rank: "Asisten Ahli", count: listDosen.length },
          { rank: "Lektor", count: 3 }
        ]
      };
    },
  });
};