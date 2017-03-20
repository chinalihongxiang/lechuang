$(function(){
	$('input[name = isUp]').on('change',function(){
		if($(this).attr('id')=='noUp'){
		   $('.webUpLink').slideUp();
		}else{
			$('.webUpLink').slideDown();
		}
	})
	$('.addWebBtn').on('click',function(){
		$('.addDiv').hide();
		$('.addGroup').hide();
		$('.addWeb').show();
	})
	$('.addGroupBtn').on('click',function(){
		$('.addDiv').hide();
		$('.addWeb').hide();
		$('.addGroup').show();
	})
})
$('.line .input').on('focus',function () {
	if($(this).val() == $(this).attr('placeholder')){
		$(this).val('')
	}
	$(this).parent('div').css({'borderColor':'#00B2EE','boxShadow':'0 0 5px #00B2EE','transition':'all .3s'})
})
$('.line .input').on('blur',function () {
	$(this).parent('div').css({'borderColor':'#E2E2E2','boxShadow':'none'});
	if($(this).val().length == 0){
		$(this).val($(this).attr('placeholder'))
	}
})
$('.webBtn').on('click',function(){
	var web_name = $('#webName').val();
	var web_link = $('#webLink').val();
	var web_Ulink = $('#webUlink').val();
	var web_int = $('#webInt').val();
	if(web_name.length == 0 || web_name == $('#webName').attr('placeholder')){
		return alertMsg('网站名称不能为空')
	}else if(!checkUser(web_name)){
		return alertMsg('网站名称中国不能存在特殊字符')
	}
	if(web_link.length == 0 || web_link == $('#webLink').attr('placeholder')){
		return alertMsg('网站链接不能为空')
	}else if(!checkUrl(web_link)){
		return alertMsg('你输入的网站链接不符合链接规则(链接中必须包括http://或https://),请重新输入')
	}
	if($('input[name = isUp]:checked').val() == 1 ){
		if(web_Ulink.length == 0 || web_Ulink == $('#webUlink').attr('placeholder')){
			return alertMsg('网站链接不能为空')
		}else if(!checkUrl(web_Ulink)){
			return alertMsg('你输入的网站链接不符合链接规则(链接中必须包括http://或https://),请重新输入')
		}
	}
	if(web_int.length == 0 || web_int == $('#webInt').attr('placeholder')){
		return alertMsg('网站简介不能为空')
	}
	if($('input[name = isUp]:checked').val() == 1){
		var data = {
			'web_name':web_name,
			'web_link':web_link,
			'type':'1',
			'item_link':web_Ulink,
			'web_desc':web_int,
			'promoter_id':window.localStorage.promoterId
		}
	}else{
		var data = {
			'web_name':web_name,
			'web_link':web_link,
			'type':'2',
			'web_desc':web_int,
			'promoter_id':window.localStorage.promoterId
		}
	}
	$.ajax({
		type:'post',
		url:'/Promoter/upWeb',
		data:data,
		success:function(data){
			if(data.status == 1){
				alertRMsg(data.msg)
			}else{
				alertWMsg(data.msg)
			}
		},
		error:function(){
			alertWMsg('连接超时,请稍后再试')
		}
	})
})
$('.groupBtn').on('click',function(){
	var  group_name = $('#groupName').val();
	var  check_qq = $('#groupQQ1').val();
	var  get_qq = $('#groupQQ2').val();
	var  desc = $('#groupInt').val();
	if(group_name.length == 0 || group_name == $('#groupName').attr('placeholder')){
		return alertMsg('群名称不能为空')
	}
	if(check_qq.length == 0 || check_qq == $('#groupQQ1').attr('placeholder')){
		return alertMsg('审核群号码不能为空')
	}else if(!checkQQ(check_qq)){
		return alertMsg('审核群号码只能为5-10的数字组合')
	}
	if(get_qq.length == 0 || get_qq == $('#groupQQ2').attr('placeholder')){
		return alertMsg('审核群号码不能为空')
	}else if(!checkQQ(get_qq)){
		return alertMsg('审核群号码只能为5-10的数字组合')
	}
	if(desc.length == 0 || desc == $('#groupInt').attr('placeholder')){
		return alertMsg('群简介不能为空')
	}
	$.ajax({
		type:'post',
		url:'/Promoter/upGroup',
		data:{'group_name':group_name,'check_qq':check_qq,'get_qq':get_qq,'desc':desc,'promoter_id':window.localStorage.promoterId},
		success:function(data){
			if(data.status == 1){
				alertRMsg(data.msg)
			}else{
				alertWMsg(data.msg)
			}
		},
		error:function(){
			alertWMsg('连接超时,请稍后再试')
		}
	})		
})