import React from 'react';
import { LayoutDashboard, PlusCircle, FileText, Search, User } from 'lucide-react';

export default function MobileNav({ role = 'STUDENT', activeTab, setActiveTab }) {
  const studentItems = [
    { id: 'student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'register-complaint', label: 'Register', icon: PlusCircle },
    { id: 'my-complaints', label: 'Complaints', icon: FileText },
    { id: 'track', label: 'Track', icon: Search },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const adminItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-complaints-all', label: 'Complaints', icon: FileText },
    { id: 'admin-students', label: 'Students', icon: User },
    { id: 'admin-reports', label: 'Reports', icon: Search },
  ];

  const items = role === 'ADMIN' ? adminItems : studentItems;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex justify-around items-center shadow-lg no-print">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
              isActive ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 scale-110' : 'text-slate-500'}`} />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
