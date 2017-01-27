var mongoose = require('mongoose')
, Schema = mongoose.Schema

// Drink Schema
var DrinkSchema = Schema({
	// _creator: {
	// 	type: Number, 
	// 	ref: 'User'
	// },
	drink: {
		type: String,
		index: true
	},
	amount: { 
		type: Number
	},
	date: {
		type: Date
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
