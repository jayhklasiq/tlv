class AboutController {
  static index(req, res) {
    res.render('pages/about', {
      title: 'About - The Leadership Voice',
      pageTitle: 'What is The Leadership Voice Masterclass?',
      imagePath: '/images/about-hero.jpg'
    });
  }
}

module.exports = AboutController; 