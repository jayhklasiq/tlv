const User = require('../models/User');

// Authentication middleware
const isAuthenticated = async (req, res, next) => {
  if (req.session && req.session.user) {
    const user = await User.findById(req.session.user.id);

    if (user && user.sessionExpiry > new Date()) {
      // Update session expiry on activity
      user.sessionExpiry = new Date(Date.now() + (45 * 60 * 60 * 1000));
      await user.save();
      return next();
    }

    // Session expired - clear it
    req.session.destroy();
    return res.redirect('/profile/verify');
  }
  return res.redirect('/profile/verify');
};

module.exports = isAuthenticated;