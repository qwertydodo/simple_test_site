window.onload = function() {
	var	container = document.getElementsByTagName('main')[0], 
		modelNews = new app.models.News(),
		viewNews = new app.views.News(container),
		controllerNews = new app.controllers.News(modelNews, viewNews);
};
