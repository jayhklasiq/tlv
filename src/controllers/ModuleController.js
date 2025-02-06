class ModuleController {
  static index(req, res) {
    res.render('pages/module1', {
      title: 'Module 1 - The Leadership Voice Masterclass',
      pageTitle: 'What is The Leadership Voice Masterclass?',
      imagePath: '/images/about-hero.jpg'
    });
  }
}

module.exports = ModuleController; 