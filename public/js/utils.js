var app = (function(app) {
	app.utils = app.utils || {};

	var URL_SERVER = 'http://localhost:5000/';
	
	app.utils.ajax = function(data) {
		return new Promise(function (resolve, reject) {
			var opts = {
				type: 'GET',
				dataType: 'json',
				data: {},
				isServer: true
			};

			$.extend(opts, data);

			$.ajax({
				url: (opts.isServer ? URL_SERVER : '') + opts.url,
				type: opts.type,
				dataType: opts.dataType,
				data: opts.data
			}).done(function(res) {
				if (res.error) { reject(res.error); }
				resolve(res.rows || res);
			});

		});
	};

	app.utils.getEditDlg = function(opts) {
		var dlg = {
			closeByBackdrop: false,
            type: BootstrapDialog.TYPE_DEFAULT,
            buttons: [{
                        icon: 'glyphicon glyphicon-send',
                        label: 'Update',
                        autospin: false,
                        action: function(dlg){
                            //dlg.enableButtons(false);
                            //dlg.setClosable(false);
                            opts.onSubmit(dlg);
                        }
                    }, {
                        label: 'Close',
                        action: function(dlg){
                            dlg.close();
                        }
                    }
                ],
            data: opts.data,  
            title: opts.title, 
            message: $(opts.form)
		};

		var dlg = new BootstrapDialog(dlg);

		return dlg;
	};

	//Fill the form by data from server
	app.utils.fillForm = function(form, row) {
		var fields = form.getElementsByClassName('form-field'),
            fieldNm;

        for(var i = 0; i < fields.length; i++) {
            fieldNm = fields[i].name;
            fields[i].value = row[fieldNm] || '';
        }
	};

	//Get data from form fields by class 'form-field'
	app.utils.getFormData = function(form) {
		var fields = form.getElementsByClassName('form-field'),
			fieldNm,
			fieldsValue = {};

		for(var i = 0; i < fields.length; i++) {
            fieldNm = fields[i].name;
            fieldsValue[fieldNm] = fields[i].value;
        }

        return fieldsValue;
	};

	//Create select by opts
	/*
		opts = {
			selectClass: ''
			options: [
				{value: '', text: ''}
			]
		}
	*/
	app.utils.getSelect = function(opts) {
		var select = document.createElement('select'),
			option;

		select.className = opts.selectClass;

		opts.options.forEach( function(optionObj, index) {
			option = document.createElement('option');

			option.innerHTML = optionObj.text;
			option.value = optionObj.value;

			select.appendChild(option);
		});

		return select;
	};
	
	return app;

}) (app || {}) ;