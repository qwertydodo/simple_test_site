var app = (function(app) {

	//Validates fields on form
	function Validator(opts) {
		this.container = opts.container;
		this.errors = [];
	}

	Validator.prototype = {
		checkRequired: function(field, value) {
			var validator = this;

			if (value.toString().trim() === '') {
				validator.errors.push( {field: field, type: 'required'} );
			} 
		},
		showErrors: function() {
			var validator = this;

			validator.errors.forEach( function(error, i) {
				if (error.type === 'required') {
					validator.showRequiredError(error.field, validator.container);
				}
			});
		},
		//Base function to show error. Gets options and builds by them error 
		showFieldError: function(obj) {
			var validator = this,
				opts = {
					el: '',
					msg: '',
					errorClass: ''
				};

			$.extend(opts, obj);

			//Add error message under the input
			var spanError = document.createElement('span'),
				formGroup = opts.el.closest('.form-group');

			spanError.className = 'help-block ' + opts.errorClass;
			spanError.innerHTML = opts.msg;

			opts.el.parentNode.insertBefore(spanError, opts.el.nextSibling);

			//Check, if we've already mark the field as error (in case, when we can show two and more errors)
			if ( opts.el.classList.contains('form-field-error') ) return;

			opts.el.classList.add('form-field-error');

			formGroup.classList.add('has-error');
			
			opts.el.addEventListener('input', function onInput(e) {
				opts.el.removeEventListener('input', onInput);

				spanError.parentNode.removeChild(spanError);
				formGroup.classList.remove('has-error');
			});
		},
		showRequiredError: function(field, container) {
			var validator = this,
				opts = {
					el: validator.container.querySelectorAll('[name="' + field +'"]')[0],
					msg: 'Field could not be empty',
					errorClass: 'error-required'
				};

			validator.showFieldError(opts);			
		},
		clearFormErrors: function() {
			var validator = this,
				spanErrors = Array.prototype.slice.call( validator.container.getElementsByClassName('help-block') ),
				formGroups = Array.prototype.slice.call( validator.container.getElementsByClassName('has-error') ),
				fieldErrors = Array.prototype.slice.call( validator.container.getElementsByClassName('form-field-error') );

			//Remove error messages
			for (var i = 0; i < spanErrors.length; i++) {
				spanErrors[i].parentNode.removeChild(spanErrors[i]);
			}

			//Remove error class around input
			for (i = 0; i < formGroups.length; i++) {
				formGroups[i].classList.remove('has-error');
			}

			//Remove field errors
			for (i = 0; i < fieldErrors.length; i++) {
				fieldErrors[i].classList.remove('form-field-error');
			}

			validator.errors = [];
		}
	};

	app.Validator = Validator || {};

	return app;

}) (app || {}) ;