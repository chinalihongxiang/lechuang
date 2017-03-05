$(function () {
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
	if(window.localStorage.sellerId){
		window.seller_id = window.localStorage.sellerId;
	}else{
		return alertWMsg('用户信息拉取失败,如果多次失败,请联系淘友记客服')
	}
    //实例化留言富文本框
    var um = UM.getEditor('myEditor',{
        toolbar:['emotion'],
        //focus时自动清空初始化时的内容
        autoClearinitialContent:true,
        //关闭字数统计
        wordCount:false,
        //关闭elementPath
        elementPathEnabled:false,
        //默认的编辑区域高度
    });
    //实例化分享富文本框
    var um1 = UM.getEditor('myEditor1',{
        toolbar:['emotion image'],
        //focus时自动清空初始化时的内容
        autoClearinitialContent:true,
        //关闭字数统计
        wordCount:false,
        //关闭elementPath
        elementPathEnabled:false,
        //默认的编辑区域高度
    });
    //留言板模块more按钮显示
		addMsg();
		$('.mesMore').show();
        setInterval('addMsg()',2000)
		window.p = 1;
		shareLoad(p);
})
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
//分享 主题input效果
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
//打开留言板块
$(document).on('click','.mesMore',function () {
	$('.mesDiv').animate({right:'0px'},200)
	$('.mesMore').hide();
})
//关闭留言板块
$('.mesDivclose img').on('click',function(){
    $('.mesDiv').animate({right:'-500px'},200, function () {
        $('.mesMore').show();            
    })
})
//hidden input赋值
$('.addNrTime input').val(getNowFormatDate())
//留言弹层
$('.message,.addN img').on('click',function(){
    $('.addNrMask').show();
    $('.addNr').animate({top:'50%'},200)
    document.body.onselectstart=document.body.ondrag=function(){
        return true;
    }
});
//关闭留言弹层
$('.close').on('click',function(){
    $('.addNr').animate({top:'-1000px'},200,function(){
        $('.addNrMask').hide();
        document.body.onselectstart=document.body.ondrag=function(){
            return false;
        }
    })
})
$('.addNrBtn').on('click',function(){
var isShow = $("input[name='type']:checked").val();
var words = UM.getEditor('myEditor').getPlainTxt();
if(words.length == 0 || words == '请输入留言内容\n' || words == '\n'){		
		$('.addNrMask').hide();
		return alertMsg('留言内容不能为空');		
}else{
	$('.addNr').animate({top:'-1000px'},200,function(){
		$('.addNrMask').hide();
		document.body.onselectstart=document.body.ondrag=function(){
			return false;
		}	
		$.ajax({
			url:'/Words/send',
			type:'post',
			data:{seller_id:seller_id,words: words,is_show:isShow},
			success:function(data){
				if(data.status == 1){
					alertRMsg(data.msg)
				}else{
					alertWMsg(data.msg)
				}
			},
			error:function(){
				alertWMsg('链接超时,请稍后再试')
			}			
		})		
	})
}

})
//分享弹层
$('.share').on('click',function(){
    $('.addNrMask').show();
    $('.addNr1').animate({top:'50%'},200)
    document.body.onselectstart=document.body.ondrag=function(){
        return true;
    }
});
//关闭分享弹层
$('.close1').on('click',function(){
	$('.addNr1').animate({top:'-1000px'},200,function(){
		$('.addNrMask').hide();
		document.body.onselectstart=document.body.ondrag=function(){
			return false;
		}
	})
})
$('.addNrBtn1').on('click',function(){
		document.body.onselectstart=document.body.ondrag=function(){
			return false;
		}
	var theme = $('.addNrTheme input').val();
	var content = UM.getEditor('myEditor1').getPlainTxt();
	if(theme.length == 0 || theme == '主题(对商品进行简单描述)'){
		return alertMsg('分享主题不能为空');	
	}else if(content.length == 0 || content == '请输入正式的买家群文案模板,支持图片+文字同时粘贴,输入框内暂不支持图片显示,但不影响实际效果\n' || content == '\n'){		
			$('.addNrMask').hide();
			return alertMsg('分享内容不能为空');
	}else{			
		$.ajax({
				url:'/Words/share',
				type:'post',
				data:{seller_id:seller_id,title: theme,content:content},
				beforeSend:function(){
					$('.addNr1').animate({top:'-1000px'},200,function(){
						$('.addNrMask').hide();
						document.body.onselectstart=document.body.ondrag=function(){
							return false;
						}
					})
				},
				success:function(data){
					if(data.status == 1){
						alertRMsg('已提交，等待审核通过')
					}else{
						alertWMsg(data.msg)
					}
				},
				error:function(){
					alertWMsg('链接超时,请稍后再试')
				}			
			})		
	}
})

//右下fixed按钮切换
$('.fixedBrImgtap img').on('mouseenter', function () {
    var src = $(this).attr('src');
    var srcN = src.split('.png')[0]+'_h.png';
    $(this).attr('src',srcN);
    $(this).one('mouseleave', function () {
        $(this).attr('src',src);
    })
})
//右下fixed图标提示
$(document).on('mouseenter', '.fixedBrImgtap',function(){
	layer.tips($(this).attr('data-tips'),this,{
		tips: [4, 'rgba(0,178,238,1)'],
		time: 0,
		area:['80px']
	});
});
$(document).on('mouseleave','.fixedBrImgtap', function(){
	 layer.closeAll('tips');
});
//获取本地时间 并按照 yyyy-mm-dd hh:mm:ss 输出
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strHours = date.getHours();
    var strMinutes = date.getMinutes();
    var strSeconds = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if(strHours < 10){
        strHours = "0" + strHours;
    }
    if(strMinutes < 10){
        strMinutes = "0" + strMinutes;
    }
    if(strSeconds < 10){
        strSeconds = "0" + strSeconds;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate
            + " " + strHours + seperator2 + strMinutes
            + seperator2 + strSeconds;
    return currentdate;
}
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
		data:{p:n,my_share:'1',seller_id:seller_id},
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
		data:{seller_id:seller_id,share_id:shareId,type:type},
		success:function(data){
				shareLoad(p);
		},
		error:function(){
			alertWMsg('连接超时，请稍后再试')
		}
	})
}