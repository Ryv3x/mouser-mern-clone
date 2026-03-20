export const authorize = (...roles) => {
  return (req, res, next) => {
    // If protect() didn't set req.user, respond with 401 rather than throwing
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};
