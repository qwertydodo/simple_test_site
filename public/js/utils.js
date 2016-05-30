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

		var dlg = new BootstrapDialog(def);

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

	app.utils.validator = {
		//if error - return object with error
		checkRequired: function(field, value) {
			if (value.toString().trim() === '') {
				return {field: field, type: 'required'};
			} else {
				return false;
			}
		},
		showErrors: function(errors, container) {
			errors.forEach( function(error, i) {
				if (error.type === 'required') {
					app.utils.validator.showRequiredError(error.field, container);
				}
			});
		},
		//Base function to show error. Gets options and builds by them error 
		showFieldError: function(obj) {
			var opts = {
				el: '',
				msg: '',
				errorClass: ''
			};

			$.extend(opts, obj);

			var spanError = document.createElement('span'),
				formGroup = opts.el.closest('.form-group');

			spanError.className = 'help-block ' + opts.errorClass;
			spanError.innerHTML = opts.msg;

			opts.el.parentNode.insertBefore(spanError, opts.el.nextSibling);

			formGroup.classList.add('has-error');

			opts.el.addEventListener('input', function onInput(e) {
				spanError.parentNode.removeChild(spanError);
				formGroup.classList.remove('has-error');

				opts.el.removeEventListener('input', onInput);
			});
		},
		showRequiredError: function(field, container) {
			var opts = {
				el: container.querySelectorAll('[name="' + field +'"]')[0],
				msg: 'Field could not be empty',
				errorClass: 'error-required'
			};

			app.utils.validator.showFieldError(opts);			
		},
		clearFormErrors: function(container) {
			var spanErrors = Array.prototype.slice.call( container.getElementsByClassName('help-block') ),
				formGroups = Array.prototype.slice.call( container.getElementsByClassName('has-error') ),
				length;

			//Remove error messages
			for (var i = 0; i < spanErrors.length; i++) {
				spanErrors[i].parentNode.removeChild(spanErrors[i]);
			}

			//Remove error class around input
			for (i = 0; i < formGroups.length; i++) {
				formGroups[i].classList.remove('has-error');
			}
		}
	};
	
	return app;

}) (app || {}) ;