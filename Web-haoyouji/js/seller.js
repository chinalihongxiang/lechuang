$(function () {	
		$('#sname').focus();
		$('#sname').parent('div').css({'borderColor':'#00B2EE','boxShadow':'0 0 0.2px 0.2px #00B2EE','transition':'all .3s'})	
		$('.content ul li .input').on('focus',function () {
			$(this).parent('div').css({'borderColor':'#00B2EE','boxShadow':'0 0 0.2px 0.2px #00B2EE','transition':'all .3s'})			
		})
		$('.content ul li .input').on('blur',function () {
			$(this).parent('div').css({'borderColor':'#E2E2E2','boxShadow':'none'})
		})
		$('#sendcode').on('click',function () {
			window.email = $('#semail').val();
			if(email.length == 0){
				return alertMsg('邮箱不能为空')
			}else if(!checkEmail(email)){
				return alertMsg('邮箱格式不正确,请输入正确的邮箱')
			}
			sendCode($(this));
		})
		$('#sname').on('blur',function () {
			window.name = $('#sname').val();
			if (name.length == 0) {
				$(this).parent('div').next('div').html('用户名不能为空')
				$(this).parent('div').next('div').css('color','red');
			}else if(!checkUser(name)){
				$(this).parent('div').next('div').html('用户名中不可以存在特殊字符');
				$(this).parent('div').next('div').css('color','red');
			}else{
				$(this).parent('div').next('div').html('<img src="../img/icon1.png" style="width: 16px;vertical-align: middle;margin-right: 5px;">可以注册');
				$(this).parent('div').next('div').css('color','#444');				
			}
		})
		$('#stel').on('blur',function () {
			window.tel = $('#stel').val();
			if(tel.length == 0){
			$(this).parent('div').next('div').html('手机号码不能为空')
				$(this).parent('div').next('div').css('color','red');
			}else if(!checkMobile(tel)){
				$(this).parent('div').next('div').html('手机号码必须为11位1开头的数字组合');
				$(this).parent('div').next('div').css('color','red');
			}else{
				$(this).parent('div').next('div').html('<img src="../img/icon1.png" style="width: 16px;vertical-align: middle;margin-right: 5px;">可以注册');
				$(this).parent('div').next('div').css('color','#444');				
			}
		})
		$('#sqq').on('blur',function () {
			window.qq = $('#sqq').val();
			if(qq.length == 0){
			$(this).parent('div').next('div').html('QQ号码不能为空')
				$(this).parent('div').next('div').css('color','red');
			}else if(!checkQQ(qq)){
				$(this).parent('div').next('div').html('QQ号码必须为不为0开头的5-10位数字');
				$(this).parent('div').next('div').css('color','red');
			}else{
				$(this).parent('div').next('div').html('<img src="../img/icon1.png" style="width: 16px;vertical-align: middle;margin-right: 5px;">可以注册');
				$(this).parent('div').next('div').css('color','#444');				
			}
		})
		$('#spwd').on('blur',function () {
			window.pwd = $('#spwd').val();
			if(pwd.length == 0){
			$(this).parent('div').next('div').html('密码不能为空')
				$(this).parent('div').next('div').css('color','red');	
			}else if(!checkPwd(pwd)){
				$(this).parent('div').next('div').html('密码必须为6-16位数字、字母的组合');
				$(this).parent('div').next('div').css('color','red');
			}else{
				$(this).parent('div').next('div').html('<img src="../img/icon1.png" style="width: 16px;vertical-align: middle;margin-right: 5px;">可以注册');
				$(this).parent('div').next('div').css('color','#444');				
			}
		})
		$('#sspwd').on('blur',function () {
			window.spwd = $('#sspwd').val();
			if(spwd.length == 0){
			$(this).parent('div').next('div').html('密码不能为空')
				$(this).parent('div').next('div').css('color','red');	
			}else if(spwd != pwd){
				$(this).parent('div').next('div').html('两次密码输入不相同');
				$(this).parent('div').next('div').css('color','red');
			}else{
				$(this).parent('div').next('div').html('<img src="../img/icon1.png" style="width: 16px;vertical-align: middle;margin-right: 5px;">可以注册');
				$(this).parent('div').next('div').css('color','#444');				
			}
		})
		
		$('.sres').on('click',function(){
			submit();
		})
		$(window).on('keydown',function(e){
			var e = window.event || e;
			if(e.keyCode == '13'){
				submit();
			}
		})
})		
				
		//提交注册
		function submit () {
			window.name = $('#sname').val();
			window.tel = $('#stel').val();
			window.qq = $('#sqq').val();
			window.email = $('#semail').val();
			window.idCode = $('#sidcode').val();
			window.pwd = $('#spwd').val();
			window.spwd = $('#sspwd').val();
			window.introduce = $('#sintroduce').val();
			if ($('#sname').parent('div').next('div').html() !='<img src="../img/icon1.png" style="width: 16px;vertical-align: middle;margin-right: 5px;">可以注册'){
				return alertMsg('用户名格式不正确')
			}else if($('#stel').parent('div').next('div').html() !='<img src="../img/icon1.png" style="width: 16px;vertical-align: middle;margin-right: 5px;">可以注册'){
				return alertMsg('手机号码格式不正确')
			}else if($('#sqq').parent('div').next('div').html() !='<img src="../img/icon1.png" style="width: 16px;vertical-align: middle;margin-right: 5px;">可以注册'){
				return alertMsg('QQ号码格式不正确')
			}else if($('#spwd').parent('div').next('div').html() !='<img src="../img/icon1.png" style="width: 16px;vertical-align: middle;margin-right: 5px;">可以注册'){
				return alertMsg('密码格式不正确')
			}else if(pwd != spwd){
				return alertMsg('两次输入的密码不相同');
			}else if(idCode.length == 0){
				return alertMsg('验证码不能为空');
			}else if (introduce.length == 0){
				return alertMsg('自我简介不能为空');
			}else{
				alertMsg('注册成功');
			}
			
		}
		
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
	