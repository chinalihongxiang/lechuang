$(function(){
    $.ajax({
        type:'post',
        url:'/Promoter/modify',
        data:{promoter_id:'7'},
        success:function(data){
            if(data.status == 0){
                alertWMsg(data.msg)
            }else{
                data =  data.data;
                $('#sname').val(data.promoter_name)
                $('#stel').val(data.promoter_phone)
                $(data.promoter_qq).each(function(i,e){
					$('.sqq').eq(i).val(e.qq);
					$('.sqqint').eq(i).val(e.desc);
				})
                $('#semail').val(data.promoter_email)
                $('#sintroduce').val(data.promoter_desc)
                modify(data);
            }
        },
        error:function(){
            alertWMsg('连接超时,请稍后再试')
        }
    })
    $(document).on('click','#sendcode',function () {
		var _this = this; 
        window.email = $('#semail').val();
        if(email.length == 0){
            return alertMsg('邮箱不能为空')
        }else if(!checkEmail(email)){
            return alertMsg('邮箱格式不正确,请输入正确的邮箱');
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
})
function modify(data){
    $('#sname').on('keyup',function(){
        if($('#sname').val() != data.seller_name){
            window.name = $('#sname').val();
            if (name.length == 0) {
                $(this).parent('div').next('div').html('用户名不能为空');
                $(this).parent('div').next('div').attr('modify','0');
                $(this).parent('div').next('div').css('color','red');
            }else if(!checkUser(name)){
                $(this).parent('div').next('div').html('用户名中不可以存在特殊字符');
                $(this).parent('div').next('div').attr('modify','0');
                $(this).parent('div').next('div').css('color','red');
            }else{
                $(this).parent('div').next('div').html('<img src="../../../public/img/icon1.png" style="width: 16px;vertical-align: middle;margin-right: 5px;">可以修改');
                $(this).parent('div').next('div').attr('modify','1');
                $(this).parent('div').next('div').css('color','#444');
            }
        }else{
            $(this).parent('div').next('div').html('');
            $(this).parent('div').next('div').attr('modify','1');
        }
    })
    $('#stel').on('keyup',function () {
        if($('#stel').val() != data.seller_phone) {
            window.tel = $('#stel').val();
            if (tel.length != 0) {
                if (!checkMobile(tel)) {
                    $(this).parent('div').next('div').html('手机号码必须为11位1开头的数字组合');
                    $(this).parent('div').next('div').attr('modify','0');
                    $(this).parent('div').next('div').css('color', 'red');
                }else{
                    $(this).parent('div').next('div').html('<img src="../../../public/img/icon1.png" style="width: 16px;vertical-align: middle;margin-right: 5px;">可以修改');
                    $(this).parent('div').next('div').attr('modify','1');
                    $(this).parent('div').next('div').css('color', '#444');
                }
            } else{
                $(this).parent('div').next('div').html('<img src="../../../public/img/icon1.png" style="width: 16px;vertical-align: middle;margin-right: 5px;">可以修改');
                $(this).parent('div').next('div').attr('modify','1');
                $(this).parent('div').next('div').css('color', '#444');
            }
        }else{
            $(this).parent('div').next('div').html('');
            $(this).parent('div').next('div').attr('modify','1');
        }
    })
    $('#semail').on('keyup',function(){
        if($('#semail').val() != data.seller_email){
            $('#semail').parent().next().show();
            $('#sidcode').parents('li').show();
        }else{
            $('#semail').parent().next().hide();
            $('#sidcode').parents('li').hide();
        }
    })
    $('.sqq').on('keyup',function(){
        if(checkQQ($(this).val())){
            $(this).parents('li').children('div:last-child').children('div:last-child').children('.sqqint').removeAttr('disabled')
        }else if($(this).val().length == 0){
			if(this == $('#sqq1').get(0)){
				$('#sqq2,#sqqint2,#sqq3,#sqqint3').val('');
				$('#sqq2,#sqqint2,#sqq3,#sqqint3').attr('disabled','disabled');
			}
			if($(this) == $('#sqq2').get(0)){
				$('#sqq3,#sqqint3').val('');
				$('#sqq3,#sqqint3').attr('disabled','disabled');
			}
		}
    })
	$('.sqqint').on('keyup',function(){
		if($(this).val().length == 0){		
			if(this == $('#sqqint1').get(0)){
				$('#sqq2,#sqqint2,#sqq3,#sqqint3').attr('disabled','disabled')
			}else if(this == $('#sqqint2').get(0)){
				$('#sqq3,#sqqint3').attr('disabled','disabled');
				$('#sqq2,#sqq3,#sqqint3').val('');	
				$('#sqq2').attr('saveqq','0')				
			}else if(this == $('#sqqint3').get(0)){
				$('#sqq3').val('');	
				$('#sqq3').attr('saveqq','0')
			}
		}else{
			if(this == $('#sqqint1').get(0)){
				$('#sqq2').removeAttr('disabled')
			}else if(this == $('#sqqint2').get(0)){
				$('#sqq3').removeAttr('disabled')				
			}
		}
	})
	if ($('#sqqint1').val().length != 0) {
		$('#sqq2').removeAttr('disabled')
	}else if($('#sqqint1').val().length == 0){
		$('#sqq2').attr('disabled','disabled')
	}
	if ($('#sqqint2').val().length != 0) {
		$('#sqq3,#sqqint2').removeAttr('disabled');
	}else if($('#sqqint2').val().length == 0){
		$('#sqq3').attr('disabled','disabled')
	}
	if($('#sqqint3').val().length != 0){
		$('#sqqint3').removeAttr('disabled');
	}
}
$(document).on('click','.sres',function(){
	window.qq1 = $('#sqq1').val();
    window.qq2 = $('#sqq2').val();
    window.qq3 = $('#sqq3').val();
    if(qq1.length == 0 && qq2.length == 0 && qq3.length == 0){
        return alertMsg('QQ号码不能为空');
    }
   for(var i = 0 ;i < $('.sqq').length; i++){
	   if ($('.sqq').eq(i).val().length != 0 && checkQQ($('.sqq').eq(i).val())){
			$('.sqq').eq(i).attr('saveqq','1')
		}else if($('.sqq').eq(i).val().length != 0 && !checkQQ($('.sqq').eq(i).val())){
			return alertMsg('QQ号码只能为5-10位且不为0开头的数字的组合');
		}
   }
    var qqArr = $('.input[saveqq = 1]');
    var qq = [];
    qqArr.each(function(i,e){
        if($('.sqqint').eq(i).val() && $(e).val()){
            var obj = {
                qq:$(e).val(),
                desc:$('.sqqint').eq(i).val(),
            }
            qq.push(obj)
        }else if($(e).val()){
            var obj = {
                qq:$(e).val(),
            }
            qq.push(obj)
        }else if(!$(e).val()){
            return true;
        }
    })
    if(!($('#sidcode').parents('li').css('display') == 'none')){
        if($('#sidcode').val().length == 0){
            return alertMsg('验证码不能为空')
        }else{
            var user = {
                modify : 'modify',
                promoter_id : '7',
                promoter_name : $('#sname').val(),
                promoter_phone : $('#stel').val(),
                promoter_qq : qq,
                promoter_email : $('#semail').val(),
                idCode : $('#sidcode').val(),
                promoter_desc : $('#sintroduce').val()
            }
        }
    }else {
        var user = {
            modify : 'modify',
            promoter_id : '7',
            promoter_name : $('#sname').val(),
            promoter_phone : $('#stel').val(),
            promoter_qq : qq,
            promoter_email : $('#semail').val(),
            promoter_desc : $('#sintroduce').val()
        }
    }
    if ($('#sname').parent('div').next('div').attr('modify') != '1'){
        return alertWMsg('用户名格式不正确')
    }else if($('#stel').parent('div').next('div').attr('modify') != '1'){
        return alertWMsg('手机号码格式不正确')
    }else if ($('#sintroduce').val().length == 0){
        return alertWMsg('自我简介不能为空');
    }else{

        $.ajax({
            type:"get",
            url:"/Promoter/modify",
            async:true,
            data:user,
            success:function (data) {
                if(data.status == 1){
                    alertRMsg(data.msg)
					$('.showRBtn').one('click',function(){
						window.location.reload()
					})
                }else{
                    alertWMsg(data.msg)
                }
            },
            error:function () {
                alertWMsg('链接超时,请稍后再试')
            }
        });
    }
})
    