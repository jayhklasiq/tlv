class HomeController {
  static index(req, res) {
    const currentDate = new Date();
    const targetDate = new Date('2023-12-31'); // Set this to the desired target date
    const diffTime = Math.abs(targetDate - currentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffSeconds = Math.ceil(diffTime / 1000);

    res.render('home', {
      title: 'The Leadership Voice',
      pageTitle: 'Masterclass Series',
      days: diffDays,
      hours: diffHours % 24,
      minutes: diffMinutes % 60,
      seconds: diffSeconds % 60
    });
  }
}

module.exports = HomeController; 