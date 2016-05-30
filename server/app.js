var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	routes = require('./routes'),
	cors = require('cors'),
	PORT = 5000;

app.use( cors() );
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

routes(app);


app.listen(PORT, function() {
	console.log('Server started on port with cors: ' + PORT);
});