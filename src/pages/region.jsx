"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../api/api";
import { useParams } from "react-router-dom";
import { FiCheck, FiClock, FiUsers, FiX } from "react-icons/fi";
import { getAllFiles } from "../services/fileService";
import { fetchAllTeachers } from "../store/slices/teacherSlice";
import { fetchNewFiles } from "../store/slices/fileSlice";
const RegionTeachers = () => {
  const dispatch = useDispatch();
  const { regionName } = useParams();
  const {
    teachers,
    loading: teachersLoading,
    error,
  } = useSelector((state) => state.teachers);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    files,
    newFiles,
    loading: filesLoading,
  } = useSelector((state) => state.files);

  const [regionTeachers, setRegionTeachers] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const getProvinces = async () => {
      const { data } = await api.get("/teacher/sorted-regions");

      setRegionTeachers(data);
    };
    getProvinces();
    const fetchApprovedFiles = async () => {
      try {
        const allFiles = await getAllFiles();
        // Filter only approved files

        setAchievements(allFiles);
      } catch (error) {
        console.error("Fayllarni yuklashda xatolik:", error);
      }
    };

    fetchApprovedFiles();
  }, []);

  useEffect(() => {
    dispatch(fetchAllTeachers());
    dispatch(fetchNewFiles());
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("region", regionName);
  }, [regionName]);
  const filteredTeachers = regionTeachers?.filter(
    (teacher) => teacher.region == regionName
  )[0]?.teachers;

  const pendingFiles =
    newFiles?.filter((file) => file.status === "Tekshirilmoqda") || [];
  const approvedFiles =
    achievements?.filter((file) => file.status === "Tasdiqlandi") || [];
  const rejectedFiles =
    achievements?.filter((file) => file.status === "Tasdiqlanmadi") || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">O'qituvchilar ro'yxati</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500">
              <FiUsers className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600">Tinglovchilar</h2>
              <p className="text-2xl font-semibold">
                {teachersLoading ? (
                  <span className="text-sm text-gray-500">Yuklanmoqda...</span>
                ) : (
                  teachers.filter(
                    (c) => c.region.region == localStorage.getItem("region")
                  )?.length || 0
                )}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/teachers"
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              Barchasini ko'rish →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
              <FiClock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600">Jarayonda</h2>
              <p className="text-2xl font-semibold">
                {filesLoading ? (
                  <span className="text-sm text-gray-500">Yuklanmoqda...</span>
                ) : (
                  pendingFiles.length
                )}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/new-files"
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              Barchasini ko'rish →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500">
              <FiCheck className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600">Tasdiqlanganlar</h2>
              <p className="text-2xl font-semibold">
                {filesLoading ? (
                  <span className="text-sm text-gray-500">Yuklanmoqda...</span>
                ) : (
                  approvedFiles.length
                )}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/approved"
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              Barchasini ko'rish →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-500">
              <FiX className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600">Rad etilganlar</h2>
              <p className="text-2xl font-semibold">
                {filesLoading ? (
                  <span className="text-sm text-gray-500">Yuklanmoqda...</span>
                ) : (
                  rejectedFiles.length
                )}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/rejected"
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              Barchasini ko'rish →
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="O'qituvchi qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div> */}

        {teachersLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">O'qituvchilar yuklanmoqda...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : filteredTeachers?.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            O'qituvchilar topilmadi
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    O'qituvchi
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Telefon
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Hudud
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Viloyat
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ish joylari
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Yutuqlar
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeachers?.map((teacher) => (
                  <tr key={teacher._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={
                              teacher.profileImage ||
                              "https://as2.ftcdn.net/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
                            }
                            alt={`${teacher.firstName} ${teacher.lastName}`}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {teacher.firstName} {teacher.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {teacher.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {teacher.region.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {teacher.region.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {teachers.find((c) => c._id == teacher._id)?.jobs
                        ?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {teachers.find((c) => c._id == teacher._id)
                        ?.achievementsCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {teacher.region.region == "Nukus" ? (
                        <Link
                          to={`/teachers/${teacher._id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Ko'rish
                        </Link>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionTeachers;
