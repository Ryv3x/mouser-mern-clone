import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import Button from '../components/ui/Button';
import BackButton from '../components/ui/BackButton';

const AdminSellerApplications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRaw, setShowRaw] = useState({});

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/admin/seller-applications');
        // Filter to show only pending applications
        const pending = (data || []).filter((a) => a.status === 'pending' || !a.status);
        setApps(pending);
      } catch (err) {
        console.error('Failed to fetch applications:', err);
        setApps([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handle = async (id, action) => {
    try {
      if (action === 'approve') {
        await api.put(`/admin/seller-applications/${id}/approve`);
      } else {
        const reason = window.prompt('Rejection reason (optional):');
        await api.put(`/admin/seller-applications/${id}/reject`, { reason });
      }
      // Remove from list after action
      setApps((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      const respMsg = err.response ? err.response.data : err.message;
      console.error('Action failed:', respMsg, err);
    }
  };

  return (
    <motion.div className="min-h-screen p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <BackButton />
      <h2 className="text-2xl font-bold mb-4">Seller Applications</h2>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      ) : apps.length === 0 ? (
        <div className="text-gray-600 py-8">No pending applications</div>
      ) : (
        <div className="space-y-4">
          {apps.map((a) => {
            const applicant = a.user || a; // backend may populate user
            return (
              <motion.div key={a._id} className="bg-white p-4 rounded-lg shadow" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-lg">{applicant.name || applicant.companyName || a.companyName || 'Applicant'}</p>
                    <p className="text-sm text-gray-600">{applicant.email || a.email}</p>
                    <p className="text-xs mt-1 text-gray-500">Status: <span className={`font-semibold ${a.status === 'approved' ? 'text-green-600' : a.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{a.status || 'pending'}</span></p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" onClick={async () => { await handle(a._id, 'approve'); const { data } = await api.get('/admin/seller-applications'); setApps(data || []); }}>Approve</Button>
                    <Button variant="danger" onClick={async () => { await handle(a._id, 'deny'); const { data } = await api.get('/admin/seller-applications'); setApps(data || []); }}>Deny</Button>
                    <Button variant="secondary" onClick={() => setShowRaw((s) => ({ ...s, [a._id]: !s[a._id] }))}>View Raw</Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <p><strong>Company:</strong> {a.companyName || applicant.companyName || '-'}</p>
                    <p><strong>Phone:</strong> {a.phone || applicant.phone || '-'}</p>
                    <p><strong>Website:</strong> {a.website ? <a href={a.website} target="_blank" rel="noreferrer" className="text-blue-600">{a.website}</a> : '-'}</p>
                    <p><strong>VAT / Tax ID:</strong> {a.vatNumber || '-'}</p>
                  </div>
                  <div>
                    <p><strong>Address:</strong> {a.address || '-'}</p>
                    <p><strong>Primary categories:</strong> {a.productCategories || '-'}</p>
                    <p><strong>Sample / Catalog:</strong> {a.sampleProductUrl ? <a href={a.sampleProductUrl} target="_blank" rel="noreferrer" className="text-blue-600">View</a> : '-'}</p>
                  </div>
                </div>

                <div className="mt-4 text-gray-700">
                  <p><strong>About:</strong></p>
                  <p className="text-sm text-gray-600 mt-2">{a.bio || '-'}</p>
                </div>
                {showRaw && showRaw[a._id] && (
                  <pre className="mt-4 bg-gray-50 p-3 rounded text-xs overflow-auto">{JSON.stringify(a, null, 2)}</pre>
                )}

              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default AdminSellerApplications;
