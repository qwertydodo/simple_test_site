var app = (function(app) {

	function ControllerNews(model, view) {
		this.model = model;
		this.view = view;

		this.init();
	}

	ControllerNews.prototype.init = function() {
		var news = this;

		news.initEventHandlers();
		news.displayAllNews();
	};

	ControllerNews.prototype.initEventHandlers = function() {
		var news = this;	

		var onClickContainer = news.onClickContainer.bind(news);
		news.view.container.addEventListener('click', onClickContainer);
	};

	ControllerNews.prototype.onClickContainer = function(e) {
		var news = this, 
			el = e.target;

		if ( el.classList.contains('newsItem_field-header') ) {
			news.displaySingleNews(e);
		} else if ( el.classList.contains('newsItem_button-back') ) {
			news.backAllNews(e);
		} else if ( el.classList.contains('newsItem_button-edit') ) {
			news.editSingleNews(e);	
		}

	};

	ControllerNews.prototype.getSingleNewsId = function(e) {
		return e.target.closest('.newsItem_container').dataset.newsId;
	};

	ControllerNews.prototype.displaySingleNews = function(e) {
		var news = this,
			id = news.getSingleNewsId(e);

		news.model
			.getNews(id)
			.then( function(data) {
				news.view.setSingleNews(data[0]);
			})
			.catch( news.view.showError.bind(news.view) );
	};

	ControllerNews.prototype.displayAllNews = function() {
		var news = this;

		news.model
			.getNews()
			.then( news.view.setAllNews.bind(news.view) )
			.catch( news.view.showError.bind(news.view) );	
	};

	ControllerNews.prototype.backAllNews = function(e) {
		var news = this;

		news.displayAllNews();
	};

	ControllerNews.prototype.editSingleNews = function(e) {
		var news = this,
			id = news.getSingleNewsId(e),
			dlgData = {
				row: null,
				onSubmit: function() {}
			};

		news.model
			.getNews(id)
			.then( function(data) {
				dlgData.row = data[0];
				news.view.showEditDialog(dlgData);
			})
			.catch( news.view.showError.bind(news.view) );
	};

	//Call model validation, when save edited news
	ControllerNews.prototype.validateSingleNews = function() {
		var news = this;
	};

	app.controllers = app.controllers || {};
	app.controllers.News = ControllerNews;

    return app;
    
}) (app || {}) ;