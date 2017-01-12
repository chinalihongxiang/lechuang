		
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
    		return RegExp(/^(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}$/).test(str);  
		}
		//QQ正则验证
		function checkQQ(str) {  
            return RegExp(/^[1-9][0-9]{4,9}$/).test(str);    
        }  
		//密码验证
		function checkPwd (str) {
			return RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/).test(str);
		}
	