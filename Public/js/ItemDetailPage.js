$(function(){
    $(".goodsMoreLeftTable,.goodsMoreRightTable,.goodsMore1").niceScroll({
        cursorcolor:"#00B2EE",
        cursoropacitymax:1,
        hwacceleration:true,
        touchbehavior:false,
        sensitiverail:true,
        hidecursordelay:200,
        bouncescroll:true,
        cursorwidth:"5px",
        cursorborder:"0",
        cursorborderradius:"5px",
        spacebarenabled:true,
    });
})
$('.slideShowBtn').on('click',function(){
	if($(".bottomSilde").is(":hidden")){
		return $('.bottomSilde').slideDown(200);
	}
	$('.bottomSilde').slideUp(200);
})
$('.searchById').on('click',function(){
    window.alipayTtemId = $('#goodsSearch').val();
    if(alipayTtemId.length == 0){
		return alertMsg('商品链接不能为空') 
	}else if((!checkUrl(alipayTtemId)) || (!getParams(alipayTtemId,'id'))){
		return alertMsg('您输入的商品链接不符合规则,请确认后再试')
	}else{
		alipayTtemId = getParams(alipayTtemId,'id');
	}
    $.ajax({
        type:'post',
        url:'/itemDetail/get_item_details_by_id',
        data:{alipay_item_id:alipayTtemId},
        beforeSend:function(){
            $('.mask').show();
            $('.showL').show();
        },
        success:function(data){
            $('.mask').hide();
            $('.showL').hide();
            if(data.status == 1){
                var str = '<ul><li class="showGoodsName"  data-tips="'+data.data.item_name+'"> <div>商品名称:</div><div>'+data.data.item_name.substr(0,6)+'...</div></li><li><div>当前销量:</div><div>'+data.data.sale+'件</div></li><li><div>佣金比例:</div><div>'+data.data.ratio+'%</div></li><li><div>参与活动天数:</div><div>'+data.data.join_days+'</div></li><li><div>已领优惠券:</div><div>'+data.data.coupon_take_num+'张</div></li><li><div>券转化率:</div><div>'+data.data.coupon_roc+'%</div></li></ul>'
                $('.goodsInfo').html(str);
                var str1 = '<table><tr><td>券金额</td><td>领取数</td><td>转化率</td></tr>';
                if(data.data.coupon_list.length > 0){
					$(data.data.coupon_list).each(function(i,e){
						str1 +='<tr><td>'+e.price.split('.')[0]+'元优惠券</td><td>'+e.take_num+'</td><td>'+e.coupon_roc+'</td></tr>'
					})
				}else{
					str1 +='<tr><td>=暂无数据</td><td>暂无数据</td><td>暂无数据</td></tr>'
				}
                str1 += '</table>'
                $('.goodsMoreLeftTable').html(str1);
                var str2 = '<table><tr><td>群名称</td><td>时间</td><td>券金额</td></tr>'
                if(data.data.group_list.length > 0){
					$(data.data.group_list).each(function(i,e){
						str2 +='<tr><td>'+e.group_name.substr(0,10)+'</td><td>'+e.time.split(' ')[0]+'<br/>'+e.time.split(' ')[1]+'</td><td>'+e.price.split('.')[0]+'元</td></tr>';
					})
				}else{
					str2 +='<tr><td>暂无数据</td><td>暂无数据</td><td>暂无数据</td></tr>';
				}
                str2 += '</table>';
                $('.goodsMoreRightTable').html(str2);
                if($('.contentAddDiv1').is(':hidden')){
                    $('.contentAddDiv1').show();
                    $('.contentAddDiv,.contentAddDiv2').hide();
                }
            }else{
                alertWMsg(data.msg)
            }
        },
        error:function(){
            $('.mask').hide();
            $('.showL').hide();
            alertWMsg('连接超时,请稍后再试')
        }
    })
})
$('.searchByKey').on('click',function(){
    window.keywords = $('#goodsSearch').val();
    if(keywords.length == 0){return alertMsg('关键词不能为空')};
    $.ajax({
        type:'post',
        url:'/itemDetail/keywords',
        data:{keywords:keywords},
        beforeSend:function(){
            $('.mask').show();
            $('.showL').show();
        },
        success:function(data){
            $('.mask').hide();
            $('.showL').hide();
            if(data.status == 1){
                var str = '<ul><li class="showGoodsName" data-tips="'+data.data.max_ratio.item_name+'"><div>最高佣金比例:</div><div><div>'+data.data.max_ratio.item_name.substr(0,9)+'</div><div>'+data.data.max_ratio.ratio+'%</div></div></li><li class="showGoodsName" data-tips="'+data.data.min_ratio.item_name+'"><div>最低佣金比例:</div><div><div>'+data.data.min_ratio.item_name.substr(0,9)+'</div><div>'+data.data.min_ratio.ratio+'%</div></div></li><li><div>平均比例:</div><div>'+data.data.avg_ratio+'%</div></li><li class="showGoodsName" data-tips="'+data.data.max_price.item_name+'"><div>最高价格:</div><div><div>'+data.data.max_price.item_name.substr(0,9)+'</div><div>'+data.data.max_price.price+'元</div></div></li><li  class="showGoodsName" data-tips="'+data.data.min_price.item_name+'"><div>最低价格:</div><div><div>'+data.data.min_price.item_name.substr(0,9)+'</div><div>'+data.data.min_price.price+'元</div></div></li><li><div>券转化率:</div><div>'+data.data.avg_roc+'%</div></li></ul>';
                $('.goodsInfo1').html(str);
                var str1 = '<table><tr><td>商品名称</td><td>佣金比例</td><td>价格</td></tr>';
                $(data.data.item_list).each(function(i,e){
                    str1 +='<tr><td><a onclick="window.open(\''+e.link+'\')">'+e.item_name.substr(0,20)+'</a></td><td>'+e.ratio+'%</td><td>'+e.price+'元</td></tr>'
                })
                str1 +='</table>';
                $('.goodsMore1').html(str1);
                if($('.contentAddDiv2').is(':hidden')){
                    $('.contentAddDiv2').show();
                    $('.contentAddDiv,.contentAddDiv1').hide();
                }
            }else{
                alertWMsg(data.msg)
            }
        },
        error:function(){
            $('.mask').hide();
            $('.showL').hide();
            alertWMsg('连接超时,请稍后再试')
        }
    })

})
$(document).on('mouseenter', '.showGoodsName',function(){
    layer.tips($(this).attr('data-tips'),this,{
        tips: [3, 'rgba(0,0,0,0.7)'],
        time: 0,
        area:['232px']
    });
});
$(document).on('mouseleave','.showGoodsName', function(){
    layer.closeAll('tips');
});
