$('.slideShowBtn').on('click',function(){
	if($(".bottomSilde").is(":hidden")){
		return $('.bottomSilde').slideDown(200);
	}
	$('.bottomSilde').slideUp(200);
})