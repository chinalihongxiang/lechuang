$(function(){
    $.ajax({
        type:'get',
        url:'Seller/modify',
        data:{serller_id:'6'},
        success:function(data){
            if(data.status == 0){
                alertWMsg(data.msg)
            }else{
                data =  data.data;
                $('#sname').val(data.seller_name)
                $('#stel').val(data.seller_phone)
                $('#sqq').val(data.seller_qq)
                $('#semail').val(data.seller_email)
                $('#sintroduce').val(data.seller_desc)
                modify(data);
            }
        },
        error:function(){
            alertWMsg('连接超时,请稍后再试')
        }
    })
})
$('#sendcode').on('click',function () {
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
                sendCode();
            }else{
                alertWMsg(data.msg)
            }
        },
        error:function () {
            alertWMsg('连接超时,请稍后再试')
        }
    });
})
function modify(data){
    $('#sname').on('keyup',function(){
        if($('#semail').val() != data.seller_name){
            window.name = $('#sname').val();
            if (name.length == 0) {
                $(this).parent('div').next('div').html('用户名不能为空')
                $(this).parent('div').next('div').css('color','red');
            }else if(!checkUser(name)){
                $(this).parent('div').next('div').html('用户名中不可以存在特殊字符');
                $(this).parent('div').next('div').css('color','red');
            }else{
                $(this).parent('div').next('div').html('<img src="../../../public/img/icon1.png" style="width: 16px;vertical-align: middle;margin-right: 5px;">可以修改');
                $(this).parent('div').next('div').attr('modify','1');
                $(this).parent('div').next('div').css('color','#444');
            }
        }
    })
    $('#stel').on('keyup',function () {
        if($('#stel').val() != data.seller_phone) {
            console.log($('#stel').val())
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
        }
    })
    $('#sqq').on('keyup',function () {
        if($('#sqq').val() != data.seller_qq) {
            window.qq = $('#sqq').val();
            if(qq.length == 0){
                $(this).parent('div').next('div').html('QQ号码不能为空')
                $(this).parent('div').next('div').css('color','red');
            }else if(!checkQQ(qq)){
                $(this).parent('div').next('div').html('QQ号码必须为不为0开头的5-10位数字');
                $(this).parent('div').next('div').css('color','red');
            }else{
                $(this).parent('div').next('div').html('<img src="../../../public/img/icon1.png" style="width: 16px;vertical-align: middle;margin-right: 5px;">可以修改');
                $(this).parent('div').next('div').attr('modify','1');
                $(this).parent('div').next('div').css('color','#444');
            }
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
}
$(document).on('click','.sres',function(){
    if(!($('#sidcode').parents('li').is(':hidden'))){
        if($('#sidcode').val().length == 0){
            alertMsg('验证码不能为空')
        }else{
            var user = {
                modify : 'modify',
                name : $('#sname').val(),
                tel : $('#stel').val(),
                qq : $('#sqq').val(),
                email : $('#semail').val(),
                idCode : $('#sidcode').val(),
                introduce : $('#sintroduce').val()
            }
        }
    }else {
        var user = {
            modify : 'modify',
            name : $('#sname').val(),
            tel : $('#stel').val(),
            qq : $('#sqq').val(),
            introduce : $('#sintroduce').val()
        }
    }
    if ($('#sname').parent('div').next('div').attr('modify') != '1'){
        return alertWMsg('用户名格式不正确')
    }else if($('#stel').parent('div').next('div').attr('modify') != '1'){
        return alertWMsg('手机号码格式不正确')
    }else if($('#sqq').parent('div').next('div').attr('modify') != '1'){
        return alertWMsg('QQ号码格式不正确')
    }else if ($('#sintroduce').val().length == 0){
        return alertWMsg('自我简介不能为空');
    }else{

        $.ajax({
            type:"post",
            url:"Seller/modify",
            async:true,
            data:user,
            success:function (data) {
                data = JSON.parse(data);
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
})
