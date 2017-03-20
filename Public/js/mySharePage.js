getpromoterId(myShareload); 
function myShareload() {
	$(".contentShowDivTable,.GoodsDetailDivShowD,.mesDivCon ul li,.mesDivCon").niceScroll({
		cursorcolor:"#00B2EE",
		cursoropacitymax:1,
		hwacceleration:true,
		touchbehavior:false,
		sensitiverail:true,
		hidecursordelay:500,
		bouncescroll:true,
		cursorwidth:"5px",
		cursorborder:"0",
		cursorborderradius:"5px",
		spacebarenabled:true,
	});
	//留言板模块more按钮显示
		addMsg();
		$('.mesMore').show();
		setInterval('addMsg()',2000)
		window.p = 1;
		shareLoad(p);
}
//复制
var clipboard = new Clipboard ('.GoodsDetailDivShowCopy');
	clipboard.on('success', function(e) {
		$('.GoodsDetailDivShowCopy').html('已复制')
		var shareId = $('.GoodsDetailDivShowCopy').attr('shareId');
		dealShare(shareId,'copy_num')
	});
	clipboard.on('error', function(e) {
		alertWMsg('复制失败')
	});
//商品详情
$(document).on('click','.GoodsDetail',function(){
	document.body.onselectstart=document.body.ondrag=function(){
		return true;
	}
	var  shareId = $(this).attr('shareId');
	$(listArr).each(function(i,e){
		if(e.share_id == shareId){
			if(e.is_like == 0){
				var is_like = '<div class="GoodsDetailDivShowPraise" haspraise = "0" shareId="'+shareId+'">点赞</div>';
			}else{
				var is_like = '';
			}
			/*
			if(e.is_dislike == 0){
				var is_dislike = '<div class="GoodsDetailDivShowbad" hasbad = "0" shareId="'+shareId+'">差评</div>';
			}else{
				var is_dislike = '';
			}*/
			var content = e.content.replace(/&amp;quot;/g,'"').replace(/&amp;lt;/g,'<').replace(/&amp;gt;/g,'>').replace(/\n/g,'');
			var str = '<h2>'+e.title+'</h2><div class="GoodsDetailDivShowD">'+content+'</div><div class="GoodsDetailDivShowCopy" data-clipboard-target=".GoodsDetailDivShowD" shareId="'+shareId+'">一键复制</div>'+is_like;
		}
		$('.GoodsDetailDivShow').html(str);
	})
	$('.GoodsDetailMask').show();
	$('.GoodsDetailDiv').animate({top:'50%'},200);
	$('.GoodsDetailDivClose').one('click', function () {
		$('.GoodsDetailDiv').animate({top:'-800px'},200, function () {
			$('.GoodsDetailMask').hide();
			document.body.onselectstart=document.body.ondrag=function(){
				return false;
			}
		});
	})
})
//点赞
$(document).on('click','.GoodsDetailDivShowPraise', function () {
	var  shareId = $(this).attr('shareId');
	dealShare(shareId,'like_num');
	$(this).html('已点赞')
})
//留言赞
$(document).on('click','.praise', function () {
	if($(this).attr('haspraise') == 0){
		var num = $(this).children('span').html() - 0 + 1;
		$(this).html('已赞(<span>'+num +'</span>)')
		$(this).attr('haspraise','1');
	}else{
		var num = $(this).children('span').html() - 0 - 1;
		$(this).html('赞(<span>'+ num+'</span>)')
		$(this).attr('haspraise','0');
	}
})
function addMsg(){
	$.ajax({
		url:'/words/show',
		success:function(data){
			if(data.status == 1){
				var str = '<ul>';
				$(data.data).each(function(i,e){
					if(e.type == '1'){
						var type = '淘客 '+e.user_name;
					}else{
						var type = '商户 '+e.user_name;
					}
					var words = e.words.replace(/&amp;quot;/g,'"').replace(/&amp;lt;/g,'<').replace(/&amp;gt;/g,'>').replace(/\n/g,'');
					str += '<li><div class="mesDivConinfo clearfix"><div>'+type+'</div><div>'+e.create_time+'</div></div><h5>'+words+'</h5></li>'
				});
				str += '</ul>';
				$('.mesDivCon').html(str);
			}
			else{
				alertWMsg(data.msg);
			}
		}
	})
}
function shareLoad(n){
	$.ajax({
		url:'/Words/shareList',
		type:'post',
		data:{p:n,my_share:'1',promoter_id:window.localStorage.promoterId},
		beforeSend:function(){
			$('.mask,.showL').show();
		},
		complete:function(){
			$('.mask,.showL').hide();
		},
		success:function(data){
			if(data.status == 1){
			window.listArr = data.data.list;
				var str ='<table><tr><td>用户名</td><td>商品描述</td><td>内容</td><td>已赞</td><td>已复制</td><td>差评</td><td>时间</td></tr>';
				if(data.data.list.length > 0){
					$(data.data.list).each(function(i,e){
						str +='<tr><td>'+e.user_name+'</td><td>'+e.title+'</td><td><div class="GoodsDetail" shareId="'+e.share_id+'">查看详情</div></td><td>'+e.like_num+'</td><td>'+e.copy_num+'</td><td>'+e.dislike_num+'</td><td>'+e.create_time.split(' ')[0]+'<br/>'+e.create_time.split(' ')[1]+'</td></tr>'
					});
				}else{
					str +='<tr><td>暂无数据</td><td>暂无数据</td><td>暂无数据</td><td>暂无数据</td><td>暂无数据</td><td>暂无数据</td><td>暂无数据</td></tr>'
				}
				str +='</table>';
				$('.contentShowDivTable').html(str);
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
						shareLoad(p);
						return false;
					}
				})
			}else{
				alertWMsg(data.msg);
			}
		},
		error:function(){
			alertWMsg('连接超时,请稍后再试')
		}			
	})
}
function dealShare(shareId,type){
	$.ajax({
		url:'/Words/changePoint',
		type:'post',
		data:{promoter_id:window.localStorage.promoterId,share_id:shareId,type:type},
		success:function(data){
				shareLoad(p);
		},
		error:function(){
			alertWMsg('连接超时，请稍后再试')
		}
	})
}