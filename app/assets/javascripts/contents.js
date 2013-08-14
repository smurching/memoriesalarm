$(function(){
	$(window).resize(function(){
		var o = $('#contents_table_heading').offset();
		var table_width = $('#contents_table').outerWidth();
		var window_width = $(window).width();
		
		if(window_width > table_width){
			$('#contents_table').offset({"top" : $('#contents_table').offset().top, "left" : (window_width-table_width)/2});			
		}		

		
	});
	
	$(window).resize();
		
});

