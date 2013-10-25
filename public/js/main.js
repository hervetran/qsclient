$(function() {

  $('.ajax').submit(function(e){

    var url = $(this).attr('href');

    alert(dataToSend);

    $.ajax({
      type: "GET",
      url: url,
      success: function(data){
        console.log(data);
      },
      error: function(data){
        console.log(data);
      }
    });

    return false;

  });

});