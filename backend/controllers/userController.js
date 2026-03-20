import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// return current user's profile including notifications
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    await user.save();
    const updated = await User.findById(req.user._id).select('-password');
    res.json(updated);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Failed to update profile: ' + err.message });
  }
};

// change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if current password is correct
    const isPasswordCorrect = await user.matchPassword(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Failed to change password: ' + err.message });
  }
};

// update preferences
export const updatePreferences = async (req, res) => {
  try {
    const { emailNotifications, orderUpdates, promotions, newsletter } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.preferences) {
      if (emailNotifications !== undefined) user.preferences.emailNotifications = emailNotifications;
      if (orderUpdates !== undefined) user.preferences.orderUpdates = orderUpdates;
      if (promotions !== undefined) user.preferences.promotions = promotions;
      if (newsletter !== undefined) user.preferences.newsletter = newsletter;
    }

    await user.save();
    const updated = await User.findById(req.user._id).select('-password');
    res.json(updated);
  } catch (err) {
    console.error('Update preferences error:', err);
    res.status(500).json({ message: 'Failed to update preferences: ' + err.message });
  }
};

// delete account
export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user
    await User.findByIdAndDelete(req.user._id);
    
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({ message: 'Failed to delete account: ' + err.message });
  }
};

// notifications are embedded, return them separately if desired
export const getNotifications = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findById(req.user._id).select('notifications');
    if (user) {
      return res.json(user.notifications || []);
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (err) {
    console.error('Get notifications error:', err && err.message ? err.message : err);
    return res.status(500).json({ message: 'Failed to fetch notifications: ' + (err.message || err) });
  }
};

// mark a single notification as read
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    if (user) {
      const note = user.notifications.id(id);
      if (note) {
        note.read = true;
        await user.save();
        return res.json(note);
      }
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(404).json({ message: 'User not found' });
  } catch (err) {
    console.error('Mark notification read error:', err);
    res.status(500).json({ message: 'Failed to mark notification: ' + err.message });
  }
};

// mark all notifications read
export const markAllRead = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.notifications.forEach((n) => (n.read = true));
      await user.save();
      return res.json({ message: 'All notifications marked read' });
    }
    res.status(404).json({ message: 'User not found' });
  } catch (err) {
    console.error('Mark all read error:', err);
    res.status(500).json({ message: 'Failed to mark all as read: ' + err.message });
  }
};
