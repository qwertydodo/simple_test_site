var dataNews = require('./news.json'),
	fs = require('fs');

function News(opts) {
	this.res = opts.res;
	this.params = opts.params;
}

News.prototype.read = function(id) {
	var news = this,
		out = { rows: [] };

	if (id) { 
		out.rows.push(news.getRowById(id));
	} else {
		out.rows = news.getRows();
	}

	news.response(out); 
};

News.prototype.update = function(id) {
	var news = this;

	var newsItem = dataNews[id-1];

	newsItem.header = news.params.header;
	newsItem.prevText = news.params.prevText;
	newsItem.text = news.params.text;
	newsItem.dt = news.params.dt;

	fs.writeFileSync('./news.json', JSON.stringify(dataNews));

	news.response({
		status: true,
		msg: 'Edited successful id = ' + id
	});
};


News.prototype.getRowById = function(id) {
	var news = this;

	return dataNews[id-1] || {};

};

News.prototype.getRows = function() {
	return dataNews;
};

News.prototype.response = function(data) {
	var news = this;

	news.res.status(200).json(data);
};

module.exports = News;

/*var news = new News({
	params: {
		header: 'header1',
		text: 'tex1t',
		dt: '11.11.2012'
	}
});*/
