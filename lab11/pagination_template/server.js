var express = require('express');
var app = express();
var session = require('cookie-session');
var assert = require('assert');
var mongourl = 'mongodb://localhost:27017/test';

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

app.use(session({
  name: 'session',
  keys: ['key1','key2'],
  maxAge: 5 * 60 * 1000
}));

app.set('view engine', 'ejs');

app.get("/list", function(req,res) {
	var items = [];
	MongoClient.connect(mongourl, function(err, db) {
    assert.equal(err,null);
    console.log('Connected to MongoDB\n');
      no = req.session.no = (req.session.no >= 0)? req.session.no += 10:0;
          console.log(no);
      db.collection('items').find().skip(no).limit(10).toArray(function(err,results) {
        if (err) {
          console.log(err);
        } else {
          db.close();
	  //req.session.nvisit = (req.session.nvisit >= 0) ? req.session.nvisit += 1 : 1;
	  
	  //rf = req.session.first = (req.session.first >= 0
// && req.session.first <= results.length) ? req.session.first +=10:0;
	  //rl = req.session.final = (req.session.first >= 10
// && req.session.first <= results.length) ? req.session.final +=10:10;
	  
          res.render('list',{'items':results});
	  
        }
      });
	});
});


app.get('/out', function(req,res) {
  req.session = null;
  res.redirect('/list');
})

app.listen(process.env.PORT || 8099);
