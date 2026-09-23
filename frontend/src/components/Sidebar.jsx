import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Search,
  User,
  LogOut,
  Clock,
  Loader2,
  CheckCircle2,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function Sidebar({
  role = 'STUDENT',
  activeTab,
  setActiveTab,
  onLogout,
  isCollapsed,
  setIsCollapsed,
  stats,
}) {
  const studentItems = [
    { id: 'student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'register-complaint', label: 'Register Complaint', icon: PlusCircle, highlight: true },
    { id: 'my-complaints', label: 'My Complaints', icon: FileText, badge: stats?.total },
    { id: 'track', label: 'Track Complaint', icon: Search },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const adminItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-complaints-all', label: 'All Complaints', icon: FileText, badge: stats?.total },
    { id: 'admin-complaints-pending', label: 'Pending', icon: Clock, badge: stats?.pending, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'admin-complaints-inprogress', label: 'In Progress', icon: Loader2, badge: stats?.inProgress, badgeColor: 'bg-sky-100 text-sky-800' },
    { id: 'admin-complaints-resolved', label: 'Resolved', icon: CheckCircle2, badge: stats?.resolved, badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'admin-students', label: 'Students', icon: Users },
    { id: 'admin-reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const items = role === 'ADMIN' ? adminItems : studentItems;

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] transition-all duration-300 relative no-print ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:shadow-md transition z-20"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Navigation List */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                    : item.highlight
                    ? 'text-teal-700 hover:bg-teal-50/70 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-blue-600' : item.highlight ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                {!isCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Logout */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition group"
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0 text-red-500 group-hover:scale-110 transition" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
