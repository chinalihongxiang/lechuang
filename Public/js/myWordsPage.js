getpromoterId(myWordsLoad);  
function myWordsLoad(){
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
	$('.contentShowDivBtn').on('click',function(){
		$('.addNrMask').show();
		$('.addNr').animate({top:'50%'},200)
		document.body.onselectstart=document.body.ondrag=function(){
			return true;
		}
	});
	wordsLoad()	
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