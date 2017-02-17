$.ajax({
	type:'post',
	url:'/promoter/enter_info',
	data:{promoter_id:'6'},
	beforeSend:function(){
		$('.mask,.showL').show();			
	},
	success:function(data){
		if(data.status == 1){
			$('.mask,.showL').hide();
			var str = '<table><tr><td>排名</td><td>群名称</td><td>群号</td></tr>';
			$(data.data.group_list).each(function(i,e){
				str +='<tr><td>'+i+'</td><td>'+e.group_name+'</td><td>'+e.group_qq+'</td></tr>'
			})
			str +='</table>';
			$('.contentShowDivBottomLeftTable').html(str);
			var str1 = '<ul>';
			$(data.data.website_list).each(function(i,e){
				str1 +='<li><a onclick="window.open(\''+e.link+'\')">'+e.title+'</a></li>'
			})
			str1 += '</ul>';
			$('.contentShowDivBottomUl').html(str1);
		}else{
			$('.showL').hide();
			alertWMsg(data.msg)
		}
	},
	error:function(){
		$('.showL').hide();
		alertWMsg('连接超时,请稍后再试')
	}
})