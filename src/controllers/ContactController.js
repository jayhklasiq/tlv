class ContactController {
  static index(req, res) {
    res.render('pages/contact', {
      title: 'Contact Us',
      pageTitle: 'Get in Touch'
    });
  }

  static submit(req, res) {
    // Handle form submission here
    res.redirect('/contact?success=true');
  }
}

module.exports = ContactController; 