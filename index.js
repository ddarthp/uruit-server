var express = require('express'),
	cors = require('cors'),
	app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator'),
	http = require('http'),
	request = require('request'),
    qs = require('querystring'),
    path = require('path'),
    _ = require('lodash');



//main Configuration
var config = require('./config');
// import models
Games = require('./models/gameModel');
Players = require('./models/playerModel');

mongoose.Promise = global.Promise;
// let conn_string = config.database.db+"?authSource="+config.database.auth.auth_db;
let conn_string = config.database.db;
console.log(conn_string);
mongoose.connect(conn_string);

// WEB API
// =============================================================================
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true, limit:'99mb' }));
app.use(bodyParser.json({limit:'99mb'}));
app.use(expressValidator({
	customValidators:{
		objectExists: (input, object) => {
			if( typeof input[object] !== 'undefined' ) {
				return true;
			}
			return false;
		}
	}
}));
// use morgan to log requests to the console
app.use(morgan('dev'));

// view engine setup for statics
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

var routes = require('./routes');
routes(app);

app.use(express.static(__dirname + '/public'));

app.use(function(req, res) {
	res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);
console.log('uruIT game webServices starts at port: ' + port);
