getpromoterId(enterLoad);
//分享 主题input效果
function enterLoad(){
	$('.addNrTheme .input').on('focus',function () {
		if($(this).val() == $(this).attr('placeholder')){
			$(this).val('')
		}
		$(this).parent('div').css({'borderColor':'#00B2EE','boxShadow':'0 0 5px #00B2EE','transition':'all .3s'})
	})
	$('.addNrTheme .input').on('blur',function () {
		if($(this).val().length == 0){
			$(this).val($(this).attr('placeholder'))
		}
		$(this).parent('div').css({'borderColor':'#E2E2E2','boxShadow':'none'})
	})
	//顶部tap切换
	$('.tap').on('click', function () {
		$('.tap').removeClass('tapActive');
		$(this).addClass('tapActive');
		if(this == $('.tap').get(0)){
			window.p = 1;
			addGroup(p);
		}else{
			window.p = 1;
			addWeb(p);
		}
	})
	addGroup();
}
//加载群
function addGroup (p){
	$.ajax({
		type:'post',
		url:'/Group/goodGroups',
		beforeSend:function(){
			$('.mask,.showL').show();			
		},
		complete:function(){
			$('.mask,.showL').hide();
		},
		data:{p:p},
		success:function(data){
			if(data.status == 1){
				var str = '<table type="group"><tr><td>群名称</td><td class="order" type="today_all_take">领券总量↑</td><td class="order" type="today_all_sale">总计销量↑</td><td class="order" type="today_roc_avg">平均转化↑</td><td class="order" type="today_new_coupon_num">新单个数↑</td><td class="order" type="today_repeat_coupon_num">重复单数↑</td></tr>'
				$(data.data).each(function(i,e){
					str += '<tr><td>'+e.group_name+'</td><td>'+e.today_all_take+'</td><td>'+e.today_all_sale+'</td><td>'+e.today_roc_avg+'%</td><td>'+e.today_new_coupon_num+'</td><td>'+e.today_repeat_coupon_num+'</td></tr>'
			})
				str += '</table><span>tips:点击"领券总量"、"总计销量"、"平均转化"、"新单个数"、"重复单数"即可对采集群进行排序哦</span>';
				$('.contentShowDivTable').html(str);
				pageLoad(data.data.count,data.data.p_size,data.data.p,addGroup)
			}else{
				alertWMsg(data.msg)
			}
		}
	})
}
$(document).on('click','.order',function(){
	$('.order').removeClass('orderActive');
	$(this).addClass('orderActive')
	window.p = 1;
	orderGroup(p,this);
})
function orderGroup(p,obj){
	window.type = $('.orderActive').attr('type') || window.type;
	window.order_type = 'desc';
	$.ajax({
		type:'post',
		url:'/Group/goodGroups',
		beforeSend:function(){
			$('.mask,.showL').show();			
		},
		complete:function(){
			$('.mask,.showL').hide();
		},
		data:{p:p,type:type,order_type:order_type},
		success:function(data){
			if(data.status == 1){
				var str = '<table type="group"><tr><td>群名称</td><td class="order" type="today_all_take">领券总量↑</td><td class="order" type="today_all_sale">总计销量↑</td><td class="order" type="today_roc_avg">平均转化↑</td><td class="order" type="today_new_coupon_num">新单个数↑</td><td class="order" type="today_repeat_coupon_num">重复单数↑</td></tr>'
				$(data.data).each(function(i,e){
					str += '<tr><td>'+e.group_name+'</td><td>'+e.today_all_take+'</td><td>'+e.today_all_sale+'</td><td>'+e.today_roc_avg+'%</td><td>'+e.today_new_coupon_num+'</td><td>'+e.today_repeat_coupon_num+'</td></tr>'
				})
				str += '</table><span>tips:点击"领券总量"、"总计销量"、"平均转化"、"新单个数"、"重复单数"即可对采集群进行排序哦</span>';
				$('.contentShowDivTable').html(str);
				changeColor (obj);
				pageLoad(data.data.count,data.data.p_size,data.data.p,orderGroup)
			}else{
				alertWMsg(data.msg)
			}
		}
	})
}
function changeColor (obj){
	$('.order').each(function(i,e){
		if($(e).html() == $(obj).html()){
			$(e).addClass('orderActive');
		}
	})
}
//加载网站
function addWeb (p){
	$.ajax({
		type:'post',
		url:'/admin/userWeb',
		beforeSend:function(){
			$('.mask,.showL').show();			
		},
		complete:function(){
			$('.mask,.showL').hide();
		},
		data:{p:p},
		success:function(data){
			if(data.status == 1){
				var str = '<table type="web"><tr><td>网站名称</td><td>网站地址</td><td style="width:200px">点击次数</td></tr>'
				$(data.data.list).each(function(i,e){
					str += '<tr><td>'+e.web_name+'</td><td><a onclick="window.open(\''+e.web_link+'\')" _href="'+e.web_link+'" class="clickIn">点击进入</a></td><td>'+e.click_num+'</td></tr>'
				})
				str += '</table>';
				$('.contentShowDivTable').html(str);
				pageLoad(data.data.count,data.data.p_size,data.data.p,addWeb)
			}else{
				alertWMsg(data.msg)
			}
		}
	})
}
$(document).on('click','.clickIn',function(){
	var webLink = $(this).attr('_href')
	$.ajax({
		type:'post',
		url:'/admin/webClick',
		data:{web_link:webLink}
	})
	addWeb ();
})

