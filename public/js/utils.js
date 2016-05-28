var app = (function(app) {
	app.utils = app.utils || {};

	var URL_SERVER = 'http://localhost:5000/';
	
	app.utils.ajax = function(opts) {
		return new Promise(function (resolve, reject) {
			var def = {
				type: 'GET',
				dataType: 'json',
				data: {},
				isServer: true
			};

			$.extend(def, opts);

			$.ajax({
				url: (def.isServer ? URL_SERVER : '') + def.url,
				type: def.type,
				dataType: def.dataType,
				data: def.data
			}).done(function(data) {
				if (data.error) { reject(data.error); }
				resolve(data.rows || data);
			});

		});
	};

	app.utils.getEditDlg = function(opts) {
		var def = {
			closeByBackdrop: false,
            type: BootstrapDialog.TYPE_DEFAULT,
            buttons: [{
                        icon: 'glyphicon glyphicon-send',
                        label: 'Update',
                        autospin: true,
                        action: function(dlg){
                            dlg.enableButtons(false);
                            dlg.setClosable(false);
                            //opts.onSubmit();
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

		var dlg = new BootstrapDialog(def);

		return dlg;
	};

	app.utils.fillForm = function(form, row) {
		var fields = form.getElementsByClassName('form-field'),
            fieldNm;

        for(var i = 0; i < fields.length; i++) {
            fieldNm = fields[i].name;
            fields[i].value = row[fieldNm] || '';
        }
	};

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

	app.utils.addErrorFieldForm = function(opts) {

	};	
	
	return app;

}) (app || {}) ;