$(function(){
	$(".tbkInfoMore").niceScroll({
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
})
var promoter_id = GetQueryString('promoter_id');
$.ajax({
	type:'post',
	url:'/seller/promoter_detail',
	data:{promoter_id:promoter_id},
	beforeSend:function(){
		$('.mask').show();
		$('.showL').show();
	},
	success:function(data){
		if(data.status == 1){
			$('.mask').hide();
			$('.showL').hide();
			$('.contentShowDivHead div:last-child').html(data.data.promoter_name)
			var str = '<ul><li><div>新券数:</div><div>'+data.data.new_coupon_num+'张</div></li><li><div>总领券量:</div><div>'+data.data.all_take_sum+'张</div></li><li><div>总计销量:</div><div>'+data.data.all_sale_sum+'件</div></li><li><div>平均转化率:</div><div>'+data.data.roc_avg+'%</div></li><li><div>推广能力评分:</div><div>'+data.data.promot_point+'分</div></li><li><div>淘客综合评分:</div><div>'+data.data.all_point+'分</div></li></ul>';
			$('.tbkInfo').html(str);
			var str1 = '<table><tr><td>优惠券金额</td><td>优惠券商品名称</td><td>已领取</td><td>转化率</td><td>状态</td></tr>';
			$(data.data.coupon_list).each(function(i,e){
				str1 +='<tr><td>'+e.price+'元</td><td>'+e.item_name+'</td><td>'+e.take_num+'</td><td>'+e.roc+'</td><td>'+e.status+'</td></tr>'
			})
			str1 +='</table>';
			$('.tbkInfoMore').html(str1);
		}else{	
			$('.showL').hide();
			alertWMsg (data.msg);
		}
	},
	error:function(){$('.showL').hide();alertWMsg ('链接超时,请稍后再试')}
})