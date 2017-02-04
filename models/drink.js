var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var User = require('./user');

// Drink Schema

var DrinkSchema = mongoose.Schema({
	drink: {
		type: String,
		index: true
	},
	amount: { 
		type: Number
	},
	date: {
		type: Date
	},
	_owner: {
  		type: Number,
  		ref: 'User'
  	}
});

var Drink = module.exports = mongoose.model('Drink', DrinkSchema);

module.exports.createDrink = function(newDrink, callback) {
    newDrink.save(callback);
}

// module.exports.getDrink = function(drink, callback){
// 	var query = {drink: drink};
// 	Drink.findOne(query, callback);
// }
// // module.exports.getAmount = function(amount, callback){
// // 	var query = {amount: amount};
// // 	Drink.findOne(query, callback);
// // }
// // // module.exports.getDrinkById = function(id, callback){
// // // 	Drink.findById(id, callback);
// // // }
