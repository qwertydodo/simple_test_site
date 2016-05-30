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
			news.displaySingleNews( news.getSingleNewsIdFromEvent(e) );
		} else if ( el.classList.contains('newsItem_button-back') ) {
			news.backAllNews( news.getSingleNewsIdFromEvent(e) );
		} else if ( el.classList.contains('newsItem_button-edit') ) {
			news.editSingleNews( news.getSingleNewsIdFromEvent(e) );	
		} else if ( el.classList.contains('newsList_order-item') ) {
			news.orderBy(e.target);
		}

	};

	ControllerNews.prototype.getSingleNewsIdFromEvent = function(e) {
		return e.target.closest('.newsItem_container').dataset.newsId;
	};

	ControllerNews.prototype.displaySingleNews = function(id) {
		var news = this;

		news.model
			.getNews({id: id})
			.then( function(data) {
				news.view.setSingleNews(data[0]);
			})
			.catch( news.view.showError.bind(news.view) );
	};

	//display all news , maybe with filters
	ControllerNews.prototype.displayAllNews = function(data) {
		var news = this;

		news.model
			.getNews(data)
			.then( function(data) {
				news.view.setAllNews(data);
			})
			.catch( news.view.showError.bind(news.view) );	
	};

	ControllerNews.prototype.backAllNews = function(e) {
		var news = this;

		//Have to clear, because actually come to other page
		news.view.clearContainer();
		news.displayAllNews();
	};

	ControllerNews.prototype.editSingleNews = function(id) {
		var news = this,
			dlgData = {
				row: null, //news data
				onSubmit: news.onSubmitEditSingleNews.bind(news)
			};

		news.model
			.getNews({id: id})
			.then( function(data) {
				dlgData.row = data[0];
				news.view.showEditDialog(dlgData);
			})
			.catch( news.view.showError.bind(news.view) );
	};

	ControllerNews.prototype.onSubmitEditSingleNews = function(dlg) {
		var news = this,
			container = dlg.getModalBody()[0],
			data = app.utils.getFormData(container),
			id = dlg.getData('id'),
			errors;

			news.validator = news.validator || new app.Validator({container: container});

			news.validator.clearFormErrors();

			news.model.validateSingleNews(data, news.validator);

			if (news.validator.errors.length) {
				news.validator.showErrors();
				dlg.enableButtons(true);
                dlg.setClosable(true);
			} else {
				news.model
					.updateSingleNews(id, data)
					.then(function() {
						dlg.close();
						news.displaySingleNews(id);
					}).catch(function(err) {
						news.view.showDlgError(err);
					});
			}
	};

	//Call model validation, when save edited news
	ControllerNews.prototype.validateSingleNews = function() {
		var news = this;
	};

	ControllerNews.prototype.orderBy = function(el) {
		var news = this,
			data = {};



	};

	app.controllers = app.controllers || {};
	app.controllers.News = ControllerNews;

    return app;
    
}) (app || {}) ;