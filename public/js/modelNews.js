var app = (function(app) {

	function ModelNews() {
		this.fields = {
			header: {
				isRequired: true,
				dataType: 'text'
			},
			dt: {
				isRequired: true,
				dataType: 'dt'
			},
			text: {
				isRequired: true,
				dataType: 'text'
			},
			prevtext: {
				isRequired: true,
				dataType: 'text'
			}
		};
	}

	// Get single or all news by id
	ModelNews.prototype.getNews = function(id) {
		var opts = {
			url: 'news/' + (id ? id : '')
		};

		return app.utils.ajax(opts);
	};

	ModelNews.prototype.validateSingleNews = function(row) {
		var errors = [];

		for 
	};

	app.models = app.models || {};
	app.models.News = ModelNews;

    return app;

}) (app || {}) ;