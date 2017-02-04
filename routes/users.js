var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');
var Drink = require('../models/drink');

// Register
router.get('/register', function(req, res){
  res.render('register');
});
// Login
router.get('/login', function(req, res){
  res.render('login');
});

// Logout
router.get('/logout', function (req, res){
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

// Profile
router.get('/statistics', ensureAuthenticated, function (req, res){
  res.render('statistics');
});

function ensureAuthenticated (req, res, next) {
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/users/login');
  }
}

// Register User
router.post('/register', function(req, res){
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;
  var gender = req.body.gender;
  var weight =  req.body.weight;
  var norm;

  // Validation
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  req.checkBody('gender', 'Gender is requiered').notEmpty();
  req.checkBody('weight', 'Weight is rerquired').isInt({min: 0, max: 200});

  var errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors:errors
    });
  } else {
    var newUser = new User({
      username: username,
      password: password,
      email: email,
      gender: gender,
      weight: weight,
      norm: Math.fround(weight * 33 / 1000).toFixed(2)
    });

    User.createUser(newUser, function(err, user){
      if(err) throw err;
    });
    

    req.flash('success_msg', 'You are registered and can now login');

    res.redirect('/users/login');
  }
});


// Autentication
router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

module.exports = router;