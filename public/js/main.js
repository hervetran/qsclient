var qs = {
  displayError: function(error){
    var alert = '<div class="alert alert-block alert-danger fade in"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><h4>Error !</h4><p>'+error+'</p></div>';
    $('body').children('.container').prepend(alert);
    $('html,body').animate({
      scrollTop: $('body').offset().top
    },'slow');
  }
};

$(function() {

  $('body').on('click', '.qs-confirmation', function () {
    return confirm('Are you sure?');
  });

  $('body').on('click', 'a.qs-delete', function (e) {
    e.preventDefault();
    var self = $(this);
    var url = $(this).attr('href');
    $.ajax({
      url: url,
      type:'POST',
      data: {},
      success: function(data) {
        self.closest('.qs-item').fadeOut(function(){
           $(this).remove();
        });
      },
      error: function(data) {
        var data = JSON.parse(data.responseText);
        if(typeof data.error !== 'undefined'){
          qs.displayError(data.error);
        }
      }
    });
  });

  $('form.qs-submit').on('submit', function (e) {
    var self = $(this);
    var url = $(this).attr('action');
    var dataToSend = self.serialize();
    $.ajax({
      url: url,
      type:'POST',
      data: dataToSend,
      success: function(data) {
        $('.qs-item-container').append(data);
      },
      error: function(data) {
        var data = JSON.parse(data.responseText);
        if(typeof data.error !== 'undefined'){
          qs.displayError(data.error);
        }
      }
    });
    return false;
  });

});