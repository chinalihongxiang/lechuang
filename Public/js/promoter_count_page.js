$(function(){
	$('#selectType').chosen({
		disable_search:true
	}).change(function(){
	var type = $(this).val();
	switch(type)
	{
		case '0':
			type = 'item_sum';
			break;
		case '1':
			type = 'take_sum';
			break;
		case '2':
			type = 'sale_sum';
			break;
		case '3':
			type = 'roc_avg';
			break;	
		default:
			return alertMsg('选择排序方式时发生错误,请刷新页面后重试')
			break;
	}
	coutLoad(type);
});;
	$(".contentShowDivUl").niceScroll({
		cursorcolor:"#00B2EE",
		cursoropacitymax:1,
		hwacceleration:true,
		touchbehavior:false,
		sensitiverail:true,
		hidecursordelay:1000,
		bouncescroll:true,
		cursorwidth:"5px",
		cursorborder:"0",
		cursorborderradius:"5px",
		spacebarenabled:true,
	});
	coutLoad ('item_sum');
})
function coutLoad (type){
	$.ajax({
		type:'post',
		url:'/seller/promoter_count',
		data:{type:type},
		beforeSend:function(){
			$('.mask').show();
			$('.showL').show();
		},
		complete: function(){
			$('.mask').hide();
			$('.showL').hide();
		},
		success:function(data){
			if(data.status == 1){
				var str = '';
				$(data.data).each(function(i,e){
					str +='<ul><li>'+(i+1)+'</li><li><a href="promoter_detail_page.html?promoter_id='+e.promoter_id+'">'+e.promoter_name+'</a></li><li>'+e.promoter_qq+'</li><li>'+e.item_sum+'</li><li>'+e.take_sum+'</li><li>'+e.sale_sum+'</li><li>'+e.roc_avg+'%</li></ul>';
				})
				$('.contentShowDivUl').html(str);                   
			}else{
				alertWMsg(data.msg)
			}
		},
		error:function(){alertWMsg('链接超时,请稍后再试')}
		
	})
}