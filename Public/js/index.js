document.body.onselectstart=document.body.ondrag=function(){
	return false;
}
$(function(){	
	if(GetQueryString('sellerId')){
		window.localStorage.sellerId =  GetQueryString('sellerId');		
	}
	if(GetQueryString('promoterId')){
		window.localStorage.promoterId =  GetQueryString('promoterId');	
	}
	//输入框选中效果
	if($('#sname')){
		$('#sname').focus();
		$('#sname').parent('div').css({'borderColor':'#00B2EE','boxShadow':'0 0 5px #00B2EE','transition':'all .3s'})
			$('.content ul li .input').on('focus',function () {
				if($(this) != $('#sname')){
					$('#sname').parent('div').css({'borderColor':'#E2E2E2','boxShadow':'none'})
				}
				$(this).parent('div').css({'borderColor':'#00B2EE','boxShadow':'0 0 5px #00B2EE','transition':'all .3s'})
			})
			$('.content ul li .input').on('blur',function () {
				$(this).parent('div').css({'borderColor':'#E2E2E2','boxShadow':'none'})
			})
	}
	if($('#goodsSearch')){
		$('#goodsSearch').focus();
			$('#goodsSearch').parent('div').css({'borderColor':'#00B2EE','boxShadow':'0 0 5px #00B2EE','transition':'all .3s'})

		$('#goodsSearch').on('focus',function () {
			$('#goodsSearch').parent('div').css({'borderColor':'#00B2EE','boxShadow':'0 0 5px #00B2EE','transition':'all .3s'})
		})
		$('#goodsSearch').on('blur',function () {
			$(this).parent('div').css({'borderColor':'#E2E2E2','boxShadow':'none'})
		})
	}
})
//自定义弹窗式提示
function alertMsg (str) {
	$('.showMsg').html(str);
	$('.mask').css('display','block')
	$('.show').animate({top:'200px'},200);
	$('.showBtn').one('click',function () {
		$('.show').animate({top:'-1000px'},200,'swing',function(){
			$('.mask').css('display','none')
		})
	})
}
//自定义弹窗正确信息提示
function alertRMsg (str) {
	$('.showRMsg p').html(str);
	$('.mask').css('display','block')
	$('.showR').animate({top:'200px'},200);
	$('.showRBtn').one('click',function () {
		$('.showR').animate({top:'-1000px'},200,'swing',function(){
			$('.mask').css('display','none')
		})
	})
}
//自定义弹窗错误信息提示
function alertWMsg (str) {
	$('.showWMsg p').html(str);
	$('.mask').css('display','block')
	$('.showW').animate({top:'200px'},200);
	$('.showWBtn').one('click',function () {
		$('.showW').animate({top:'-1000px'},200,'swing',function(){
			$('.mask').css('display','none')
		})
	})
}
//自定义选择信息提示
function alertCMsg (str) {
	$('.showCMsg p').html(str);
	$('.mask').css('display','block')
	$('.showC').animate({top:'200px'},200);
	$('.showCBtncancel').one('click',function () {
		$('.showC').animate({top:'-1000px'},200,'swing',function(){
			$('.mask').css('display','none');			
		})
	})
	
}
//发送验证码倒计时
function sendCode(obj) {
	var _this  = obj;
	var i = 120;
	$(_this).html('120秒后可再次发送');
	$(_this).attr('disabled','disabled');
	$(_this).css('cursor','not-allowed')
	var timerID = setInterval(function () {
		i--;
		$(_this).html(i+'秒后可再次发送');
		if (i == 0) {
			clearInterval(timerID);
			$(_this).html('点击发送验证码');
			$(_this).removeAttr('disabled');
			$(_this).css('cursor','pointer')
		}
	},1000)
}
//邮箱验证
function checkEmail(str){
	return RegExp(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/).test(str);
}
//用户名正则验证
function checkUser(str){
	return RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9])*$/).test(str);
}
//手机号码正则验证
function checkMobile(str) {
	return RegExp(/^(13[0-9]|15[0-9]|18[0-9]|17[0-9]|14[57])[0-9]{8}$/).test(str);
}
//QQ正则验证
function checkQQ(str) {
	return RegExp(/^[1-9][0-9]{4,9}$/).test(str);
}
//密码验证
function checkPwd (str) {
	return RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/).test(str);
}
function ShopId(str){
	return RegExp(/^[1-9][0-9]*$/).test(str);
}
//链接验证
function checkUrl(url){
	if ((url.indexOf("http://")>=0 || url.indexOf("https://")>=0)){
		return true;
	}else{
		return false;
	}
}
function checkCouponUrl(url){
	if ((url.indexOf("http://")>=0 || url.indexOf("https://")>=0)&&(url.indexOf("sellerId")>=0 || url.indexOf("sellerid")>=0 || url.indexOf("post")>=0 || url.indexOf("post")>=0) && (url.indexOf("activityId")>=0 || url.indexOf("activityid")>=0 || url.indexOf("activity_id")>=0 || url.indexOf("activity_Id")>=0)){
		return true;
	}else{
		return false;
	}
}
//获取当前url里面的参数
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
//获取url中的参数
function getParams(url,key){
	var url = url.replace('?','&').split('&');
	var paramsObj = {};
	for(var i = 0, iLen = url.length; i < iLen; i++){
		var param = url[i].split('=');
		paramsObj[param[0]] = param[1];
	}
	if(key){
		return paramsObj[key];
	}
}
function getpromoterId(callback){
	if(window.localStorage.promoterId || GetQueryString('promoterId')){
		if(callback){
			callback();
		}
	}else{
		return alertWMsg('用户信息拉取失败,如果多次失败,请联系淘友记客服')
	}
}
//分页
function pageLoad(count,p_size,p,click){
	var totalPage = Math.ceil(count/p_size);
	var totalRecords = count;
	var pageNo = p;
	kkpager.generPageHtml({
		pno : pageNo,
		//总页码
		total : totalPage,
		//总数据条数
		totalRecords : totalRecords,
		isGoPage:true,
		isShowTotalPage:true,
		isShowCurrPage:true,
		mode : 'click',//默认值是link，可选link或者click
		click : function(n){			
			this.selectPage(n);
			window.p = n;
			click(n)
			return false;
		} 
	},true)  
}
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
//分享弹层
//实例化分享富文本框
if($('#myEditor1').length != '0'){
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
}
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
				data:{promoter_id:GetQueryString('promoterId') || window.localStorage.promoterId,title: theme,content:content},
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
//留言弹层
//实例化留言富文本框
if($('#myEditor').length != '0'){
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
}
$('.message').on('click',function(){
	$('.addNrMask').show();
	$('.addNr').animate({top:'50%'},200)
	document.body.onselectstart=document.body.ondrag=function(){
		return true;
	}
});
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
//打开留言弹层
$('.addN').on('click',function(){
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
				data:{promoter_id:GetQueryString('promoterId') || window.localStorage.promoterId,words: words,is_show:isShow},
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