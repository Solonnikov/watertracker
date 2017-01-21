var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var app = express();

var User = require('../models/user');
var configAuth = require('./auth');

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
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is Required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register', {
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password
		});
		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

// Facebook
app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/users/login' }));
passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
  	process.nextTick(function() {
  		User.findOne({'facebook.id': profile.id}, function(err, user){
  			if(err) 
  				return done(err);
  			if(user)
  				return done(null, user);
  			else {
  				var newUser = new User();
  				newUser.facebook.id = profile.id;
  				newUser.token = accessToken;
  				newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
  				newUser.facebook.email = profile.emails[0].value;

  				newUser.save(function(err){
  					if(err)
  						throw err;
  						return done(null, newUser);
              console.log(profile);
  				})
  			}
  		});
  	});
  }
));

// Passport local
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
    	if(err) throw err;
    	if(!user) {
    		return done(null, false, {message: 'Unknown User'});
    	}

    	User.comparePassword(password, user.password, function(err, isMatch){
    		if(err) throw err;
    		if(isMatch) {
    			return done(null, user);
    		} else {
    			return done(null, false, {message: 'Invalid Password'});
    		}
    	});
    });
}));

// Serializer
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

// Autentication
router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

// Logout
router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});
module.exports = router;