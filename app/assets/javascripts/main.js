// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/




/* $(function(){
  if($('#wrapper').find("div.uneditable-input").length!=0){
  $('.btn-file').css("width", "60").children().css({"height" : "20", "width" : "60"});
  $('.btn-file > input').css({"width" : $('span.btn-file').outerWidth()}).offset({left : $('span.btn-file').offset().left});  
  }

 });

*/


$(function(){
  
  $('#form_post_container > input').on("click", function(event){
    var text = $('span.fileupload-preview').text();
    if(text.match(/jpe?g|png/) == null && text.length != 0){
      event.preventDefault(); 
      $('a.fileupload-exists').click();
      if($('#img_error').length==0){
        $('#file_upload').before("<p class = 'form_error' id = 'img_error'>Make sure your picture is a png, jpg, or jpeg file. Click to Dismiss.<br/></p>");
        $('#photo_div').errorHighlight();               
      }
      else{
        $('#img_error').show();
      }
      
    }  
})

});



$(function(){
  $.watermark.options.className = 'watermark';  
  $.watermark.options.useNative = false;
  $('#content_title').watermark("Title");
  
  });
  
$(function(){
  var offset = $('#dropdown_link').offset();
  $('.dropdown-menu').offset({"left" : offset.left});
});

	





