"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchAllTeachers } from "../store/slices/teacherSlice";
import { fetchNewFiles } from "../store/slices/fileSlice";
import { FiUsers, FiFileText, FiCheck, FiX, FiClock } from "react-icons/fi";
import { MdAccountBalance } from "react-icons/md";
import { getAllFiles } from "../services/fileService";
import api from "../api/api";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loading: teachersLoading } = useSelector((state) => state.teachers);

  const navigate = useNavigate();

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

  const selectRegion = (region) => {
    localStorage.setItem("region", region);
    navigate("/");
  };

  return (
    <div className="space-y-6 p-4">
      {/* <h1 className="text-2xl font-bold">Boshqaruv paneli</h1> */}

      <h1 className="text-2xl font-bold">Hududlarda tinglovchilar </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {regionTeachers?.map((item) => (
          <div
            className={`${
              item.region == "Nukus" ? "bg-green-50" : "bg-white"
            } rounded-lg shadow p-6 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-50 text-blue-500">
                <MdAccountBalance
                  className={`h-6 w-6 ${
                    item.region == "Nukus" ? "text-green-500" : "text-gray-600"
                  }`}
                />
              </div>
              <div className="ml-4">
                <h2
                  className={` ${
                    item.region == "Nukus" ? "text-green-500" : "text-gray-600"
                  }`}
                >
                  {item.region}
                </h2>

                <p
                  className={`text-2xl  font-semibold ${
                    item.region == "Nukus" ? "text-green-500" : "text-gray-600"
                  }`}
                >
                  {teachersLoading ? (
                    <span className={`text-sm `}>Yuklanmoqda...</span>
                  ) : (
                    item.teachers?.length || 0
                  )}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => selectRegion(item.region)}
                className={` ${
                  item.region == "Nukus"
                    ? "text-green-500"
                    : "text-blue-600 hover:text-blue-700"
                }  text-sm font-medium`}
              >
                Barchasini ko'rish →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
