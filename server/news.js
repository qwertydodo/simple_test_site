var fs = require('fs');

function News(opts) {
	this.res = opts.res;
	this.params = opts.params;
	this.dataNews = require('./news.json');
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
	var news = this,
		index = news.getRowIndexById(id);

	var newsItem = news.dataNews[index];

	newsItem.header = news.params.header;
	newsItem.prevtext = news.params.prevtext;
	newsItem.text = news.params.text;
	newsItem.dt = news.params.dt;

	fs.writeFileSync('./news.json', JSON.stringify(news.dataNews));

	news.response({
		status: true,
		msg: 'Edited successful id = ' + id
	});
};


News.prototype.getRowById = function(id) {
	var news = this,
		index = news.getRowIndexById(id);

	return news.dataNews[index];

};

News.prototype.getRows = function() {
	var news = this;

	if (news.params.order) {
		news.orderData();
	}
	if (news.params.filter) {
		news.filterData();
	}

	return news.dataNews;
};


// Order data by field
// Only for date now
News.prototype.orderData = function() {
	var news = this,
		type = news.params.order.type,
		field = news.params.order.field;

	if (type === 'desc' && field === 'dt') {
		news.dataNews.sort(function(a, b) {
			return new Date(b.dt) - new Date(a.dt);
		});
	} else if (type === 'asc' && field === 'dt') {
		news.dataNews.sort(function(a, b) {
			return new Date(a.dt) - new Date(b.dt);
		});
	} 
};

News.prototype.filterData = function() {
	var news = this,
		field = news.params.filter.field,
		value = news.params.filter.value;

	news.dataNews = news.dataNews.filter(function(singleNews) {
		return singleNews[field] === value;
	});
};


News.prototype.getRowIndexById = function(id) {
	var news = this;

	for (var i = 0; i < news.dataNews.length; i++) {
		if (news.dataNews[i].id == id) {
			return i;
		}
	}
};

News.prototype.response = function(data) {
	var news = this;

	news.res.status(200).json(data);
};

module.exports = News;

/*var news = new News({
	params: {
		order: {
			field: 'dt',
			type: 'asc'
		}
	}
});

console.log( news.getRowIndexById(5) );*/
