$('#keywords').on('focus',function () {
	if($(this).val() == $(this).attr('placeholder')){
		$(this).val('')
	}
	$(this).parent('div').css({'borderColor':'#00B2EE','boxShadow':'0 0 5px #00B2EE','transition':'all .3s'})
})
$('#keywords').on('blur',function () {
	$(this).parent('div').css({'borderColor':'#E2E2E2','boxShadow':'none'});
	if($(this).val().length == 0){
		$(this).val($(this).attr('placeholder'))
	}
})
$(document).on('click','.searchBtn',function(){
	window.keywords = $('#keywords').val();
	if(keywords.length == 0 || keywords == $('#keywords').attr('placeholder')){
		return alertMsg('查询内容不能为空')
	}
	$.ajax({
		type:'post',
		url:'/Promoter/blacklist',
		data:{'info':keywords},
		beforeSend:function(){
			$('.mask,.showL').show();
			$('.results').html('')			
		},
		complete:function(){
			$('.mask,.showL').hide();
		},
		success: function (data) {
			if(data.status == 1){
				var  str ='<p>店铺ID:'+data.msg.id+'</p><p>店铺名:'+data.msg.name+'</p><p>卖家ID:'+data.msg.seller_id+'</p><p>卖家名:'+data.msg.seller_name+'</p><p>店铺链接:<a onclick = "window.open(\''+data.msg.shop_url+'\')">'+data.msg.shop_url+'</a></p><p>拉黑原因:'+data.msg.reason+'</p>';
				$('.results').html(str);
			}else{
				alertWMsg('该商户不存在或该商户不在黑名单内');
			}
		},
		error: function () {
			alertWMsg('连接超时,请稍后再试')
		}
	})
})