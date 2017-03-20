$(function () {	
	document.body.onselectstart=document.body.ondrag=function(){
		return true;
	}
	$('#sname').focus();
	$('#sname').parent('div').css({'borderColor':'#00B2EE','boxShadow':'0 0 0.2px 0.2px #00B2EE','transition':'all .3s'})	
	$('.content ul li .input').on('focus',function () {
		$(this).parent('div').css({'borderColor':'#00B2EE','boxShadow':'0 0 0.2px 0.2px #00B2EE','transition':'all .3s'})			
	})
	$('.content ul li .input').on('blur',function () {
		$(this).parent('div').css({'borderColor':'#E2E2E2','boxShadow':'none'})
	})
	$('#sendcode').on('click',function () {
		var _this = $(this);
		window.email = $('#semail').val();
		if(email.length == 0){
			return alertMsg('邮箱不能为空')
		}else if(!checkEmail(email)){
			return alertMsg('邮箱格式不正确,请输入正确的邮箱')
		}
		$.ajax({
			type:"post",
			url:"/UserInfo/send_code",
			async:true,
			data:{email:email},
			success:function (data) {
				if(data.status == 1){
					sendCode(_this);
				}else{
					alertWMsg(data.msg)
				}
			},
			error:function () {
				alertWMsg('连接超时,请稍后再试')
			}
		});
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
			$(this).parent('div').next('div').html('<img src="../../../public/img/icon1.png" style="width: 16px;vertical-align: middle;margin-right: 5px;">可以注册');
			$(this).parent('div').next('div').css('color','#444');				
		}
	})
	$('#stel').on('blur',function () {
		window.tel = $('#stel').val();
		if(tel.length != 0){
			if(!checkMobile(tel)){
				$(this).parent('div').next('div').html('手机号码必须为11位1开头的数字组合');
				$(this).parent('div').next('div').css('color','red');
			}
		}else{
			$(this).parent('div').next('div').html('<img src="../../../public/img/icon1.png" style="width: 16px;vertical-align: middle;margin-right: 5px;">可以注册');
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
			$(this).parent('div').next('div').html('<img src="../../../public/img/icon1.png" style="width: 16px;vertical-align: middle;margin-right: 5px;">可以注册');
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
			$(this).parent('div').next('div').html('<img src="../../../public/img/icon1.png" style="width: 16px;vertical-align: middle;margin-right: 5px;">可以注册');
			$(this).parent('div').next('div').css('color','#444');				
		}
	})
	$('#sspwd').on('keyup',function () {
		window.spwd = $('#sspwd').val();
		if(spwd.length == 0){
			$(this).parent('div').next('div').html('密码不能为空')
			$(this).parent('div').next('div').css('color','red');	
		}else if(spwd != pwd){
			$(this).parent('div').next('div').html('两次密码输入不相同');
			$(this).parent('div').next('div').css('color','red');
		}else{
			$(this).parent('div').next('div').html('<img src="../../../public/img/icon1.png" style="width: 16px;vertical-align: middle;margin-right: 5px;">可以注册');
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
	if (0){
		return alertWMsg('用户名格式不正确')
	}else if( window.tel && !checkMobile(window.tel) ){
		return alertWMsg('手机号码格式不正确')
	}else if( !window.qq ){
		return alertWMsg('QQ号码格式不正确')
	}else if( !window.pwd || !window.spwd ){
		return alertWMsg('密码格式不正确')
	}else if(pwd != spwd){
		return alertWMsg('两次输入的密码不相同');
	}else if(idCode.length == 0){
		return alertWMsg('验证码不能为空');
	}else if (introduce.length == 0){
		return alertWMsg('自我简介不能为空');
	}else{
		$.ajax({
			type:"post",
			url:"",
			async:true,
			data:{name:name,tel:tel,qq:qq,email:email,idCode:idCode,pwd:hex_md5(pwd),introduce:introduce,promoter_code:GetQueryString('code')},
			success:function (data) {
				if(data.status == 1){
					alertRMsg(data.msg)
				}else{
					alertWMsg(data.msg)
				}
			},
			error:function () {
				alertWMsg('链接超时,请稍后再试')
			}
		});
	}
}