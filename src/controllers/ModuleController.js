class ModuleController {
  static module1(req, res) {
    res.render('pages/module1', {
      title: 'STRATEGIC LEADERSHIP COMMUNICATION: Mastering Influence, Storytelling & Brand Power',
      pageTitle: 'STRATEGIC LEADERSHIP COMMUNICATION',
    });
  }

  static power_circle(req, res) {
    res.render('pages/power-circle', {
      title: 'Module 1 - Power Circle',
      pageTitle: 'Power Circle',
    });
  }


  static tailored_development(req, res) {
    res.render('pages/tailored-development', {
      title: 'Module 1 - Tailored Development',
      pageTitle: 'Tailored Development',
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