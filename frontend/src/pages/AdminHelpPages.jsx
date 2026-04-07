import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Trash2, Edit, Plus } from 'lucide-react';
import BackButton from '../components/ui/BackButton';

const AdminHelpPages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ slug: '', title: '', content: '' });

  const fetchPages = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/help-pages');
      setPages(data);
    } catch (err) {
      console.error('Failed to load help pages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const startCreate = () => {
    setEditing(null);
    setForm({ slug: '', title: '', content: '' });
  };

  const startEdit = (page) => {
    setEditing(page._id);
    setForm({ slug: page.slug, title: page.title, content: page.content });
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/admin/help-pages/${editing}`, { title: form.title, content: form.content });
      } else {
        await api.post('/admin/help-pages', form);
      }
      fetchPages();
      setEditing(null);
      setForm({ slug: '', title: '', content: '' });
    } catch (err) {
      console.error('Failed to save', err);
      alert('Error saving page');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this page?')) return;
    try {
      await api.delete(`/admin/help-pages/${id}`);
      fetchPages();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">        <BackButton />        <h1 className="text-3xl font-bold mb-8">Manage Help Pages</h1>

        <motion.div
          className="bg-white p-6 rounded-lg shadow mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold mb-4">
            {editing ? 'Edit Page' : 'Create New Page'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                disabled={!!editing}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="e.g. help-center"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Content (HTML)</label>
              <textarea
                rows={6}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-sm"
              />
            </div>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-primary text-gray-900 rounded hover:bg-primary-600 transition"
            >
              Save
            </button>
            {editing && (
              <button
                onClick={startCreate}
                className="ml-4 px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </motion.div>

        <div className="space-y-4">
          {pages.map((page) => (
            <motion.div
              key={page._id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <p className="font-semibold text-gray-900">{page.title}</p>
                <p className="text-xs text-gray-500">/{page.slug}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(page)}
                  className="p-2 bg-yellow-400 rounded hover:bg-yellow-500"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(page._id)}
                  className="p-2 bg-red-500 rounded hover:bg-red-600 text-white"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={startCreate}
          className="mt-8 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center gap-2"
        >
          <Plus size={16} /> New Page
        </button>
      </div>
    </div>
  );
};

export default AdminHelpPages;
