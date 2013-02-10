Twitter Bootstrap Ajax Form Validator
===================
Plugin for forms validation throught ajax. Can be used without bootstrap.

### Libraries required 
* jquery.js // tested with jquery-1.8.3.min.js

### Usage
```html
<form action="/user/login" method="post" class="form-horizontal ajax-form">
      <div class="control-group">                         
          <input type="text" name="username" class="span12" placeholder="Email" />
      </div>
      <div class="control-group">                  
          <input type="password" name="password" class="span12" placeholder="Password" />    
      </div>        
      <div class="control-group">          
          <button type="submit" name="submit-form" class="btn btn-primary">Login</button>    
      </div>    
</form>
<script>
  $('form.ajax-form').form();  
</script>
```

### Parameters
Parameters can be set with data attribute or can be passed throught params

```html
<script>
$('form.ajax-form').form({
    /**
     * Will be called on success validation
     */
    success: function (data) {
        $(this).trigger('submit.success')
    }, 
    /**
     * Called after failed form validation
     * @return bool true to prevent displaying errors
     **/
    fail: function (data) {
        // Prevent from displaying errors:
        // return true
    },
    /**
     * Custom function for setting errors
     * @return function for removing this error
     */
    setError: function (name, message) {
        var $parent = $(this).find('[name="'+name+'"]').parents('.control-group').addClass('error')
        var $error = $('<span>').addClass('help-inline').html(message).appendTo($parent)
        return function () {
            $error.remove()
            $parent.removeClass('error')
        }
    },
});  
</script>
```
or via "data-"

```html
<form action="/user/login" method="post" class="form-horizontal ajax-form"
    data-success="window.location.reload()"
    data-fail="alert('fail')"
>
 ...
</form>
```

### Methods

```html
<script>
    // Single field validation
    $('form.ajax-form').form('validate','username');
</script>
```
