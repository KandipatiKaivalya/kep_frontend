import React, { useState, useEffect } from 'react';
import { 
  Search, Users, ShieldCheck, TrendingUp, UserPlus, 
  CheckCircle2, XCircle, Eye, Zap, Briefcase, Loader2, X 
} from 'lucide-react';

import api from '../../api/axios'; 

const AdminDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    firstName: '', lastName: '', email: '', mobile: '', role: 'STUDENT' 
  });

  const [stats, setStats] = useState({
    hrEfficiency: 0,
    trainerLead: 0,
    studentGrowth: 0,
    totalUsers: 0
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  // ✅ FIXED
  const fetchInitialData = async () => {
    try {
      const triageRes = await api.get('/admin/pending-registrations');
      const statsRes = await api.get('/admin/stats');
      
      setPendingApprovals(triageRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Liaison Desk: Registry connection failed.", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.trim().length > 1) {
        setSearching(true);
        try {
          const res = await api.get(`/admin/search?q=${searchTerm}`);
          setSearchResults(res.data);
        } catch (err) { 
          console.error("Search failed", err); 
        } finally { 
          setSearching(false); 
        }
      } else { 
        setSearchResults([]); 
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // ✅ FIXED
  const handleApprove = async (id: number) => {
    try {
      await api.post(`/admin/approve-identity/${id}`);
      setPendingApprovals(prev => prev.filter(req => req.id !== id));
      alert("Access Authorized.");
      fetchInitialData(); 
    } catch (err) { 
      alert("Authorization failed."); 
    }
  };

  // ✅ FIXED
  const handleDeny = async (id: number) => {
    if (!window.confirm("Purge this identity node?")) return;
    try {
      await api.delete(`/admin/purge-registration/${id}`);
      setPendingApprovals(prev => prev.filter(req => req.id !== id));
      alert("Identity purged.");
      fetchInitialData();
    } catch (err) { 
      alert("Purge failed."); 
    }
  };

  // ✅ FIXED
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/create-user', formData);
      alert("User Created. Temp Password: KEP@2026");
      setShowModal(false);
      setFormData({ 
        firstName: '', 
        lastName: '', 
        email: '', 
        mobile: '', 
        role: 'STUDENT' 
      });
      fetchInitialData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Creation failed.");
    }
  };

  return (
    <div className="space-y-10 relative">

      {/* Search & Action Bar */}
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div className="flex-1 w-full bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex items-center px-10">
           {searching ? 
             <Loader2 size={24} className="text-blue-500 animate-spin mr-6" /> 
             : 
             <Search size={24} className="text-[#0056b3] mr-6" />
           }
           <input 
             type="text" 
             placeholder="SEARCH GLOBAL REGISTRY (NAME, EMAIL, ROLE)..."
             className="w-full bg-transparent border-none outline-none font-black uppercase tracking-widest text-xs text-[#001a33] placeholder:text-gray-300"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:scale-105 transition-all text-[#0056b3] flex items-center gap-3 shrink-0"
        >
          <UserPlus size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest">Manual Entry</span>
        </button>
      </div>

      {/* Registry Matches */}
      {searchTerm && searchResults.length > 0 && (
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-[#001a33] mb-8 uppercase tracking-tighter flex items-center gap-3">
            <Search className="text-[#0056b3]" /> Registry Matches
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchResults.map(user => (
              <div key={user.id} className="p-8 bg-gray-50 rounded-[2.5rem] border border-transparent hover:border-[#ff9800]/20 transition-all flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#001a33] text-white rounded-xl flex items-center justify-center font-black">
                    {user.firstName?.[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#001a33] uppercase">
                      {user.firstName} {user.lastName}
                    </h4>
                    <p className="text-[10px] font-bold text-[#ff9800] uppercase tracking-widest">
                      {user.role}
                    </p>
                  </div>
                </div>
                <button className="p-2 bg-white rounded-lg text-gray-400 hover:text-blue-500">
                  <Eye size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* The rest of your UI remains EXACTLY SAME */}

    </div>
  );
};

export default AdminDashboard;
