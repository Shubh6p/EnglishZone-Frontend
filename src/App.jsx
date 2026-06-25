import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import OTPPage from './pages/OTPPage';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './pages/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Classroom from './pages/Classroom';
import TeachersRoom from './pages/TeachersRoom';
import Exam from './pages/Exam';
import FeeTransport from './pages/FeeTransport';

// Teacher Dashboard Pages
import TeacherDashboardLayout from './pages/TeacherDashboardLayout';
import TeacherDashboardHome from './pages/TeacherDashboardHome';
import TeacherClassAttendance from './pages/TeacherClassAttendance';
import TeacherMyAttendance from './pages/TeacherMyAttendance';
import TeacherPayroll from './pages/TeacherPayroll';
import TeacherGradebook from './pages/TeacherGradebook';
import TeacherResources from './pages/TeacherResources';

// Admin Dashboard Pages
import AdminDashboardLayout from './pages/admin/AdminDashboardLayout';
import AdminDashboardHome from './pages/admin/AdminDashboardHome';
import AdminUserManagement from './pages/admin/AdminUserManagement';
import AdminFinancialInvoicing from './pages/admin/AdminFinancialInvoicing';
import AdminAcademicControl from './pages/admin/AdminAcademicControl';
import AdminTransitMonitoring from './pages/admin/AdminTransitMonitoring';

// Superadmin Pages
import SuperadminDashboardLayout from './pages/superadmin/SuperadminDashboardLayout';
import SuperadminDashboardHome from './pages/superadmin/SuperadminDashboardHome';
import SuperadminAuditLogs from './pages/superadmin/SuperadminAuditLogs';
import SuperadminConfig from './pages/superadmin/SuperadminConfig';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication Pages */}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Student Dashboard Sub-routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="classroom" element={<Classroom />} />
            <Route path="teachers" element={<TeachersRoom />} />
            <Route path="exams" element={<Exam />} />
            <Route path="fees" element={<FeeTransport defaultView="fees" />} />
            <Route path="transport" element={<FeeTransport defaultView="transport" />} />
          </Route>

          {/* Teacher Dashboard Sub-routes */}
          <Route path="/teacher-dashboard" element={<TeacherDashboardLayout />}>
            <Route index element={<TeacherDashboardHome />} />
            <Route path="class-attendance" element={<TeacherClassAttendance />} />
            <Route path="my-attendance" element={<TeacherMyAttendance />} />
            <Route path="payroll" element={<TeacherPayroll />} />
            <Route index path="gradebook" element={<TeacherGradebook />} />
            <Route path="resources" element={<TeacherResources />} />
          </Route>

          {/* Admin Dashboard Sub-routes */}
          <Route path="/admin-dashboard" element={<AdminDashboardLayout />}>
            <Route index element={<AdminDashboardHome />} />
            <Route path="users" element={<AdminUserManagement />} />
            <Route path="finance" element={<AdminFinancialInvoicing />} />
            <Route path="academics" element={<AdminAcademicControl />} />
            <Route path="transit" element={<AdminTransitMonitoring />} />
          </Route>

          {/* Superadmin Dashboard Sub-routes */}
          <Route path="/superadmin-dashboard" element={<SuperadminDashboardLayout />}>
            <Route index element={<SuperadminDashboardHome />} />
            <Route path="logs" element={<SuperadminAuditLogs />} />
            <Route path="config" element={<SuperadminConfig />} />
          </Route>

          {/* Fallback Catch-All Redirect to Landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
