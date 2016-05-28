var News = require('./news');

module.exports = function(app) {

    app.post('/news', function(req, res, next) { 
        
    });

    app.post('/news/:id', function(req, res, next) { 
        var news = new News({
        	res: res,
        	params: req.body
        });

        news.update(req.params.id);
    });

    app.get ('/news', function(req, res, next) {
        var news = new News({
        	res: res,
        	params: req.query
        });

        news.read();
    });

    app.get ('/news/:id', function(req, res, next) {
         var news = new News({
        	res: res,
        	params: req.query
        });

        news.read(req.params.id);
    });

};

