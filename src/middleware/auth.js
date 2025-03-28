const User = require('../models/User');

// Authentication middleware
const isAuthenticated = async (req, res, next) => {
  if (req.session && req.session.user) {
    const user = await User.findById(req.session.user.id);

    if (user) {
      const now = new Date();
      if (user.sessionExpiry > now) {
        // Extend session on activity
        const remainingTime = user.sessionExpiry - now;
        req.session.cookie.maxAge = remainingTime;
        user.sessionExpiry = new Date(Date.now() + remainingTime);
        await user.save();

        // console.log('Session extended:', {
        //   user: user.email,
        //   newExpiry: user.sessionExpiry,
        //   sessionMaxAge: req.session.cookie.maxAge
        // });

        return next();
      }

      console.log('Session expired for:', user.email);
    }

    req.session.destroy();
    return res.redirect('/profile/verify');
  }

  return res.redirect('/profile/verify');
};

module.exports = isAuthenticated;
