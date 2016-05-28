var express = require('express'),
	app = express(),
	routes = require('./routes'),
	cors = require('cors'),
	PORT = 5000;

app.use(cors());
routes(app);


app.listen(PORT, function() {
	console.log('Server started on port with cors: ' + PORT);
});