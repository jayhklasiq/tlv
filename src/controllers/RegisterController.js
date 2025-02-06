class RegisterController {
  static submit(req, res) {
    const { firstName, lastName, email, phone, company, role, address, country } = req.body;

    // Here you can handle the registration logic, e.g., save to database
    console.log('Registration Data:', { firstName, lastName, email, phone, company, role, address, country });

    // Redirect or render a success page
    res.redirect('/register?success=true');
  }
}

module.exports = RegisterController; 