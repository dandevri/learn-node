const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
// strategy something that will interface that you are allowed to login
// local strategy

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed login!',
  successRedirect: '/',
  successFlash: 'You are logged in!',
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are logged out!');
  res.redirect('/');
}

exports.isLoggedIn = (req, res, next) => {
  // check if user is authenticated
  if(req.isAuthenticated()) {
    next(); // carry on. They are logged in
    return;
  }
  req.flash('error', 'You must be logged in');
  res.redirect('/login');
}

exports.forgot = async (req, res) => {
  // 1. see if user exist
  const user = await User.findOne({ email: req.body.email });
  if(!user) {
    req.flash('error', 'A password reset has been mailed to you.');
    return res.redirect('/login');
  }
  // 2. Reset token and expiry on account
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
  await user.save();
  // 3. Send email with token
  const resetUrl = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
  req.flash('success', `You have been emailed a reset link. ${resetUrl}`);
  // 4. redirect to login page
  res.redirect('/login');
}

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  // if there is no user
  if(!user) {
    req.flash('error', 'Password reset token is invalid or has expired.')
    return res.redirect('/login');
  }
  // if there is an user
  res.render('reset', {title: 'Reset your password'});
};

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['password-confirm']) {
    next(); // keep it going
    return;
  }
  req.flash('error', 'Passwords do not match!');
  res.redirect('back');
}

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if(!user) {
    req.flash('error', 'Password reset token is invalid or has expired.')
    return res.redirect('/login');
  }

  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);
  req.flash('success', 'Nice your password has been reset');
  res.redirect('/');
}