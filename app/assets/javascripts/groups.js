$(function(){

	$('a[href="#group_content_pane"]').click(function(){
		window.setTimeout(function(){
			$(window).resize();
		}, 10);
	});
	
});