$(function(){
	$(".contentShowDivTable").niceScroll({
		cursorcolor:"#00B2EE",
		cursoropacitymax:1,
		hwacceleration:true,
		touchbehavior:false,
		sensitiverail:true,
		hidecursordelay:5000,
		bouncescroll:true,
		cursorwidth:"5px",
		cursorborder:"0",
		cursorborderradius:"5px",
		spacebarenabled:true,
	});
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
		toolbar:['emotion'],
		//focus时自动清空初始化时的内容
		autoClearinitialContent:true,
		//关闭字数统计
		wordCount:false,
		//关闭elementPath
		elementPathEnabled:false,
		//默认的编辑区域高度
	});
	if(window.localStorage.promoterId){
		window.promoter_id = window.localStorage.promoterId;
	}else{
		return alertWMsg('用户信息拉取失败,如果多次失败,请联系淘友记客服')
	}
addGroup();
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
//hidden input赋值
$('.addNrTime input').val(getNowFormatDate())
//留言弹层
$('.message').on('click',function(){
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
				data:{promoter_id:window.localStorage.promoterId,words: words,is_show:isShow},
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
				data:{promoter_id:window.localStorage.promoterId,title: theme,content:content},
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
	}
})
//顶部tap切换
$('.tap').on('click', function () {
	$('.tap').removeClass('tapActive');
	$(this).addClass('tapActive');
	if(this == $('.tap').get(0)){
		addGroup();
	}else{
		addWeb();
	}
})
//右下fixed图标切换
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
function addGroup (){
	$.ajax({
		type:'post',
		url:'/Group/goodGroups',
		beforeSend:function(){
			$('.mask,.showL').show();			
		},
		complete:function(){
			$('.mask,.showL').hide();
		},
		success:function(data){
			if(data.status == 1){
				var str = '<table><tr><td>排名</td><td>群名称</td><td>今日领券总量</td><td>今日总计销量</td><td>今日平均转化</td><td>今日新单个数</td><td>今日重复单数</td></tr>'
				$(data.data).each(function(i,e){
					str += '<tr><td>'+(i+1)+'</td><td>'+e.group_name+'</td><td>'+e.today_all_take+'</td><td>'+e.today_all_sale+'</td><td>'+e.today_roc_avg+'</td><td>'+e.today_new_coupon_num+'</td><td>'+e.today_repeat_coupon_num+'</td></tr>'
				})
				str += '</table>';
				$('.contentShowDivTable').html(str);
			}else{
				alertWMsg(data.msg)
			}
		}
	})
}
function addWeb (){
	$.ajax({
		type:'post',
		url:'/Promoter/websiteList',
		beforeSend:function(){
			$('.mask,.showL').show();			
		},
		complete:function(){
			$('.mask,.showL').hide();
		},
		success:function(data){
			if(data.status == 1){
				var str = '<table><tr><td>网站名称</td><td>网站地址</td><td style="width:200px">网站流量(日均)</td></tr>'
				$(data.data).each(function(i,e){
					str += '<tr><td>'+e.title+'</td><td><a onclick="window.open(\''+e.link+'\')">点击进入</a></td><td>'+e.uv+'</td></tr>'
				})
				str += '</table>tips:该网站列表,排名不分先后 tips:uv数据来自第三方网站查询,仅供参考';
				$('.contentShowDivTable').html(str);
			}else{
				alertWMsg(data.msg)
			}
		}
	})
}