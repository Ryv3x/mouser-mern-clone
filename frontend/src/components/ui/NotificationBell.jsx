import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Bell, X, Check } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { setCredentials } from '../../store/authSlice';

  const NotificationBell = () => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const bellRef = useRef(null);
  const panelRef = useRef(null);
  const [panelStyle, setPanelStyle] = useState({});
  const [portalEl, setPortalEl] = useState(null);

  const fetchNotifications = async () => {
    try {
      // if no auth token, don't call notifications endpoint (prevents 401 spam)
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setNotifications([]);
        return;
      }
      setLoading(true);
      const { data } = await api.get('/users/notifications');
      setNotifications(data || []);
      // if any approval notification exists, refresh profile
      if (data && data.some((n) => n.message?.toLowerCase().includes('approved'))) {
        const { data: user } = await api.get('/users/profile');
        dispatch(setCredentials({ user, token: localStorage.getItem('token') }));
      }
    } catch (err) {
      // If not authenticated, clear notifications silently to avoid throwing UI errors
      if (err.response?.status === 401) {
        setNotifications([]);
        return;
      }
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      if (open) fetchNotifications();
    }, 10000);
    return () => clearInterval(interval);
  }, [open]);

  // Compute panel position to avoid clipping; use fixed portal so it's not clipped by ancestors
  useEffect(() => {
    if (!open) return;
    const update = () => {
      const btn = bellRef.current;
      const panel = panelRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const top = rect.bottom + 8 + scrollY;
      const right = 16; // keep small gap from edge
      // limit max width via CSS class; set left/right to stabilize
      setPanelStyle({ position: 'fixed', top: `${top}px`, right: `${right}px`, left: 'auto' });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open]);

  // Create a stable portal container on mount to avoid targeting null
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const el = document.createElement('div');
    el.setAttribute('data-portal', 'notifications');
    // ensure portal sits above most layout elements
    try { el.style.zIndex = '9999'; } catch (e) {}
    document.body.appendChild(el);
    setPortalEl(el);
    return () => {
      try {
        document.body.removeChild(el);
      } catch (e) {}
      setPortalEl(null);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = async (id) => {
    try {
      await api.put(`/users/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error('Error marking notification read', err);
    }
  };

  const markAll = async () => {
    try {
      await api.put('/users/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking all read', err);
    }
  };

  const getNotificationColor = (type) => {
    const colors = {
      success: 'bg-green-50 border-l-4 border-green-500',
      warning: 'bg-yellow-50 border-l-4 border-yellow-500',
      error: 'bg-red-50 border-l-4 border-red-500',
      info: 'bg-blue-50 border-l-4 border-blue-500',
    };
    return colors[type] || colors.info;
  };

  const getIconColor = (type) => {
    const colors = {
      success: 'text-green-600',
      warning: 'text-yellow-600',
      error: 'text-red-600',
      info: 'text-blue-600',
    };
    return colors[type] || colors.info;
  };

  return (
    <div className="relative">
      <motion.button
        ref={bellRef}
        onClick={() => setOpen((o) => !o)}
        className="relative text-white hover:text-blue-100 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div animate={{ rotate: open ? 20 : 0 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Bell size={22} />
        </motion.div>
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
          {open && (() => {
            const fallbackPanelStyle = { position: 'fixed', top: '60px', right: '16px', left: 'auto' };
            const panelNode = (
          <motion.div
            ref={panelRef}
            key="notifications-panel"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={panelStyle}
            className="w-80 md:w-96 bg-white rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-200 max-w-[calc(100vw-2rem)]"
          >
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div>
                <h3 className="font-bold text-lg">Notifications</h3>
                {unreadCount > 0 && <p className="text-sm text-blue-100">{unreadCount} unread</p>}
              </div>
              <motion.button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-blue-500 rounded-lg transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={20} />
              </motion.button>
         </motion.div>

<div className="max-h-96 overflow-y-auto">

  {loading && (
    <motion.div
      className="p-6 text-center"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <div className="inline-flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    </motion.div>
  )}

              {!loading && notifications.length === 0 && (
                <motion.div className="p-8 text-center text-gray-500" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Bell size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No notifications yet</p>
                </motion.div>
              )}

              <AnimatePresence>
                {notifications.map((n, idx) => (
                  <motion.div
                    key={n._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-4 border-b border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 ${getNotificationColor(n.type)}`}
                  >
                    <motion.div className="flex gap-3" onClick={() => markRead(n._id)} whileHover={{ x: 5 }}>
                      {n.image ? (
                        <img src={n.image} alt="notif" className="w-12 h-12 rounded-md object-cover" onError={(e)=>{e.currentTarget.style.display='none'}} />
                      ) : (
                        <div className={`mt-1 ${getIconColor(n.type)}`}>{n.type === 'success' ? <Check size={20} /> : <Bell size={20} />}</div>
                      )}
                      <div className="flex-1">
                        {n.title && <p className={`text-sm ${n.read ? 'text-gray-600' : 'text-gray-800 font-semibold'}`}>{n.title}</p>}
                        <p className={`text-sm ${n.read ? 'text-gray-600' : 'text-gray-800 font-semibold'}`}>{n.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                      </div>
                      {!n.read && <motion.div className="w-2 h-2 bg-blue-600 rounded-full mt-2" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}></motion.div>}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {notifications.length > 0 && (
              <motion.div className="border-t border-gray-200 p-3 flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <motion.button
                  onClick={markAll}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 px-3 py-1 hover:bg-blue-50 rounded-lg transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Mark all as read
                </motion.button>
              </motion.div>
            )}
          </motion.div>
          );
          // ensure panel has a usable style if compute failed
          const finalPanel = React.cloneElement(panelNode, { style: Object.keys(panelStyle || {}).length ? panelStyle : fallbackPanelStyle });

          // Try to mount into portal; if it fails, render inline fallback to avoid crashing
          if (portalEl) {
            try {
              return createPortal(finalPanel, portalEl);
            } catch (err) {
              console.error('Portal mount failed, falling back to inline render', err);
              return finalPanel;
            }
          }

          return finalPanel;
        })()}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;