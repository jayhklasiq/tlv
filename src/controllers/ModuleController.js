class ModuleController {
  static module1(req, res) {
    res.render('pages/module1', {
      title: 'Module 1 - The Leadership Voice Masterclass',
      pageTitle: 'What is The Leadership Voice Masterclass?',
    });
  }

  static module2(req, res) {
    res.render('pages/module2', {
      title: 'Module 2 - Advanced Leadership Communication',
      pageTitle: 'Advanced Leadership Communication',
    });
  }

  static module3(req, res) {
    res.render('pages/module3', {
      title: 'Module 3 - Executive Presence & Influence',
      pageTitle: 'Executive Presence & Influence',
    });
  }
}

module.exports = ModuleController; 