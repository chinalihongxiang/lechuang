getpromoterId(couponLoad);  
function couponLoad(){
	$(".contentShowDivBottom").niceScroll({
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
	$('.contentShowDivTop .input').on('focus',function () {
		if($(this).val() == $(this).attr('placeholder')){
			$(this).val('')
		}
		$(this).parent('div').css({'borderColor':'#00B2EE','boxShadow':'0 0 5px #00B2EE','transition':'all .3s'})
	})
	$('.contentShowDivTop .input').on('blur',function () {
		if($(this).val().length == 0){
			$(this).val($(this).attr('placeholder'))
		}
		$(this).parent('div').css({'borderColor':'#E2E2E2','boxShadow':'none'})
	})
	window.p = 1;
	load(p);
}
function load(n){
		$.ajax({
		type:'post',
		url:'/promoter/search_item',
		data:{promoter_id:window.localStorage.promoterId,p:n},
		beforeSend:function(){$('.mask,.showL').show();},
		success:function(data){
			if(data.status == 1){
				$('.mask,.showL').hide();
				var str = '<table><tr><td>优惠券金额</td><td>状态</td><td>任务结束时间</td><td>已领取</td><td>商品名称</td><td>销量增量</td><td>转化率</td></tr>';
				if(data.data.coupon_list.length > 0){
					$(data.data.coupon_list).each(function(i,e){
						str +='<tr><td><a onclick="window.open(\''+e.coupon_link+'\')">'+e.price+'元</a></td><td>'+e.status+'</td><td>'+e.end_time+'</td><td>'+e.take_num+'</td><td><a onclick="window.open(\''+e.link+'\')">'+e.item_name.substr(0,15)+'</a></td><td>'+e.sale+'</td><td>'+e.roc+'%</td></tr>'
					})				
				}else{
					str +='<tr><td>暂无数据</td><td>暂无数据</td><td>暂无数据</td><td>暂无数据</td><td>暂无数据</td><td>暂无数据</td><td>暂无数据</td></tr>';
				}
				str +='</table>';
				$('.contentShowDivBottom').html(str)
				var totalPage = Math.ceil(data.data.count/data.data.p_size);
				var totalRecords = data.data.count;
				var pageNo = data.data.p;				
				kkpager.generPageHtml({
					pno : pageNo,
					//总页码
					total : totalPage,
					//总数据条数
					totalRecords : totalRecords,
					isGoPage:false,
					isShowTotalPage:false,
					isShowCurrPage:false,
					mode : 'click',//默认值是link，可选link或者click
					click : function(n){
						window.p = n;	
						this.selectPage(n);
						load(p);
						return false;
					}
				})
			}else{
				$('.showL').hide();
				alertWMsg(data.msg);
			}
		},
		error:function(){
			$('.showL').hide();
			alertWMsg('连接超时,请稍后再试');
		}		
	})
}
$(document).on('click','.addBtn',function(){
	window.couponLink = $('#couponLink').val();
	window.couponNum = $('#couponNum').val();
	if(couponLink.length == 0){
		return alertMsg('优惠券链接不能为空')
	}else if(!checkCouponUrl(couponLink)){
		return alertMsg('您上传的优惠券链接中必须存在 "sellerId"和"activityId" ')		
	}
	if(couponNum.length == 0){
		return alertMsg('领取数量不能为空')
	}else if(!ShopId(couponNum)){
		return alertMsg('领取数量只能为大于0的数字的组合')
	}
	$.ajax({
		type:'post',
		url:'/promoter/new_task',
		data:{promoter_id:window.localStorage.promoterId,coupon_link:couponLink,taks_num:couponNum},
		beforeSend:function(){$('.mask,.showL').show();},
		success:function(data){
			$('.showL').hide();
			if(data.status == 1){					
				alertRMsg(data.msg);
			}else{
				alertWMsg(data.msg);
			}
		},
		error:function(){
			$('.showL').hide();
			alertWMsg('连接超时,请稍后再试');
		}
		
	})
})
$(document).on('click','.searchBtn',function(){
	window.key = $('#keywords').val();
	if(couponLink.length == 0){
		return alertMsg('商品名称不能为空')
	}
	$.ajax({
		type:'post',
		url:'/promoter/search_item',
		data:{item_name:key,promoter_id:window.localStorage.promoterId},
		beforeSend:function(){$('.mask,.showL').show();},
		success:function(data){
				$('.mask,.showL').hide();
			if(data.status == 1){				
				var str = '<table><tr><td>优惠券金额</td><td>状态</td><td>任务结束时间</td><td>已领取</td><td>商品名称</td><td>销量</td><td>转化率</td></tr>';
				if(data.data.coupon_list.length > 0){
					$(data.data.coupon_list).each(function(i,e){
						str +='<tr><td><a onclick="window.open(\''+e.coupon_link+'\')">'+e.price+'元</a></td><td>'+e.status+'</td><td>'+e.end_time+'</td><td>'+e.take_num+'</td><td><a onclick="window.open(\''+e.link+'\')">'+e.item_name.substr(0,15)+'</a></td><td>'+e.sale+'</td><td>'+e.roc+'%</td></tr>'
					})				
				}else{
					str +='<tr><td>暂无数据</td><td>暂无数据</td><td>暂无数据</td><td>暂无数据</td><td>暂无数据</td><td>暂无数据</td><td>暂无数据</td></tr>';
				}
					str +='</table>';
				$('.contentShowDivBottom').html(str);						
			}else{
				$('.showL').hide();
				alertWMsg(data.msg);
			}
		},
		error:function(){
			$('.showL').hide();
			alertWMsg('连接超时,请稍后再试');
		}
		
	})
})