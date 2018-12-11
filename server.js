/**
 * Created by http://myeonguni.com on 2016-09-02.
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require("fs")
var mongoose = require('mongoose');

var server = app.listen(3000, function(){
 console.log("Express server has started on port 3000")
});

const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => { console.log('Connected to mongodb server'); });
// mongoose.connect('mongodb://username:password@host:port/database=');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/kakao',{useMongoClient: true});

app.use(bodyParser.urlencoded({
extended: true
}));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
app.use(session({
 secret: '@#@$MYSIGN#@$#$',
 resave: false,
 saveUninitialized: true
}));


var router = require('./router/main.js')(app, fs);
