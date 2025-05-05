const User = require('../models/User');
const ClassSettings = require('../models/ClassSettings');
const CountryRegistration = require('../models/CountryRegistration');

class AdminController {
  static async dashboard(req, res) {
    try {
      // Fetch summary data for the dashboard
      const totalUsers = await User.countDocuments();
      const paidUsers = await User.countDocuments({ paymentStatus: 'completed' });
      const classSettings = await ClassSettings.find();
      
      res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        pageTitle: 'Admin Dashboard',
        totalUsers,
        paidUsers,
        classSettings
      });
    } catch (error) {
      console.error('Admin dashboard error:', error);
      res.status(500).render('admin/dashboard', {
        title: 'Admin Dashboard',
        pageTitle: 'Admin Dashboard',
        error: 'Failed to load dashboard data'
      });
    }
  }

  static async classSettings(req, res) {
    try {
      const classSettings = await ClassSettings.find();
      
      res.render('admin/class-settings', {
        title: 'Class Settings',
        pageTitle: 'Manage Class Settings',
        classSettings,
        success: req.query.success,
        error: req.query.error
      });
    } catch (error) {
      console.error('Class settings error:', error);
      res.status(500).render('admin/class-settings', {
        title: 'Class Settings',
        pageTitle: 'Manage Class Settings',
        error: 'Failed to load class settings'
      });
    }
  }

  static async updateClassSettings(req, res) {
    try {
      const { id, moduleName, programType, price, stripePrice, paypalPrice, startDate, endDate } = req.body;
      
      // Convert stripe price to cents for storage
      const stripePriceInCents = parseFloat(stripePrice) * 100;
      
      if (id) {
        // Update existing setting
        await ClassSettings.findByIdAndUpdate(id, {
          moduleName,
          programType,
          price,
          stripePrice: stripePriceInCents,
          paypalPrice,
          startDate,
          endDate
        });
      } else {
        // Create new setting
        const newSetting = new ClassSettings({
          moduleName,
          programType,
          price,
          stripePrice: stripePriceInCents,
          paypalPrice,
          startDate,
          endDate
        });
        await newSetting.save();
      }
      
      res.redirect('/admin/class-settings?success=Settings updated successfully');
    } catch (error) {
      console.error('Update class settings error:', error);
      res.redirect('/admin/class-settings?error=Failed to update settings');
    }
  }

  static async deleteClassSetting(req, res) {
    try {
      const { id } = req.params;
      await ClassSettings.findByIdAndDelete(id);
      res.redirect('/admin/class-settings?success=Setting deleted successfully');
    } catch (error) {
      console.error('Delete class setting error:', error);
      res.redirect('/admin/class-settings?error=Failed to delete setting');
    }
  }

  static async enrollments(req, res) {
    try {
      const users = await User.find().sort({ registrationDate: -1 });
      res.render('admin/enrollments', {
        title: 'User Enrollments',
        pageTitle: 'Manage Enrollments',
        users
      });
    } catch (error) {
      console.error('Enrollments page error:', error);
      res.status(500).render('admin/enrollments', {
        title: 'User Enrollments',
        pageTitle: 'Manage Enrollments',
        error: 'Failed to load enrollment data'
      });
    }
  }
}

module.exports = AdminController;