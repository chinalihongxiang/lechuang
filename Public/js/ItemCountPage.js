getpromoterId(ItemCountLoad);    
function ItemCountLoad(){
	$('#selectType,#selectTime').chosen({disable_search:true}).change(function(){       
        goodsListType();
    });
    $(".showDivLeftUlContent").niceScroll({
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
    goodsListType();
	goodsAllList();
	$(document).on('mouseenter', '.showGoodsName',function(){
		layer.tips($(this).attr('data-tips'),this,{
			tips: [3, 'rgba(0,0,0,0.7)'],
			time: 0,
			area:['232px']
		});
	});
	$(document).on('mouseenter', '.showTips',function(){
		layer.tips($(this).attr('data-tips'),this,{
			tips: [2, 'rgba(0,0,0,0.7)'],
			time: 0,
			area:['232px']
		});
	});
	$(document).on('mouseleave','.showGoodsName,.showTips', function(){
		layer.closeAll('tips');
	});
}

function goodsAllList(){
    $.ajax({
        type:'post',
        url:'/ItemCount/all',
        complete:function(){
            $('.mask').hide();
            $('.showL').hide();
        },
        success:function(data){
            if(data.status == 1){
                var str = '<li><div class="showGoodsName" data-tips="新券个数是指今日全网新增的优惠券个数">新券个数</div><div>【<span class="counter">'+data.data.coupon_num+'</span>】</div></li><li><div class="showGoodsName" data-tips="商品总量:指截至到今日全网参与优惠券活动的总数量">商品总量</div><div>【<span class="counter">'+data.data.item_num+'</span>】</div></li><li><div class="showGoodsName" data-tips="总计销量:总计销量统计的是当日全网参与优惠券活动的所有商品的总计销量">总计销量</div><div>【<span class="counter">'+data.data.item_sale_sum+'</span>】</div></li><li><div class="showGoodsName" data-tips="平均转化率:指今日全网参与优惠券活动的所有商品的平均转化率,该指标可以用于跑单淘客在跑单前对自己商品有一个大致定位">平均转化率</div><div>【<span class="counter">'+data.data.roc_avg+'</span>%】</div></li><li><div class="showGoodsName" data-tips="平均佣金比例:指全网商品去除掉极个别非正常优惠券商品之后计算的商品平均佣金比例,可以用于了解整个行业的平均佣金以及作为和商家谈佣金比例时的参考依据">平均佣金比例</div><div>【<span class="counter">'+data.data.item_ratio_avg+'</span>%】</div></li>';
                $('.showDivRightUl').html(str);
				$('.counter').countUp();
            }else{
                alertWMsg(data.msg)
            }
        },
        error:function(){
            alertWMsg('连接超时,请稍后再试')
        }
    })
}
function goodsListType(){
	var time = $('#selectTime').val();
	switch(time)
		{
		case '0':
			time = 'day';
			break;
		case '1':
			time = 'week';
			break;
		default:
			return alertMsg('选择排序方式时发生错误,请刷新页面后重试')
			break;
		}
	var type = $('#selectType').val();
    switch(type)
        {
		case '0':
			type = 'take';
			break;
		case '1':
			type = 'sale';
			break;
		case '2':
			type = 'roc';
			break;
		default:
			return alertMsg('选择排序方式时发生错误,请刷新页面后重试')
			break;
	}	
    $.ajax({
        type:'post',
        url:'/ItemCount/search',
        data:{type:type,date_type:time},
        beforeSend:function(){
            $('.mask').show();
            $('.showL').show();
        },
        complete:function(){
            $('.mask').hide();
            $('.showL').hide();
        },
        success:function(data){
            if(data.status == 1){
                var str = '';
                $(data.data).each(function(i,e){
					if(e.roc-0 > 50){
						var roc = '<li class="red">'+e.roc+'%</li>'
					}else{
						var roc = '<li>'+e.roc+'%</li>'
					}
					if(e.sale-0 > 20000){
						var sale = '<li class="red">'+e.sale+'</li>'
					}else{
						var sale = '<li>'+e.sale+'</li>'
					}
                    str +='<ul><li>'+(i+1)+'</li><li  class="showGoodsName" data-tips="'+e.item_name+'"><a onclick="window.open(\''+e.link+'\')">'+e.item_name.substr(0,12)+'</a></li><li>'+e.take_num+'</li>'+sale+''+roc+'</ul>'
                })
                $('.showDivLeftUlContent').html(str);
            }else{
                alertWMsg(data.msg)
            }
        },
        error:function(){
            alertWMsg('连接超时,请稍后再试')
        }
    })
}
