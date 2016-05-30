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

		this.url = 'news';
	}

	// Get single by id news or all news
	ModelNews.prototype.getNews = function(data) {
		var news = this;
		data = data || {};
		
		var opts = {
			url: news.url + '/' + (data.id ? data.id : ''),
			data: data
		};

		return app.utils.ajax(opts);
	};

	ModelNews.prototype.validateSingleNews = function(fieldValues, validator) {
		var news = this,
			error,
			errors = [];

		for (var field in fieldValues) {
			if (news.fields[field] && news.fields[field].isRequired) {	
				validator.checkRequired(field, fieldValues[field]);
			}
		}
	};

	ModelNews.prototype.updateSingleNews = function(id, fields) {
		var news = this,
			opts = {
				url: news.url+ '/' + id,
				type: 'POST',
				data: fields
			};

		return app.utils.ajax(opts);
	};

	app.models = app.models || {};
	app.models.News = ModelNews;

    return app;

}) (app || {}) ;