class ModuleController {
  static module1(req, res) {
    res.render('pages/module1', {
      title: 'STRATEGIC LEADERSHIP COMMUNICATION: Mastering Influence, Storytelling & Brand Power',
      pageTitle: 'STRATEGIC LEADERSHIP COMMUNICATION',
    });
  }

  static transformative(req, res) {
    res.render('pages/transformative-sessions', {
      title: 'Module 2 - Advanced Leadership Communication',
      pageTitle: 'Advanced Leadership Communication',
    });
  }

  static faqs(req, res) {
    res.render('pages/faqs', {
      title: 'FAQs',
      pageTitle: 'Frequently Asked Questions',
    });
  }
}

module.exports = ModuleController; 