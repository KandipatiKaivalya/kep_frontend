import React, { useEffect, useState } from 'react';
import { api } from '../context/AuthContext'; // Using our secure Axios instance
import { CheckCircle, XCircle, Clock, User } from 'lucide-react';

const AdminTriage: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch pending users from Spring Boot on mount
  useEffect(() => {
    const fetchTriageData = async () => {
      try {
        const response = await api.get('/admin/pending-registrations');
        setPendingUsers(response.data);
      } catch (err) {
        console.error("Failed to fetch pending users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTriageData();
  }, []);

  // 2. Logic to Approve a User
  const handleApprove = async (id: number) => {
    try {
      await api.post(`/admin/approve-identity/${id}`);
      setPendingUsers(prev => prev.filter(user => user.id !== id));
      alert("Identity authorized successfully.");
    } catch (err) {
      alert("Authorization protocol failed.");
    }
  };

  // 3. Logic to Purge (Deny) a User
  const handleDeny = async (id: number) => {
    if (!window.confirm("Purge this identity node? This action is permanent.")) return;
    try {
      await api.delete(`/admin/purge-registration/${id}`);
      setPendingUsers(prev => prev.filter(user => user.id !== id));
      alert("User purged and notified.");
    } catch (err) {
      alert("Purge protocol failed.");
    }
  };

  if (loading) return <div className="p-10 text-white">Accessing Registry...</div>;

  return (
    <div className="bg-slate-900 rounded-xl border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="text-orange-500" /> Access Triage
        </h2>
        <span className="text-xs text-gray-400">{pendingUsers.length} Pending Requests</span>
      </div>

      <table className="w-full text-left">
        <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-gray-400">
          <tr>
            <th className="p-6">Candidate</th>
            <th className="p-6">Role</th>
            <th className="p-6">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-gray-300">
          {pendingUsers.length === 0 ? (
            <tr><td colSpan={3} className="p-10 text-center text-gray-500">No pending identities in registry.</td></tr>
          ) : (
            pendingUsers.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                      {user.firstName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-xs font-mono text-blue-400">{user.role}</td>
                <td className="p-6">
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(user.id)} className="p-2 hover:bg-green-500/20 text-green-500 rounded-lg">
                      <CheckCircle size={18} />
                    </button>
                    <button onClick={() => handleDeny(user.id)} className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg">
                      <XCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTriage;