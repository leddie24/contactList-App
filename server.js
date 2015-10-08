var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('contactlist', ['contactlist']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());


var tags=['java','css','css3','php','nodejs','html','html5','python','ruby','rails','express','angularjs','react'];
app.get('/search', function(req, res) {
    if(req.query.term){
        // res.json(tags.filter(function(value){
        //     return value.indexOf(req.query.term)!== -1;
        // }));

			var re = new RegExp(".*" + req.query.term + ".*", "g");
			db.contactlist.find({"name": re}, {name: 1, number: 1}, function(err, doc) {
			console.log(doc);
			console.log(req.query.term);
			res.json(doc);
		});
    }
    else{
        res.status(200).end();
    }
});

app.get('/contactlist', function(req, res) {
	console.log("I received a get request");

	db.contactlist.find(function (err, docs) {
		console.log(docs);
		res.json(docs); 
	});
});

app.get('/contactlist/sortBy/:group', function(req, res) {
	console.log("I received a get request to sort by group");

	var group = req.params.group;
	console.log(group);
	db.contactlist.find({"group": group}, function(err, doc) {
		console.log(doc);
		res.json(doc);
	});
});

app.post('/contactlist', function(req, res) {
	console.log(req.body);
	db.contactlist.insert(req.body, function(err, doc) {
		res.json(doc);
	});
})

app.delete('/contactlist/:id', function(req, res) {
	var id = req.params.id;
	console.log(id);
	db.contactlist.remove({_id: mongojs.ObjectId(id)}, function (err, doc){
		res.json(doc);
	})
});

app.get('/contactlist/:id', function(req, res) {
	var id = req.params.id;
	console.log(id);
	db.contactlist.findOne({_id: mongojs.ObjectId(id)}, function(err, doc) {
		res.json(doc);
	});
});

app.put('/contactlist/:id', function(req, res) {
	var id = req.params.id;
	console.log('EDIT REQUEST: ');
	console.log(req.body.name);
	db.contactlist.findAndModify({query: {_id: mongojs.ObjectId(id)},
		update: {$set: {name: req.body.name, email: req.body.email, number: req.body.number, favorite: req.body.favorite, group: req.body.group}},
		new: true}, function (err, doc) {
			res.json(doc);
		});
});

app.listen(3000);
console.log("Server running on port 3000");