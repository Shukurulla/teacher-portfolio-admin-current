"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiAward, FiClock, FiUser, FiCheck, FiX } from "react-icons/fi";
import { getAllFiles } from "../services/fileService";
// Adjust import path as needed

const RejectedFilesPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(achievements);

  useEffect(() => {
    const fetchRejectedFiles = async () => {
      try {
        setLoading(true);
        const allFiles = await getAllFiles();
        // Filter only rejected files
        const rejectedFiles = allFiles.filter(
          (file) => file.status === "Tasdiqlanmadi"
        );
        setAchievements(rejectedFiles);
      } catch (error) {
        console.error("Fayllarni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRejectedFiles();
  }, []);

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor, textColor, icon;

    switch (status) {
      case "Tasdiqlandi":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        icon = <FiCheck className="mr-1" />;
        break;
      case "Tasdiqlanmadi":
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        icon = <FiX className="mr-1" />;
        break;
      default: // Tekshirilmoqda
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        icon = <FiClock className="mr-1" />;
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        {icon}
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Rad etilgan yutuqlar yuklanmoqda...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Rad etilgan yutuqlar
          </h1>
          <p className="text-gray-600 mt-2">Rad etilgan yutuqlar ro'yxati</p>
        </div>

        {achievements.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <FiAward className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Rad etilgan yutuqlar mavjud emas
            </h3>
            <p className="text-gray-500">
              Hozircha rad etilgan yutuqlar topilmadi
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-50 px-6 py-3 border-b">
              <div className="col-span-4 font-medium text-sm text-gray-500 uppercase tracking-wider">
                O'qituvchi
              </div>
              <div className="col-span-4 font-medium text-sm text-gray-500 uppercase tracking-wider">
                Yutuq
              </div>
              <div className="col-span-2 font-medium text-sm text-gray-500 uppercase tracking-wider">
                Sana
              </div>
              <div className="col-span-2 font-medium text-sm text-gray-500 uppercase tracking-wider">
                Holat
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {achievements.map((achievement) => (
                <Link
                  key={achievement._id}
                  to={`/files/${achievement._id}`}
                  className="block hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-12 px-6 py-4 items-center">
                    <div className="col-span-4 flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-3">
                        <FiUser />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {achievement.from.firstName}{" "}
                          {achievement.from.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {achievement.from.job.workplace}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-4">
                      <p className="font-medium text-gray-900">
                        {achievement.achievments.title}
                      </p>
                    </div>

                    <div className="col-span-2 text-sm text-gray-500">
                      {new Date(achievement.createdAt).toLocaleDateString(
                        "uz-UZ"
                      )}
                    </div>

                    <div className="col-span-2">
                      <StatusBadge status={achievement.status} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RejectedFilesPage;
