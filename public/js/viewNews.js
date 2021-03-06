var app = (function(app) {


    function ViewNews(container) {
        this.container = container;
    }

    ViewNews.prototype.setAllNews = function(rows) {
        var news = this,
            dataManagerPanel = news.container.getElementsByClassName('newsListContainer')[0],
            newsListContainer =  news.container.getElementsByClassName('newsListContainer')[0];

        // if doesn't exist dataManagerPaner - add
        if (!dataManagerPanel) {
            news.container.appendChild( news.getElementDataManagerPanel());
        }

        //If exists list with news - remove
        if (newsListContainer) {
           newsListContainer.parentNode.removeChild(newsListContainer);
        }
        //Add list with news
        news.container.appendChild( news.getElementListNews(rows) );
    };

    /*
        obj = {
            row: row,
            tag: 'article',
            isFullText: true
        };
    */
    ViewNews.prototype.getElementSingleNews = function(newsData) {
        var news = this,
            el = document.createElement(newsData.tag),
            row = newsData.row,
            newsItemHtml = '';
        
        el.className = 'newsItem_container clearfix';
        el.dataset.newsId =  row.id;

        newsItemHtml = 
            '<div class="newsItem_img">' +
                '<img src="media/img/' + row.img + '">' +
            '</div>' +
            '<div> <h1 class="newsItem_field newsItem_field-header">' + row.header + '</h1> </div>' +
            '<div>' +
            '      <span class="newsItem_field newsItem_field-dt text_caption">' + row.dt + '</span> ' + 
            '      <span class="newsItem_field newsItem_field-category tag_default">' + row.category + '</span> ' +
            '</div>'  + 
            '<div> <span class="newsItem_field newsItem_field-text">' + (newsData.isFullText ? row.text : row.prevtext) + '</span> </div>'
        ; 

        el.innerHTML = newsItemHtml;

        return el;
    };

    //Get ul with list of news rows
    ViewNews.prototype.getElementListNews = function(rows) {
        var news = this,
            ul = document.createElement('ul'),
            newsData = {
                tag: 'li',
                isFullText: false
            }; 

        ul.className = 'newsListContainer';

        rows.forEach( function(row, i) {
            newsData.row = row;
            ul.appendChild( news.getElementSingleNews(newsData) );
        });

        return ul;
    };

    //Display buttons such as "Back", "Edit NEws"
    ViewNews.prototype.getElementActionButtons = function() {
        var news = this,
            container = document.createElement('div'),
            buttonBack = document.createElement('button'),
            buttonEdit = document.createElement('button');

        container.className = 'newsItem_actions';

        buttonBack.className = 'newsItem_button-back btn btn-default';
        buttonBack.innerHTML = 'Back';

        buttonEdit.className = 'newsItem_button-edit btn btn-default';
        buttonEdit.innerHTML = 'Edit';

        container.appendChild(buttonBack);
        container.appendChild(buttonEdit);

        return container;
    };

    //Display page with single news
    ViewNews.prototype.setSingleNews = function(row) {
        var news = this,
            newsData = {
                row: row,
                tag: 'article',
                isFullText: true
            };
        
        news.clearContainer();

        var article = news.getElementSingleNews(newsData);
        article.appendChild( news.getElementActionButtons() );

        news.container.appendChild( article );
    };

    //Display edit news dialog
    ViewNews.prototype.showEditDialog = function(dlgData) {
        var news = this,
            dlgOpts = {
                data: { id: dlgData.row.id },
                title: 'Edit news',
                form: null,
                onSubmit: dlgData.onSubmit
            },
            dlg;

        dlg = app.utils.getEditDlg(dlgOpts);

        news.getElementEditDialogContent(dlgData.row)
            .then(function(form) {
                dlg.setMessage(form);
                dlg.open();
            })
            .catch( news.showError.bind(news) );
    };

    ViewNews.prototype.clearContainer = function() {
        var news = this;

        news.container.innerHTML = '';
    };

    //Get edit news tempalte from server and fill by news data
    ViewNews.prototype.getElementEditDialogContent = function(row, cb) {
        var news = this,
            form = document.createElement('div'),
            ajaxOpts = {
                url: 'view/editNewsDlg.html',
                dataType: 'html',
                isServer: false
            };

        form.className = 'newsItem_form';

        return app.utils
            .ajax(ajaxOpts)
            .then(function(html) {
                form.innerHTML = html;
                app.utils.fillForm(form, row);

                return form;
            });
    };

    ViewNews.prototype.getElementDataManagerPanel = function() {
        var news = this,
            container = document.createElement('div'),
            filter = news.getElementFilter(),
            order = news.getElementOrder();

        container.className = 'newsDataManager_container';

        container.appendChild(filter);
        container.appendChild(order);

        return container;
    };

    ViewNews.prototype.getElementOrder = function() {
        var news = this,
            fragment = document.createDocumentFragment(),
            span = document.createElement('span'),
            select,
            opts = {};

        span.innerHTML = 'Order By';

        opts = {
            selectClass: 'newsDataManager_order',
            options: [
                { value: 'none', text: 'None' },
                { value: 'dt_asc', text: 'Ascending Date' },
                { value: 'dt_desc', text: 'Descending Date' },
            ]
        };
           
        select = app.utils.getSelect(opts); 

        fragment.appendChild(span);
        fragment.appendChild(select);

        return fragment;
    };

    ViewNews.prototype.getElementFilter = function() {
        var news = this,
            fragment = document.createDocumentFragment(),
            span = document.createElement('span'),
            select,
            opts = {};

        span.innerHTML = 'Filter by';

        opts = {
            selectClass: 'newsDataManager_filter',
            options: [
                { value: 'none', text: 'None' },
                { value: 'category_music', text: 'Music' },
                { value: 'category_sport', text: 'Sport' },
                { value: 'category_social', text: 'Social' }
            ]
        };

        select = app.utils.getSelect(opts); 

        fragment.appendChild(span);
        fragment.appendChild(select);

        return fragment;
    };


    //the kind of common error, overlay the screen
    ViewNews.prototype.showError = function(data) {
        alert(data);
    };

    app.views =  app.views  || {};
    app.views.News = ViewNews;

    return app;
}) (app || {}) ;