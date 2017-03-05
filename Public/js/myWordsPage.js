$(function(){
	$(".contentShowDivTable").niceScroll({
		cursorcolor:"#00B2EE",
		cursoropacitymax:1,
		hwacceleration:true,
		touchbehavior:false,
		sensitiverail:true,
		hidecursordelay:1000,
		bouncescroll:true,
		cursorwidth:"5px",
		cursorborder:"0",
		cursorborderradius:"5px",
		spacebarenabled:true,
	});
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
	$('.addNrTime input').val(getNowFormatDate())
	$('.contentShowDivBtn').on('click',function(){
		$('.addNrMask').show();
		$('.addNr').animate({top:'50%'},200)
		document.body.onselectstart=document.body.ondrag=function(){
			return true;
		}
	});
	wordsLoad()
	if(window.localStorage.promoterId){
		window.promoter_id = window.localStorage.promoterId;
	}else{
		return alertWMsg('用户信息拉取失败,如果多次失败,请联系淘友记客服')
	}	
})
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
function wordsLoad(){
	$.ajax({
		url:'/words/myWords',
		type:'post',
		data:{promoter_id:window.localStorage.promoterId},
		success:function(data){
			if(data.status == 1){
				var  str = '<table><tr><td>发布时间</td><td>发布内容</td><td>私密/公开</td></tr>'
				$(data.data.list).each(function(i,e){
					var words = e.words.replace(/&amp;quot;/g,'"').replace(/&amp;lt;/g,'<').replace(/&amp;gt;/g,'>').replace(/\n/g,'');
					if(e.is_show == '2'){
						var  isShow = '公开';
					}else{
						var  isShow = '私密';
					}
					str += '<tr><td>'+e.create_time+'</td><td>'+words+'</td><td>'+isShow+'</td></tr>'
				})
				str +='</table>';
				$('.contentShowDivTable').html(str);
				//分页
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
						this.selectPage(n);
						wordspage(n);
						return false;
					}
				})
			}else{
				alertWMsg(data.msg)
			}				
		},
		error:function(){
			alertWMsg('加载超时,请稍后再试')
		}
	})
}
function wordspage(n){
	$.ajax({
		url:'/words/myWords',
		type:'post',
		data:{promoter_id:window.localStorage.promoterId,p:n},
		beforeSend:function(){
			$('.mask,.showL').show();
		},
		complete:function(){
			$('.mask,.showL').hide();
		},
		success:function(data){
			if(data.status == 1){
				var  str = '<table><tr><td>发布时间</td><td>发布内容</td><td>私密/公开</td></tr>'
				if(data.data.list.length > 0){
					$(data.data.list).each(function(i,e){
						var words = e.words.replace(/&amp;quot;/g,'"').replace(/&amp;lt;/g,'<').replace(/&amp;gt;/g,'>').replace(/\n/g,'');
						if(e.is_show == '2'){
							var  isShow = '公开';
						}else{
							var  isShow = '私密';
						}
						str += '<tr><td>'+e.create_time+'</td><td>'+words+'</td><td>'+isShow+'</td></tr>'
					})
				}else{
					str += '<tr><td>暂无数据</td><td>暂无数据</td><td>暂无数据</td></tr>'
				}
				str +='</table>';
				$('.contentShowDivTable').html(str);
		}else{
				alertWMsg(data.msg)				
			}
		},
		error:function(){
			alertWMsg('加载超时,请稍后再试')
		}		
				
	})
}