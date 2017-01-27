var mongoose = require('mongoose')
, Schema = mongoose.Schema
var bcrypt	= require('bcryptjs');

// User Schema
var UserSchema = Schema({
	// _id: { 
	// 	type: Number
	// },
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	gender: {
		type: String
	},
	weight: {
		type: Number
	},
	norm: {
		type: Number
	},
	facebook: {
		id: String,
		token: String, 
		email: String,
		name: String
	},
	drinks: [{ type: Schema.Types.ObjectId, ref: 'Drink' }]
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
	bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
        });
    });
}
module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}
 
module.exports.comparePassword = function (candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
		if(err) throw err;
		callback(null, isMatch);
	});
}