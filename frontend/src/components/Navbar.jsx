import React, { useState } from 'react';
import { ShieldAlert, Menu, X, User, LogOut, FileText, LayoutDashboard, Search, GraduationCap, LogIn } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNav(user ? (user.role === 'ADMIN' ? 'admin-dashboard' : 'student-dashboard') : 'landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                Complaint<span className="text-teal-600">Portal</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
                Smart Management System
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {!user ? (
              <>
                <button
                  onClick={() => handleNav('landing')}
                  className={`transition ${activeTab === 'landing' ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNav('track')}
                  className={`flex items-center gap-1.5 transition ${activeTab === 'track' ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <Search className="w-4 h-4" />
                  Track Status
                </button>
                <button
                  onClick={() => handleNav('about')}
                  className={`transition ${activeTab === 'about' ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  About
                </button>

                {/* Login Hub Link */}
                <button
                  onClick={() => handleNav('login-hub')}
                  className={`flex items-center gap-1.5 transition ${activeTab === 'login-hub' ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>

                {/* Direct Separate Login Buttons */}
                <div className="flex items-center gap-2.5 ml-2 pl-4 border-l border-slate-200">
                  <button
                    onClick={() => handleNav('student-login')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition ${
                      activeTab === 'student-login'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-blue-700 bg-blue-50 hover:bg-blue-100'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    Student Login
                  </button>
                  <button
                    onClick={() => handleNav('admin-login')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition ${
                      activeTab === 'admin-login'
                        ? 'bg-slate-900 text-teal-300 ring-2 ring-slate-900 shadow-sm'
                        : 'text-white bg-slate-900 hover:bg-slate-800 shadow-sm'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-teal-400" />
                    Admin Login
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200">
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900 leading-none">{user.name || user.username}</p>
                    <p className="text-[10px] text-teal-700 font-medium leading-tight">
                      {user.role === 'ADMIN' ? 'Administrator' : `Student • ${user.studentId || ''}`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-slide-down">
          {!user ? (
            <>
              <button
                onClick={() => handleNav('landing')}
                className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Home
              </button>
              <button
                onClick={() => handleNav('track')}
                className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Track Complaint
              </button>
              <button
                onClick={() => handleNav('about')}
                className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                About
              </button>
              <button
                onClick={() => handleNav('login-hub')}
                className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-50 flex items-center gap-2 font-bold"
              >
                <LogIn className="w-4 h-4" />
                Choose Portal to Login
              </button>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => handleNav('student-login')}
                  className="w-full py-2.5 text-sm font-bold text-blue-700 bg-blue-50 rounded-xl text-center flex items-center justify-center gap-2 shadow-xs"
                >
                  <GraduationCap className="w-4 h-4" />
                  Student Login
                </button>
                <button
                  onClick={() => handleNav('admin-login')}
                  className="w-full py-2.5 text-sm font-bold text-white bg-slate-900 rounded-xl text-center shadow-md flex items-center justify-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4 text-teal-400" />
                  Admin Login
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 bg-slate-50 rounded-xl mb-2">
                <p className="text-sm font-bold text-slate-900">{user.name || user.username}</p>
                <p className="text-xs text-teal-600 font-medium">
                  {user.role === 'ADMIN' ? 'System Administrator' : `Student ID: ${user.studentId}`}
                </p>
              </div>
              <button
                onClick={() => handleNav(user.role === 'ADMIN' ? 'admin-dashboard' : 'student-dashboard')}
                className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-blue-600" />
                Dashboard
              </button>
              <button
                onClick={onLogout}
                className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
