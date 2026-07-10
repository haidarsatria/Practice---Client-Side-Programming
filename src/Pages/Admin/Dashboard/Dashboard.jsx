import React from "react";
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { useChartData } from "@/Utils/Hooks/useChart";

const COLORS = ["#3b82f6", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6"];

const Dashboard = () => {
  const { data = {}, isLoading } = useChartData();

  const {
    students = [],
    genderRatio = [],
    registrations = [],
    gradeDistribution = [],
    lecturerRanks = [],
  } = data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500 font-medium animate-pulse">Memuat data visualisasi grafik...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Akademik</h1>

      { }
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        { }
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Jumlah Mahasiswa per Fakultas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={students}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="faculty" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Mahasiswa" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        { }
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Rasio Gender Mahasiswa</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={genderRatio} dataKey="count" nameKey="gender" cx="50%" cy="50%" outerRadius={90} label>
                {genderRatio.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        { }
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Tren Pendaftaran Mahasiswa Baru</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={registrations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} name="Total Pendaftar" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        { }
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Sebaran Nilai Mahasiswa per Jurusan</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={gradeDistribution}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar name="Nilai A" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
              <Radar name="Nilai B" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Radar name="Nilai C" dataKey="C" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        { }
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Distribusi Pangkat Akademik Dosen</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={lecturerRanks}>
              <defs>
                <linearGradient id="colorLecturer" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="rank" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorLecturer)" name="Jumlah Dosen" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;