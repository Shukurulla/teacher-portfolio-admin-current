"use client";

import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProfile } from "../store/slices/authSlice";
import { Header, Sidebar } from "../components";

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin, loading } = useSelector((state) => state.auth);
  const pathname = window.location.pathname;

  useEffect(() => {
    // Admin profilini olish
    dispatch(fetchAdminProfile());
  }, [dispatch]);

  if (loading && !admin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          {pathname !== "/" ? (
            <div className="mb-3">
              <div className="flex items-center">
                <button
                  onClick={() => navigate(-1)}
                  className="mr-4 text-blue-500 hover:text-blue-700"
                >
                  ← Orqaga
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
