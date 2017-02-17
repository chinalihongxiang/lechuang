$(function(){
    $('#selectType').chosen({disable_search:true}).change(function(){
        var type = $(this).val();
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
        goodsListType(type);
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
    goodsListload();
})

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
function goodsListload(){
    $.ajax({
        type:'post',
        url:'/ItemCount/search',
        data:{type:'take'},
        complete:function(){
            $('.mask').hide();
            $('.showL').hide();
        },
        success:function(data){
            if(data.status == 1){
                var str = '';
                $(data.data.item_list).each(function(i,e){
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
					str +='<ul><li>'+(i+1)+'</li><li  class="showGoodsName" data-tips="'+e.item_name+'"><a onclick="window.open(\''+e.link+'\')">'+e.item_name.substr(0,5)+'</a></li><li>'+e.take_num+'</li>'+sale+''+roc+'</ul>'
				})
                $('.showDivLeftUlContent').html(str);
                var str1 = '<li><div>新券个数</div><div>【'+data.data.item_all_count.coupon_num+'】</div></li><li><div>商品总量</div><div>【'+data.data.item_all_count.item_num+'】</div></li><li><div>总计销量</div><div>【'+data.data.item_all_count.item_sale_sum+'】</div></li><li><div>平均转化率</div><div>【'+data.data.item_all_count.item_ratio_avg+'%】</div></li><li><div>平均佣金比例</div><div>【'+data.data.item_all_count.roc_avg+'%】</div></li>';
                $('.showDivRightUl').html(str1);
            }else{
                alertWMsg(data.msg)
            }
        },
        error:function(){
            alertWMsg('连接超时,请稍后再试')
        }
    })
}
function goodsListType(type){
    $.ajax({
        type:'get',
        url:'/ItemCount/search',
        data:{type:type},
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
                $(data.data.item_list).each(function(i,e){
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
                    str +='<ul><li>'+(i+1)+'</li><li  class="showGoodsName" data-tips="'+e.item_name+'"><a onclick="window.open(\''+e.link+'\')">'+e.item_name.substr(0,5)+'</a></li><li>'+e.take_num+'</li>'+sale+''+roc+'</ul>'
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
