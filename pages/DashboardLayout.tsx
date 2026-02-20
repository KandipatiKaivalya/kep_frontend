import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  Layout, 
  Zap, 
  ShieldCheck, 
  MessageSquare, 
  Calendar, 
  CreditCard, 
  Users, 
  TrendingUp, 
  HelpCircle,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Role-Based Sidebar Logic (Fixed to handle Spring Security prefixes)
  const getSidebarLinks = () => {
    // Spring Security often adds 'ROLE_', so we strip it for our switch case
   const role = user?.role ? user.role.toLowerCase().replace('role_', '') : '';

    switch(role) {
      case 'student':
        return [
          { name: 'Learning Lab', path: '/portal/student', icon: <Layout size={20} /> },
          { name: 'Task Updates', path: '/portal/student/tasks', icon: <ClipboardList size={20} /> },
          { name: 'Leave & HR Hub', path: '/portal/student/leaves', icon: <Calendar size={20} /> },
          { name: 'Mentor Doubts', path: '/portal/student/doubts', icon: <HelpCircle size={20} /> },
          { name: 'Performance Monitor', path: '/portal/student/performance', icon: <TrendingUp size={20} /> },
        ];
      case 'trainer':
        return [
          { name: 'Mentorship HQ', path: '/portal/trainer', icon: <Layout size={20} /> },
          { name: 'Assign Tasks', path: '/portal/trainer/tasks', icon: <Zap size={20} /> },
          { name: 'Presence Grid', path: '/portal/trainer/attendance', icon: <ShieldCheck size={20} /> },
          { name: 'Doubt Resolution', path: '/portal/trainer/doubts', icon: <MessageSquare size={20} /> },
        ];
      case 'hr':
        return [
          { name: 'Liaison Desk', path: '/portal/hr', icon: <Layout size={20} /> },
          { name: 'Leave Approvals', path: '/portal/hr/approvals', icon: <ShieldCheck size={20} /> },
          { name: 'Payment Dues', path: '/portal/hr/payments', icon: <CreditCard size={20} /> },
          { name: 'Partner Enquiries', path: '/portal/hr/partners', icon: <Users size={20} /> },
        ];
      case 'admin':
        return [
          { name: 'Command Center', path: '/portal/admin', icon: <Layout size={20} /> },
          { name: 'Role Search', path: '/portal/admin/search', icon: <Search size={20} /> },
          { name: 'Financial Engine', path: '/portal/admin/finance', icon: <CreditCard size={20} /> },
          { name: 'User Approvals', path: '/portal/admin/approvals', icon: <ShieldCheck size={20} /> },
        ];
      default: return [];
    }
  };

  const links = getSidebarLinks();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Extract display name (Matching AuthController's "firstName" response)
  const displayName = user?.firstName || user?.username || 'User';

  return (
    <div className="flex h-screen bg-[#f8fbff] font-sans">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-72' : 'w-24'} bg-[#001a33] text-white transition-all duration-500 flex flex-col z-50 relative border-r border-white/5 shadow-2xl`}
      >
        <div className="p-8 flex items-center space-x-4 overflow-hidden shrink-0">
          <div className="w-16 h-12 bg-[#ff9800] rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-xl text-[#001a33] shadow-lg">KEP</div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="font-black text-xs uppercase tracking-[0.2em] text-[#ff9800]">Keshava Elite</span>
              <span className="font-bold text-[10px] text-white/50 uppercase tracking-[0.1em]">Portal System</span>
            </div>
          )}
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-3 overflow-y-auto custom-scrollbar">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-4 p-4 rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-[#0056b3] text-white shadow-[0_10px_20px_rgba(0,86,179,0.3)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className={`flex-shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {link.icon}
                </div>
                {isSidebarOpen && <span className="font-black uppercase tracking-[0.15em] text-[9px] leading-none">{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5 shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-4 p-4 w-full text-red-400 hover:bg-red-400/10 rounded-2xl transition-all"
          >
            <LogOut size={20} className="flex-shrink-0" />
            {isSidebarOpen && <span className="font-black uppercase tracking-widest text-[10px]">Sign Out</span>}
          </button>
        </div>

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-24 w-7 h-7 bg-[#ff9800] rounded-full flex items-center justify-center text-[#001a33] border-4 border-[#f8fbff] shadow-xl hover:scale-110 transition-all z-[60]"
        >
          {isSidebarOpen ? <ChevronLeft size={16} strokeWidth={3} /> : <ChevronRight size={16} strokeWidth={3} />}
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-10 z-40 shrink-0">
          <div className="flex items-center space-x-8">
            <h2 className="text-2xl font-black text-[#001a33] uppercase tracking-tighter">
              {location.pathname.split('/').pop()?.replace('-', ' ') || 'Overview'}
            </h2>
          </div>

          <div className="flex items-center space-x-8">
            <button className="relative p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-[#0056b3] transition-all hover:scale-110">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-3 h-3 bg-[#ff9800] border-2 border-white rounded-full"></span>
            </button>
            <div className="h-10 w-[1px] bg-gray-200"></div>
            <div className="flex items-center space-x-5">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-[#001a33] uppercase tracking-wider leading-none mb-1">{displayName}</p>
                <div className="flex items-center justify-end space-x-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{user?.role?.replace('ROLE_', '')}</p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#0056b3] flex items-center justify-center text-white font-bold shadow-xl">
                {displayName[0]}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 bg-[#f8fbff] custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;