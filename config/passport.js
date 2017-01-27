var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../models/user');
var configAuth = require('./auth');

module.exports = function(passport) {
	
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
// 	passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//   done(null, user);
// });

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
						console.log('profile', profile);
						// newUser.facebook.email = profile.emails[0].value;

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
};