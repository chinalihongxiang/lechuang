getpromoterId(wordsLoad); 
$(".mesDivCon").niceScroll({
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
function wordsLoad(){
	addMsg();
	setInterval('addMsg()',2000)
	$(document).on('click','.addNrBtn',function(){
		var isShow = $("input[name='type']:checked").val();
		var words = UM.getEditor('myEditor').getPlainTxt();
		if(words.length == 0 || words == '此处大家可以畅所欲言,吹牛逼,侃大山,晒收入,等等,暂不支持广告哦\n' || words == '\n'){		
				$('.addNrMask').hide();
				return alertMsg('留言内容不能为空');		
		}else{
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
							um.setContent('')
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
}
