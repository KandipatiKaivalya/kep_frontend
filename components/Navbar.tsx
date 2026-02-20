import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, User, LogOut, Layout, ShieldAlert, Clock } from 'lucide-react';
import { NAVIGATION_LINKS } from '../constants.tsx';
import { useAuth } from "../context/AuthContext.tsx";
import AuthModal from './AuthModal.tsx';
import Logo from './Logo.tsx';

const Navbar: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // ✅ ROLE NORMALIZATION: Ensures role checks work regardless of DB casing
  const userRole = user?.role?.toLowerCase().replace("role_", "") || "";
  const isAdmin = userRole === 'admin';

  // ✅ DYNAMIC PATH: Sends user to their specific portal (e.g., /portal/admin)
  const dashboardPath = userRole ? `/portal/${userRole}` : "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    // Clear localStorage for a fresh state
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setShowUserMenu(false);
    navigate('/', { replace: true });
  };

  return (
    <>
      <nav className={`fixed w-full z-[1000] top-0 transition-all duration-700 ease-in-out ${
        isScrolled 
          ? "bg-black/90 backdrop-blur-3xl h-[80px] rounded-b-[45px] border-b border-[#ff9800]/30" 
          : "bg-black h-[110px]" 
      }`}>
        
        <div className="max-w-full mx-auto px-4 md:px-12 h-full flex items-center">
          <div className="flex justify-between items-center w-full h-full relative">
            
            {/* LEFT: Logo */}
            <div className="flex-shrink-0 h-full flex items-center">
              <Link to="/" className="flex items-center h-full group">
                <div className={`transition-all duration-700 overflow-hidden flex items-center h-full ${
                  isScrolled ? "w-[140px] md:w-[160px]" : "w-[180px] md:w-[320px]"
                }`}>
                  <Logo className="h-full w-auto object-contain object-left transform transition-all duration-700 group-hover:scale-105" />
                </div>
              </Link>
            </div>

            {/* CENTER: Navigation Links */}
            <div className="hidden xl:flex flex-1 justify-center items-center px-4">
              <div className="flex space-x-8 items-center border-r border-white/10 pr-8 mr-8 h-8">
                {NAVIGATION_LINKS.map((link) => (
                  <Link 
                    key={link.label} 
                    to={link.path} 
                    className="text-[13px] font-black text-white hover:text-[#ff9800] uppercase tracking-widest transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* RIGHT: User Menu / Login */}
            <div className="flex-shrink-0 flex items-center h-full relative z-[1020]" ref={menuRef}>
              {user ? (
                <div className="relative flex items-center h-full">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)} 
                    className={`flex items-center space-x-4 bg-white/10 border border-white/20 px-5 py-3 rounded-2xl hover:bg-white/20 transition-all shadow-xl group ${
                      showUserMenu ? 'ring-2 ring-[#ff9800]/50' : ''
                    }`}
                  >
                    <div className="w-9 h-9 bg-[#ff9800] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                       <User size={20} className="text-black" />
                    </div>
                    <div className="flex flex-col text-left hidden lg:flex">
                      <span className="text-[11px] font-black text-white uppercase tracking-tighter leading-none">{user.name}</span>
                      <span className="text-[8px] font-bold text-[#ff9800] uppercase tracking-widest mt-1">{userRole} hub</span>
                    </div>
                    <ChevronDown size={14} className={`text-white/50 transition-transform duration-500 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-[110%] w-72 bg-black border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] overflow-hidden py-2 z-[1050] animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-6 py-5 border-b border-white/5 flex items-center space-x-3 bg-white/5">
                        <Clock size={16} className="text-gray-400" />
                        <div className="flex flex-col text-left">
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none">Session Status</span>
                          <span className="text-[10px] font-bold text-[#ff9800] uppercase mt-1">Authorized Access</span>
                        </div>
                      </div>
                      
                      {/* Dynamic Dashboard Link */}
                      <Link to={dashboardPath} onClick={() => setShowUserMenu(false)} className="flex items-center px-6 py-4 text-[11px] text-gray-300 hover:bg-white/5 font-black uppercase tracking-widest transition-colors">
                        <Layout size={18} className="mr-3 text-[#ff9800]" /> {userRole} Dashboard
                      </Link>
                      
                      {/* Admin-only Command Center Link (If needed specifically) */}
                      {isAdmin && (
                        <Link to="/portal/admin" onClick={() => setShowUserMenu(false)} className="flex items-center px-6 py-4 text-[11px] text-[#ff9800] hover:bg-white/5 font-black uppercase tracking-widest border-t border-white/5 transition-colors">
                          <ShieldAlert size={18} className="mr-3" /> Command Center
                        </Link>
                      )}
                      
                      <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center px-6 py-4 text-[11px] text-red-500 hover:bg-red-500/10 font-black uppercase tracking-widest border-t border-white/5 transition-colors"
                      >
                        <LogOut size={18} className="mr-3" /> Terminate Session
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)} 
                  className="bg-gradient-to-r from-[#FFD700] to-[#50C878] text-black px-8 py-3 rounded-xl text-xs font-black uppercase whitespace-nowrap hover:scale-105 transition-all shadow-xl active:scale-95"
                >
                  Initiate Access
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;