/* ===========================================================
 * bootstrap-form.js v1.0
 * https://github.com/AidasK/Ajax-Form-Validator
 * =========================================================== */

!function ($) {
    "use strict";
    
    var Form = function (element, options) {
        this.init('form', element, options)
    }
    
    Form.prototype = {
        constructor: Form
        
      , init: function (type, element, options) {       
            this.type = type     
            this.$element = $(element)
            this.options = $.extend({}, $.fn[this.type].defaults, {callbackUrl: this.$element.attr('action')}, options, this.$element.data())
            this.errors = {}
            this.requestInProgress = false
            
            this.options.setError = $.proxy(this.options.setError, this.$element[0])
            
            this.$element.on('submit.'+this.type, $.proxy(this.validateAll, this))
        }
        
      , validateAll: function (e) {       
            this.removeErrors()
            this.request(this.$element.serialize(), $.proxy(this.callback, this))     
            e.preventDefault()
        }
        
      , validate: function (field) {
            this.removeError(field)
            var post = {
                singleField: true
            }
            post[field] = this.$element.find('[name="'+field+'"]').val()
            this.request(post, $.proxy(this.singleFieldCallback, this, field))           
        }
        
      , request: function (post, callback) {
            if (this.requestInProgress) return 
            this.requestInProgress = true
            $.post(this.options.callbackUrl, post, callback, this.options.callbackDataType)
             . fail($.proxy(this.requestFail, this))
             . always($.proxy(this.requestAlways, this))
        }
        
      , requestFail: function () {
            console.log("Unexpected error");
        }
      
      , requestAlways: function() {
            this.requestInProgress = false
        }
        
      , callback: function (data, textStatus) {
            if (data == false || data == null || data.length == 0 || typeof data == 'object' && data.formStatus == 'success') {
                this.success(data)
            } else {
                !this.fail(data) && this.setErrors(data)
            }
        }
        
      , singleFieldCallback: function (field, data, textStatus, jqXHR) {
            if (data[field]) this.setError(field, data[field])
        }
        
      , success: function (data) {    
            if (typeof this.options.success == 'string') {
                var fnString = this.options.success
                this.options.success = function (data) {
                    eval(fnString)
                }
            }
            $.proxy(this.options.success, this.$element[0])(data)
        }
        
      , fail: function (data) {
            if (typeof this.options.fail == 'string') {
                var fnString = this.options.fail
                this.options.fail = function (data) {
                    eval(fnString)
                }
            }
            return $.proxy(this.options.fail, this.$element[0])(data)
        }
                
      , setErrors: function (data) {
            $.each(data, $.proxy(this.setError, this))
        }
        
      , setError: function (name, message) {
            this.errors[name] = this.options.setError(name, message)
        }
        
      , removeErrors: function () {
            $.each(this.errors, $.proxy(this.removeError, this))
        }
        
      , removeError: function(name) {
            if (!this.errors[name]) return
            this.errors[name]()
            delete this.errors[name]
        }
    }
    
    /* FORM PLUGIN DEFINITION
     * ========================= */
    
    var old = $.fn.form
    
    $.fn.form = function (option) {
        var args = arguments
        return this.each(function () {
            var $this = $(this)
              , data = $this.data('form')
              , options = $.extend({}, typeof option == 'object' && option)
            if (!data) $this.data('form', (data = new Form(this, options)))            
            if (data[option]) data[option].apply(data, Array.prototype.slice.call(args, 1))
        })
    }

    $.fn.form.defaults = {
        callbackDataType: 'json'
                
      , success: function (data) {
            $(this).trigger('submit.success')
        }
                
      , fail: function (data) {
            // Prevent from displaying errors:
            // return true
        }
        
      , setError: function (name, message) {
            var $parent = $(this).find('[name="'+name+'"]').parents('.control-group').addClass('error')
            var $error = $('<span>').addClass('help-inline').html(message).appendTo($parent)
            return function () {
                $error.remove()
                $parent.removeClass('error')
            }
        }
    }
    
    $.fn.form.Constructor = Form  
    
     /* FORM NO CONFLICT
      * =================== */
      
    $.fn.form.noConflict = function () {
        $.fn.form = old
        return this
    }
    
}(window.jQuery);
