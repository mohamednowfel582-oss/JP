import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Toast from './components/Toast';

import LandingPage from './pages/LandingPage';
import LoginHub from './pages/LoginHub';
import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/StudentRegister';
import StudentDashboard from './pages/StudentDashboard';
import RegisterComplaint from './pages/RegisterComplaint';
import MyComplaints from './pages/MyComplaints';
import TrackComplaint from './pages/TrackComplaint';
import ComplaintDetails from './pages/ComplaintDetails';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminComplaints from './pages/AdminComplaints';
import AdminStudents from './pages/AdminStudents';
import AdminReports from './pages/AdminReports';
import ProfilePage from './pages/ProfilePage';

import { getCurrentUser, clearAuthSession, api } from './api/client';

export default function App() {
  const [user, setUser] = useState(getCurrentUser());
  const [activeTab, setActiveTab] = useState(user ? (user.role === 'ADMIN' ? 'admin-dashboard' : 'student-dashboard') : 'landing');
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [initialTrackCode, setInitialTrackCode] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });

  // Show toast notification
  const showToast = ({ type = 'success', message }) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Fetch quick metrics for sidebar badges
  const refreshStats = async () => {
    if (!user) return;
    try {
      if (user.role === 'ADMIN') {
        const res = await api.get('/admin/reports');
        setStats({
          total: res.totalComplaints || 0,
          pending: res.pendingComplaints || 0,
          inProgress: res.inProgressComplaints || 0,
          resolved: res.resolvedComplaints || 0,
        });
      } else {
        const res = await api.get('/complaints/my');
        setStats(res.stats || { total: 0, pending: 0, inProgress: 0, resolved: 0 });
      }
    } catch (e) {
      // Background metric fetch failed silently
    }
  };

  useEffect(() => {
    refreshStats();
  }, [user, activeTab]);

  const handleLoginSuccess = (userData, role) => {
    setUser({ ...userData, role });
    setActiveTab(role === 'ADMIN' ? 'admin-dashboard' : 'student-dashboard');
    showToast({
      type: 'success',
      message: `Welcome back, ${userData.name || userData.username}!`,
    });
  };

  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
    setActiveTab('landing');
    showToast({
      type: 'info',
      message: 'You have been logged out successfully.',
    });
  };

  const handleViewComplaint = (id) => {
    setSelectedComplaintId(id);
    setActiveTab('complaint-details');
  };

  const handleTrackSearch = (code) => {
    setInitialTrackCode(code);
    setActiveTab('track');
  };

  const handleComplaintRegistered = (complaint) => {
    refreshStats();
    showToast({
      type: 'success',
      message: `Complaint #${complaint.complaintCode} registered successfully!`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar for authenticated views */}
        {user && (
          <Sidebar
            role={user.role}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
            isCollapsed={sidebarCollapsed}
            setIsCollapsed={setSidebarCollapsed}
            stats={stats}
          />
        )}

        {/* Dynamic Page Content */}
        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 ${user ? 'pb-20 md:pb-8' : 'pb-12'}`}>
          <div className="max-w-7xl mx-auto">
            {/* Public Pages */}
            {activeTab === 'landing' && (
              <LandingPage
                onNavigate={setActiveTab}
                onTrackSearch={handleTrackSearch}
              />
            )}

            {activeTab === 'about' && (
              <LandingPage
                onNavigate={setActiveTab}
                onTrackSearch={handleTrackSearch}
              />
            )}

            {activeTab === 'login-hub' && (
              <LoginHub
                onSelectStudentLogin={() => setActiveTab('student-login')}
                onSelectAdminLogin={() => setActiveTab('admin-login')}
                onNavigateToRegister={() => setActiveTab('student-register')}
                onNavigateToHome={() => setActiveTab('landing')}
              />
            )}

            {activeTab === 'track' && (
              <TrackComplaint
                initialCode={initialTrackCode}
                onTrackAgain={() => setInitialTrackCode('')}
              />
            )}

            {/* Separate Dedicated Student Login */}
            {activeTab === 'student-login' && (
              <StudentLogin
                onLoginSuccess={handleLoginSuccess}
                onNavigateToRegister={() => setActiveTab('student-register')}
                onNavigateToAdminLogin={() => setActiveTab('admin-login')}
                onNavigateToHome={() => setActiveTab('landing')}
              />
            )}

            {activeTab === 'student-register' && (
              <StudentRegister
                onRegisterSuccess={handleLoginSuccess}
                onNavigateToLogin={() => setActiveTab('student-login')}
              />
            )}

            {/* Separate Dedicated Admin Login */}
            {activeTab === 'admin-login' && (
              <AdminLogin
                onLoginSuccess={handleLoginSuccess}
                onNavigateToStudentLogin={() => setActiveTab('student-login')}
                onNavigateToHome={() => setActiveTab('landing')}
              />
            )}

            {/* Student Protected Views */}
            {user?.role === 'STUDENT' && (
              <>
                {activeTab === 'student-dashboard' && (
                  <StudentDashboard
                    user={user}
                    onNavigate={setActiveTab}
                    onViewComplaint={handleViewComplaint}
                  />
                )}

                {activeTab === 'register-complaint' && (
                  <RegisterComplaint
                    user={user}
                    onComplaintRegistered={handleComplaintRegistered}
                    onViewComplaint={handleViewComplaint}
                  />
                )}

                {activeTab === 'my-complaints' && (
                  <MyComplaints
                    onNavigate={setActiveTab}
                    onViewComplaint={handleViewComplaint}
                  />
                )}
              </>
            )}

            {/* Admin Protected Views */}
            {user?.role === 'ADMIN' && (
              <>
                {activeTab === 'admin-dashboard' && (
                  <AdminDashboard
                    onNavigate={setActiveTab}
                    onViewComplaint={handleViewComplaint}
                  />
                )}

                {activeTab === 'admin-complaints-all' && (
                  <AdminComplaints
                    defaultFilter="All"
                    onViewComplaint={handleViewComplaint}
                    showToast={showToast}
                  />
                )}

                {activeTab === 'admin-complaints-pending' && (
                  <AdminComplaints
                    defaultFilter="Pending"
                    onViewComplaint={handleViewComplaint}
                    showToast={showToast}
                  />
                )}

                {activeTab === 'admin-complaints-inprogress' && (
                  <AdminComplaints
                    defaultFilter="In Progress"
                    onViewComplaint={handleViewComplaint}
                    showToast={showToast}
                  />
                )}

                {activeTab === 'admin-complaints-resolved' && (
                  <AdminComplaints
                    defaultFilter="Resolved"
                    onViewComplaint={handleViewComplaint}
                    showToast={showToast}
                  />
                )}

                {activeTab === 'admin-students' && <AdminStudents />}

                {activeTab === 'admin-reports' && (
                  <AdminReports showToast={showToast} />
                )}
              </>
            )}

            {/* Shared Detail & Profile Views */}
            {activeTab === 'complaint-details' && (
              <ComplaintDetails
                complaintId={selectedComplaintId}
                onBack={() => setActiveTab(user ? (user.role === 'ADMIN' ? 'admin-complaints-all' : 'my-complaints') : 'landing')}
              />
            )}

            {activeTab === 'profile' && <ProfilePage user={user} />}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {user && (
        <MobileNav
          role={user.role}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
