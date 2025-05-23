import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./store";

// Layouts
import AdminLayout from "./layout/AdminLayout";
import {
  ApprovedFilesPage,
  Dashboard,
  FileDetail,
  JobDetail,
  Login,
  NewAchievementsPage,
  NotFound,
  RejectedFilesPage,
  TeacherList,
  TeacterDetail,
} from "./pages";
import { ProtectedRoute } from "./components";
import RegisterPage from "./pages/register";
import RegionTeachers from "./pages/region";
import SelectRegions from "./pages/selectRegions";

// Pages

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/select" element={<SelectRegions />} /> */}
          <Route path="/regions" element={<Dashboard />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="teachers" element={<TeacherList />} />
            <Route path="teachers/:id" element={<TeacterDetail />} />
            <Route
              path="teachers/:teacherId/jobs/:jobId"
              element={<JobDetail />}
            />
            <Route path="files/:fileId" element={<FileDetail />} />
            <Route path="/" element={<RegionTeachers />} />
            <Route path="/new-files" element={<NewAchievementsPage />} />
            <Route path="/approved" element={<ApprovedFilesPage />} />
            <Route path="/rejected" element={<RejectedFilesPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
