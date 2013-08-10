$(function(){
	var clicked = false;
	$('#set_alarm_link, #alarm').click(function(){
		if(clicked == false){
			$('#alarm').html("<input type = 'text' class = 'time'> </input><br/><br/>");		
			$('#set_alarm_link').text("Start");
			clicked = true;
		}
	});
	
	


