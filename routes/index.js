var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');

var Drink = require('../models/drink');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}
// Add drink in a body
router.post('/', function(req, res) {
    var drink = req.body.drink;
    var amount = req.body.amount;
    var date = Date();


// Create new Drink Example
var newDrink = new Drink ({
    drink: drink,
    amount: amount,
    date: Date()
});

Drink.createDrink(newDrink, function(err, drink){
    if(err) throw err;
    console.log(newDrink.date);
	console.log(drink);
});
	req.flash('success_msg', 'Great! You have drunk ' + newDrink.amount + ' ml of ' + newDrink.drink + '. Go Ahead!');

    res.redirect('/');
});

// router.post('/', function(req, res) {
//     var drink = req.body.drink;
//     var amount = req.body.amount;
//     var date = Date();

//       var newDrink = new Drink({
//         drink: drink,
//         amount: amount,
//         date: Date(),
//         _creator: newUser._id    // assign the _id from the person
//       });

//       newDrink.save(function (err) {
//         if (err) throw err;
//         // thats it!
//       });
// });

// Get drink
var url = 'mongodb://localhost:27017/loginapp';

router.get('/get-drink', function(req, res, next){
	var resultArray = [];
	mongo.connect(url, function(err, db){
		assert.equal(null, err);
		var cursor = db.collection('drinks').find();
		cursor.forEach(function(doc, err){
			assert.equal(null, err);
			resultArray.push(doc);
		}, function(){
			db.close();
			res.render('index', {items: resultArray});
		});
	})
})

// Mongo DB Realization

// var express = require('express');
// var router = express.Router();
// var mongo = require('mongodb').MongoClient;
// var objectId = require('mongodb').ObjectID;
// var assert = require('assert');
// var url = 'mongodb://localhost:27017/loginapp';

// // Get Homepage
// router.get('/', ensureAuthenticated, function(req, res){
// 	res.render('index');
// });

// function ensureAuthenticated(req, res, next) {
// 	if(req.isAuthenticated()){
// 		return next();
// 	} else {
// 		res.redirect('/users/login');
// 	}
// }

// Get drink

// router.get('/get-drink', function(req, res, next){
// 	var resultArray = [];
// 	mongo.connect(url, function(err, db){
// 		assert.equal(null, err);
// 		var cursor = db.collection('users').find();
// 		cursor.forEach(function(doc, err){
// 			assert.equal(null, err);
// 			resultArray.push(doc);
// 		}, function(){
// 			db.close();
// 			res.render('index', {items: resultArray});
// 		});
// 	})
// })

// Insert drink
// router.post('/insert-drink', function(req, res, next){
// 	var item = {
// 		drink : req.body.drink,
// 		amount: req.body.amount
// 	};
// 	mongo.connect(url, function(err, db){
// 		assert.equal(null, err);
// 		db.collection('drinks').insertOne(item, function(err, result){
// 			assert.equal(null, err);
// 			console.log('drink inserted');
// 			db.close();
// 		});
// 	});
// 	res.redirect('/');
// });
// // Insert
// router.post('/insert-drink', function(req, res, next){
// 	var item = {
// 		drink : req.body.drink,
// 		amount: req.body.amount
// 	};
// 	var id = req.body.id;
// 	mongo.connect(url, function(err, db){
// 		assert.equal(null, err);
// 		db.collection('users').updateOne({"_id": objectId(id)},{$set : {'drink': req.body.drink, 'amount': req.body.amount}}, function(err, result){
// 			assert.equal(null, err);
// 			console.log('drink inserted');
// 			db.close();
// 		});
// 	});
// 	res.redirect('/');
// });

// // add data
// router.post('/update-drink', function(req, res, next) {
// 	var item = {
// 		grad : req.body.grad
// 	};
// 	var id = req.body.id;

// 	mongo.connect(url, function(err, db){
// 		assert.equal(null,err);
// 		db.collection('users').updateOne({"_id": objectId(id)},{$set : {'grad': req.body.grad}}, function(err, result) {
// 		assert.equal(null,err);
// 		console.log('data updated');
// 		db.close();
// 		});
// 	});
// 	res.redirect('/');
// });
module.exports = router;