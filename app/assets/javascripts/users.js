$(function(){
	$(window).resize(function(){
		var o = $('#users_table_heading').offset();
		var table_width = $('#users_table').outerWidth();
		var window_width = $(window).width();
		
		if(window_width > table_width){
			$('#users_table').offset({"top" : $('#users_table').offset().top, "left" : (window_width-table_width)/2});			
		}		

		
	});
	
	$(window).resize();
		
});

