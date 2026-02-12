import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import PrivateRoute from "./components/common/PrivateRoute";
import PublicRoute from "./components/common/PublicRoute";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Landing
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";

// Dashboards
import SuperAdminDashboard from "./pages/dashboard/SuperAdminDashboard";
import PrincipalDashboard from "./pages/dashboard/PrincipalDashboard";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
import StudentDashboard from "./pages/dashboard/StudentDashboard";

// Schools (Super Admin)
import SchoolList from "./pages/schools/SchoolList";
import SchoolCreate from "./pages/schools/SchoolCreate";
import SchoolDetails from "./pages/schools/SchoolDetails";
import SchoolEdit from "./pages/schools/SchoolEdit";

// Students
import StudentList from "./pages/students/StudentList";
import StudentCreate from "./pages/students/StudentCreate";
import StudentDetails from "./pages/students/StudentDetails";
import StudentEdit from "./pages/students/StudentEdit";
import StudentResults from "./pages/students/StudentResults";
import StudentTimetable from "./pages/students/StudentTimetable";
import StudentPerformance from "./pages/students/StudentPerformance";
import MyPerformance from "./pages/students/MyPerformance";

// Teachers
import TeacherList from "./pages/teachers/TeacherList";
import TeacherCreate from "./pages/teachers/TeacherCreate";
import TeacherEdit from "./pages/teachers/TeacherEdit";
import TeacherSchedule from "./pages/teachers/TeacherSchedule";

// Classes
import ClassManagement from "./pages/classes/ClassManagement";

// Attendance
import AttendanceManagement from "./pages/attendance/AttendanceManagement";

// Exams
import ExamManagement from "./pages/exams/ExamManagement";

// Events
import EventManagement from "./pages/events/EventManagement";

// Notices
import NoticeBoard from "./pages/notices/NoticeBoard";

// Reports
import ReportsPage from "./pages/reports/ReportsPage";

// Profile
import ProfilePage from "./pages/profile/ProfilePage";

