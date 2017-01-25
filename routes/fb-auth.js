var express = require('express');
var passport = require('passport');

module.exports = function(app, passport){
    // Facebook
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/',
            failureRedirect: '/users/login' }));
};