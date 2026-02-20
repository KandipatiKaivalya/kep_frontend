import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ForSchools from './pages/ForSchools';
import Courses from './pages/Courses';
import Careers from './pages/Careers';
import Impact from './pages/Impact';
import Contact from './pages/Contact';
import DashboardLayout from './pages/DashboardLayout';

// Dashboard Views
import StudentDashboard from './pages/dashboard/StudentDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import TrainerDashboard from './pages/dashboard/TrainerDashboard';
import HRDashboard from './pages/dashboard/HRDashboard';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

// ✅ UPDATED ProtectedRoute to handle the 'initializing' state
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, initializing } = useAuth();
  
  // 1. Wait for AuthContext to finish reading from localStorage
  if (initializing) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#001a33] text-white font-black uppercase tracking-[0.4em]">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-[#ff9800] border-t-transparent rounded-full animate-spin"></div>
           <span>Initializing Protocol...</span>
        </div>
      </div>
    );
  }

  // 2. Not logged in? Send to home
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // 3. Logged in but wrong role? Send to home
  if (allowedRoles && user) {
    const userRoleLower = user.role.toLowerCase().replace('role_', '');
    const hasAccess = allowedRoles.some(role => role.toLowerCase() === userRoleLower);
    if (!hasAccess) return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/for-schools" element={<PublicLayout><ForSchools /></PublicLayout>} />
          <Route path="/courses" element={<PublicLayout><Courses /></PublicLayout>} />
          <Route path="/careers" element={<PublicLayout><Careers /></PublicLayout>} />
          <Route path="/impact" element={<PublicLayout><Impact /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

          {/* ✅ Role-Based Routing for the Portal */}
          {/* We wrap the parent Route in ProtectedRoute to secure all sub-routes */}
          <Route path="/portal" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            {/* Student Routes */}
            <Route path="student" element={<StudentDashboard />} />
            <Route path="student/tasks" element={<StudentDashboard />} />
            <Route path="student/leaves" element={<StudentDashboard />} />
            <Route path="student/doubts" element={<StudentDashboard />} />
            
            {/* Admin Routes */}
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/search" element={<AdminDashboard />} />
            <Route path="admin/finance" element={<AdminDashboard />} />
            <Route path="admin/approvals" element={<AdminDashboard />} />

            {/* Trainer Routes */}
            <Route path="trainer" element={<TrainerDashboard />} />
            <Route path="trainer/tasks" element={<TrainerDashboard />} />
            <Route path="trainer/attendance" element={<TrainerDashboard />} />
            <Route path="trainer/doubts" element={<TrainerDashboard />} />

            {/* HR Routes */}
            <Route path="hr" element={<HRDashboard />} />
            <Route path="hr/approvals" element={<HRDashboard />} />
            <Route path="hr/payments" element={<HRDashboard />} />
            <Route path="hr/partners" element={<HRDashboard />} />
          </Route>

          {/* Catch-all redirection */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;