// Settings
import Settings from "./pages/settings/Settings";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* ==================== PUBLIC ROUTES ==================== */}
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* ==================== DASHBOARD ROUTES ==================== */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <RoleBasedDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/super-admin"
              element={
                <PrivateRoute allowedRoles={["SUPER_ADMIN"]}>
                  <SuperAdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/principal"
              element={
                <PrivateRoute allowedRoles={["PRINCIPAL"]}>
                  <PrincipalDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/teacher"
              element={
                <PrivateRoute allowedRoles={["TEACHER"]}>
                  <TeacherDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/student"
              element={
                <PrivateRoute allowedRoles={["STUDENT"]}>
                  <StudentDashboard />
                </PrivateRoute>
              }
            />

            {/* ==================== SCHOOL MANAGEMENT ==================== */}
            <Route
              path="/schools"
              element={
                <PrivateRoute allowedRoles={["SUPER_ADMIN"]}>
                  <SchoolList />
                </PrivateRoute>
              }
            />
            <Route
              path="/schools/create"
              element={
                <PrivateRoute allowedRoles={["SUPER_ADMIN"]}>
                  <SchoolCreate />
                </PrivateRoute>
              }
            />
            <Route
              path="/schools/:id"
              element={
                <PrivateRoute allowedRoles={["SUPER_ADMIN"]}>
                  <SchoolDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/schools/:id/edit"
              element={
                <PrivateRoute allowedRoles={["SUPER_ADMIN"]}>
                  <SchoolEdit />
                </PrivateRoute>
              }
            />

            {/* ==================== STUDENT MANAGEMENT ==================== */}
            <Route
              path="/students"
              element={
                <PrivateRoute
                  allowedRoles={["SUPER_ADMIN", "PRINCIPAL", "TEACHER"]}
                >
                  <StudentList />
                </PrivateRoute>
              }
            />
            <Route
              path="/students/create"
              element={
                <PrivateRoute allowedRoles={["SUPER_ADMIN", "PRINCIPAL"]}>
                  <StudentCreate />
                </PrivateRoute>
              }
            />
            <Route
              path="/students/:id"
              element={
                <PrivateRoute>
                  <StudentDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/students/:id/edit"
              element={
                <PrivateRoute allowedRoles={["SUPER_ADMIN", "PRINCIPAL"]}>
                  <StudentEdit />
                </PrivateRoute>
              }
            />
            <Route
              path="/students/:id/performance"
              element={
                <PrivateRoute
                  allowedRoles={["SUPER_ADMIN", "PRINCIPAL", "TEACHER"]}
                >
                  <StudentPerformance />
                </PrivateRoute>
              }
            />

            {/* ==================== TEACHER MANAGEMENT ==================== */}
            <Route
              path="/teachers"
              element={
                <PrivateRoute allowedRoles={["SUPER_ADMIN", "PRINCIPAL"]}>
                  <TeacherList />
                </PrivateRoute>
              }
            />
            <Route
              path="/teachers/create"
              element={
                <PrivateRoute allowedRoles={["SUPER_ADMIN", "PRINCIPAL"]}>
                  <TeacherCreate />
                </PrivateRoute>
              }
            />
            <Route
              path="/teachers/:id/edit"
              element={
                <PrivateRoute allowedRoles={["SUPER_ADMIN", "PRINCIPAL"]}>
                  <TeacherEdit />
                </PrivateRoute>
              }
            />

            {/* ==================== CLASS MANAGEMENT ==================== */}
            <Route
              path="/classes"
              element={
                <PrivateRoute allowedRoles={["SUPER_ADMIN", "PRINCIPAL"]}>
                  <ClassManagement />
                </PrivateRoute>
              }
            />

            {/* ==================== ATTENDANCE ==================== */}
            <Route
              path="/attendance"
              element={
                <PrivateRoute
                  allowedRoles={["SUPER_ADMIN", "PRINCIPAL", "TEACHER"]}
                >
                  <AttendanceManagement />
                </PrivateRoute>
              }
            />

            {/* ==================== EXAMS ==================== */}
            <Route
              path="/exams"
              element={
                <PrivateRoute
                  allowedRoles={["SUPER_ADMIN", "PRINCIPAL", "TEACHER"]}
                >
                  <ExamManagement />
                </PrivateRoute>
              }
            />

            {/* ==================== EVENTS ==================== */}
            <Route
              path="/events"
              element={
                <PrivateRoute allowedRoles={["SUPER_ADMIN", "PRINCIPAL"]}>
                  <EventManagement />
                </PrivateRoute>
              }
            />

            {/* ==================== STUDENT VIEWS ==================== */}
            <Route
              path="/results"
              element={
                <PrivateRoute allowedRoles={["STUDENT", "PARENT"]}>
                  <StudentResults />
                </PrivateRoute>
              }
            />
            <Route
              path="/timetable"
              element={
                <PrivateRoute allowedRoles={["STUDENT", "TEACHER", "PARENT"]}>
                  <StudentTimetable />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-performance"
              element={
                <PrivateRoute allowedRoles={["STUDENT"]}>
                  <MyPerformance />
                </PrivateRoute>
              }
            />

            {/* ==================== TEACHER VIEWS ==================== */}
            <Route
              path="/schedule"
              element={
                <PrivateRoute allowedRoles={["TEACHER"]}>
                  <TeacherSchedule />
                </PrivateRoute>
              }
            />

            {/* ==================== NOTICES ==================== */}
            <Route
              path="/notices"
              element={
                <PrivateRoute>
                  <NoticeBoard />
                </PrivateRoute>
              }
            />

            {/* ==================== REPORTS ==================== */}
            <Route
              path="/reports"
              element={
                <PrivateRoute
                  allowedRoles={["SUPER_ADMIN", "PRINCIPAL", "TEACHER"]}
                >
                  <ReportsPage />
                </PrivateRoute>
              }
            />

            {/* ==================== COMMON ==================== */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />

            {/* ==================== 404 ==================== */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

function RoleBasedDashboard() {
  const { user } = useAuth();
  switch (user?.role) {
    case "SUPER_ADMIN":
      return <Navigate to="/dashboard/super-admin" replace />;
    case "PRINCIPAL":
      return <Navigate to="/dashboard/principal" replace />;
    case "TEACHER":
      return <Navigate to="/dashboard/teacher" replace />;
    case "STUDENT":
      return <Navigate to="/dashboard/student" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

export default App;
