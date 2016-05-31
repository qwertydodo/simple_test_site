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

		var onChangeContainer = news.onChangeContainer.bind(news);
		news.view.container.addEventListener('change', onChangeContainer);
	};

	//Delegate events 
	ControllerNews.prototype.onClickContainer = function(e) {
		var news = this, 
			el = e.target;

		if ( el.classList.contains('newsItem_field-header') ) {
			news.displaySingleNews( news.getSingleNewsIdFromEvent(e) );
		} else if ( el.classList.contains('newsItem_button-back') ) {
			news.backAllNews( news.getSingleNewsIdFromEvent(e) );
		} else if ( el.classList.contains('newsItem_button-edit') ) {
			news.editSingleNews( news.getSingleNewsIdFromEvent(e) );	
		} 

	};

	ControllerNews.prototype.onChangeContainer = function(e) {
		var news = this, 
			el = e.target;

		if ( el.classList.contains('newsDataManager_order') || el.classList.contains('newsDataManager_filter') ) {
			news.manageData();
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

	//display all news, maybe with filters/order
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

	//Get setting for filtering and sorting and send to server
	ControllerNews.prototype.manageData = function() {
		var news = this,
			order = news.getOrderBy(),
			filter = news.getFilterBy(),
			ajaxData = {};

		ajaxData.order = order;
		ajaxData.filter = filter;

		news.displayAllNews({params: ajaxData});
	};

	ControllerNews.prototype.getOrderBy = function() {
		var news = this,
			select = news.view.container.getElementsByClassName('newsDataManager_order')[0],
			orderData = [], //[0] - field, [1] - type; example dt_asc
			orderAjax = {};

		orderData = select.value.split('_');
		
		orderAjax = {
			field: orderData[0],
			type: orderData[1]
		};

		return orderAjax;	
	};

	ControllerNews.prototype.getFilterBy = function() {
		var news = this,
			select = news.view.container.getElementsByClassName('newsDataManager_filter')[0],
			filterData = [], //[0] - field, [1] - valuel; example category_news
			filterAjax = {};

		filterData = select.value.split('_');

		filterAjax = {
			field: filterData[0],
			value: filterData[1]
		};

		return filterAjax;		
	};

	app.controllers = app.controllers || {};
	app.controllers.News = ControllerNews;

    return app;
    
}) (app || {}) ;