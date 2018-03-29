const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(User.createStrategy())

// what to do with the user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());