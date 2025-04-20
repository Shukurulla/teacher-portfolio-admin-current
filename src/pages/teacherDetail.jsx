"use client";

import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTeacherById,
  fetchTeacherJobs,
  clearCurrentTeacher,
} from "../store/slices/teacherSlice";
import {
  FiBriefcase,
  FiAward,
  FiUser,
  FiCalendar,
  FiPhone,
} from "react-icons/fi";
import { MdAccountBalance } from "react-icons/md";

const TeacherDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTeacher, teacherJobs, loading, error } = useSelector(
    (state) => state.teachers
  );

  console.log(currentTeacher);

  useEffect(() => {
    dispatch(fetchTeacherById(id));
    dispatch(fetchTeacherJobs(id));

    return () => {
      dispatch(clearCurrentTeacher());
    };
  }, [dispatch, id]);

  if (loading && !currentTeacher) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Xatolik!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!currentTeacher) {
    return (
      <div
        className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Diqqat!</strong>
        <span className="block sm:inline"> O'qituvchi topilmadi.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"></div>

      {/* Teacher Profile Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 flex justify-center mb-4 md:mb-0">
              <img
                src={
                  currentTeacher.profileImage ||
                  "https://as2.ftcdn.net/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
                }
                alt={`${currentTeacher.firstName} ${currentTeacher.lastName}`}
                className="h-40 w-40 rounded-full object-cover"
              />
            </div>
            <div className="md:w-3/4 md:pl-6">
              <h2 className="text-xl font-semibold">
                <FiUser className="inline mr-2 text-blue-500" />
                {currentTeacher.firstName} {currentTeacher.lastName}
              </h2>
              <p className="text-gray-600 mt-2">
                <FiPhone className="inline mr-2 text-blue-500" />
                <span className="font-medium">Telefon:</span>{" "}
                {currentTeacher.phone}
              </p>
              <p className="text-gray-600 mt-2">
                <FiCalendar className="inline mr-2 text-blue-500" />
                <span className="font-medium">
                  Ro'yxatdan o'tgan sana:
                </span>{" "}
                {new Date(currentTeacher.createdAt).toLocaleDateString("uz-UZ")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-lg flex items-center">
            <FiBriefcase className="mr-2 text-blue-500" />
            Ish joylari
          </h2>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Ish joylari yuklanmoqda...</p>
          </div>
        ) : teacherJobs?.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Ish joylari mavjud emas
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-6">
            {teacherJobs?.map((job) => (
              <Link
                key={job._id}
                to={`/teachers/${id}/jobs/${job._id}`}
                className="block bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold  text-lg mb-2 flex items-center">
                        <FiBriefcase className="mr-2 w-[10%] text-lg text-blue-500" />
                        <span className="w-[90%] text-md">{job.title}</span>
                      </h3>
                      <p className="flex items-center text-gray-600">
                        <MdAccountBalance />
                        {job.workplace}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiCalendar className="mr-1" />
                      {new Date(job.createdAt).toLocaleDateString("uz-UZ")}
                    </div>

                    {/* <div className="flex space-x-4">
                      <div className="flex items-center text-sm bg-blue-50 px-2 py-1 rounded">
                        <FiAward className="mr-1 text-blue-500" />
                        <span className="font-medium">
                          {job.achievementsCount || 0}
                        </span>
                      </div>
                      <div className="flex items-center text-sm bg-green-50 px-2 py-1 rounded">
                        <span className="font-medium text-green-600">
                          {job.totalScore || 0} ball
                        </span>
                      </div>
                    </div> */}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDetail;
