var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var passport = require('passport');

var User = require('../models/user');
// var Drink = require('../models/drink');

// Register
router.get('/register', function(req, res){
	res.render('register');
});
// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/register', function(req, res){
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
  var gender = req.body.gender;
  var weight =  req.body.weight;
  var norm;

  console.log(username);
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

    // newUser.save(function (err) {
    //   if (err) throw err;
    // });

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

// Logout
router.get('/logout', function (req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;