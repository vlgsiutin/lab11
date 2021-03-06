var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var fileUpload = require('express-fileupload');

var SECRETKEY = 'I want to pass COMPS381F';

app.use(fileUpload());
app.use(bodyParser.json());
app.use(session({
	secret: SECRETKEY,
	resave: true,
	saveUninitialized: true
}));


var products = [
	{name: 'Apple iPad Pro', stock: 100, price: 7000, id:'001'},
	{name: 'Apple iPhone 7', stock: 50, price: 7800, id:'002'},
	{name: 'Apple Macbook', stock: 70, price: 11000, id: '003'}
];

var shoppingCart = [];

app.set('view engine', 'ejs');

app.get("/read", function(req,res) {
	res.render("list", {c: products});
});

app.get('/showdetails', function(req,res) {
	if (req.query.id != null) {
		for (var i=0; i<products.length; i++) {
			if (products[i].id == req.query.id) {
				var product = products[i];
				break;
			}
		}
		if (product != null) {
			res.render('details', {c: product});
		} else {
			res.status(500).end(req.query.id + ' not found!');
		}
		req.session.id = req.query.id;
	} else {
		res.status(500).end('id missing!');
	}
});

app.get('/shoppingcart', function(req,res) {
	res.render("shoppingcart", {c: shoppingCart});
});

app.get('/add2cart', function(req,res) {
	//console.log(req.session.id);
	if (req.query.id != null) {
		for (var i=0; i<products.length; i++) {
			if (products[i].id == req.query.id) {
				var product = products[i];
				if (product.qty != null)
					product.qty += 1;
				else
					product.qty = 1;
				break;
			}
		}
		if (product != null) {
			if (shoppingCart.length == 0){
				console.log("push?");
				shoppingCart.push(product);
			}else {
				for (var i=0; i<shoppingCart.length; i++){
					if (shoppingCart[i].id != req.query.id)
						shoppingCart.push(product);
				}
			}
			console.log(shoppingCart);
			res.redirect('/shoppingcart');
		} else {
			res.status(500).end(req.query.id + ' not found!');
		}
	} else {
		res.status(500).end('id missing!');
	}
	
	//res.end('coming soon!')
});

app.get('/emptycart',function(req,res) {
	shoppingCart = [];
	res.redirect("/shoppingcart");
});


app.listen(process.env.PORT || 8099);
