$(function(){
    $(".shopList,.addShopDiv,.modShopDiv").niceScroll({
        cursorcolor:"#00B2EE",
        cursoropacitymax:1,
        hwacceleration:true,
        touchbehavior:false,
        sensitiverail:true,
        hidecursordelay:500,
        bouncescroll:true,
        cursorwidth:"5px",
        cursorborder:"0",
        cursorborderradius:"5px",
        spacebarenabled:true,
    });
    shopListLoad();
})
$('.addShopBtn').on('click',function(){
    $('.addShopDivMask').show();
    $('.addShopDiv').animate({top:'60px'})
    $('.addShopCancel,.close').one('click',function(){
        $('.addShopDiv').animate({top:'-1000px'},function(){
            $('.addShopDivMask').hide();
        })
    })
})
$(document).on('click','.shopListEd',function(){
    modShop(this);
})
$(document).on('click','.shopListDel',function(){
    delShop(this);
})
$(document).on('change','.fileUp input',function () {
    var imgShow = $('.fileUp div img');
    if (navigator.userAgent.indexOf("MSIE")!=-1) {
        var objUrl=this.value;
    }else{
        return alertMsg('您的浏览器不支持,请使用ie上传')
    }
    if (objUrl.split('.')[objUrl.split('.').length-1] == 'png' ||  objUrl.split('.')[objUrl.split('.').length-1] == 'jpg' ||  objUrl.split('.')[objUrl.split('.').length-1] == 'gif' ||  objUrl.split('.')[objUrl.split('.').length-1] == 'jpeg' ||  objUrl.split('.')[objUrl.split('.').length-1] == 'ico') {
        var fileupInputs = $('.fileUp input');
        for (var i = 0 ; i < fileupInputs.length; i++) {
            if (this == fileupInputs[i]) {
                imgUpLoad(this,imgShow[i]);
            }
        }

    }else{
        alertMsg('上传文件必须是png,jpg,gif,jpeg,ico格式')
    }
})
$('.addShopSave').on('click',function(){
    addShop();
})
function imgUpLoad(Obj,Img){
    //创建form
    var form_dom = document.createElement("form");
    //设置form请求地址
    form_dom.action = "/Seller/store_img_upload";
    //设置form请求方式
    form_dom.method = "post";
    //设置form上传类型(文件上传)
    form_dom.enctype = "multipart/form-data";
    //添加form至document
    document.body.appendChild(form_dom);
    form_dom.style.display = 'none';
    //选择添加了图片的input 放入form中
    var form = $(form_dom);
    $(Obj).appendTo(form);
    //ajax
    form.ajaxSubmit({
        success:function(data){
            data = JSON.parse(data);
            $(form_dom).remove();
            $(Img).attr('src',data.url);
            $(Img).attr('img-upload','1');
            Img.parentNode.style.width='140px';
            Img.parentNode.style.height='140px';
            Img.parentNode.style.padding='0';
            Img.style.width = "100%";
            Img.style.height = "100%";
            $(Img.parentNode).append(Obj);
        }
    })
}
function  addShop(){
    window.sname = $('#sname').val();
    window.stid = $('#stid').val();
    window.slink = $('#slink').val();
    window.sint = $('#sint').val();
    window.imgs = $('.fileUp div img');
    window.imgup = false;
    window.store_pic = '';
    imgs.each(function(i,e){
        if($(e).attr('img-upload') == '1'){
            imgup = true;
            store_pic += $(e).attr('src') + ',';
        }
    })
    if(sname.length == 0){return alertWMsg('店铺名称不能为空')}else if(!checkUser(sname)){return alertWMsg('店铺名称中不能包含特殊字符')};
    if(stid.length == 0){return alertWMsg('店铺ID不能为空')}else if(!ShopId(stid)){return alertWMsg('店铺ID只能为数字的组合')};
    if(slink.length == 0){return alertWMsg('店铺链接不能为空')}else if(!checkUrl(slink)){return alertWMsg('您输入店铺链接格式不正确')}
    if(sint.length == 0){return alertWMsg('店铺简介不能为空')}
    if(!imgup){return alertWMsg('您必须上传一张及一张以上的图片去证明您的资质')};
    var end = store_pic.length - 1;
    store_pic = store_pic.substr(0,end);
    $.ajax({
        type:'get',
        url:'/Seller/add_store',
        data:{seller_id:'6',store_name:sname,store_url:slink,store_desc:sint,store_pic:store_pic,alipay_store_id:stid},
        success:function(data){
            if(data.status == 1){
                alertRMsg(data.msg);
                $('.showRBtn').one('click',function(){
                    window.location.reload()
                })
            }else{
                alertWMsg(data.msg);
            }
        },
        error:function(){
            alertWMsg('连接接超时,请稍后再试')
        }
    })
}
function shopListLoad(){
    $.ajax({
        type:'get',
        url:'/seller/store_list',
        data:{seller_id:'6'},
		complete: function(){
			$('.mask').hide();
            $('.showL').hide();
		},
        success: function (data) {
            if(data.status == 1){
                if(data.data){
                    var str = '';
                    $(data.data).each(function(i,e){
                        if(e.status == 1){var status = '正常'}else if(e.status == 2){var status = '待审核'}else if(e.status == 3){var status = '审核未通过'};
                        str += '<div class="line"><div>'+e.store_name+'</div><div>'+status+'</div><div><div class="shopListEd" shopId = '+e.store_id+'>编辑</div><div class="shopListDel" shopId = '+e.store_id+' shopName = '+e.store_name+'>删除</div></div></div>'
                    })
                }else{
                    var str = '<div class="line"><div>暂无数据</div><div>暂无数据</div><div>暂无数据</div></div>';
                }                
                $('.shopList').append(str);
            }else{
				
                alertWMsg(data.msg)
            }
        },
        error: function () {
            alertWMsg('连接超时,请稍后再试');
        }
    })
}
function modShop(Obj){
    var store_id = $(Obj).attr('shopId');
    $.ajax({
        type:'post',
        url:'/seller/modify_store',
        data:{seller_id:6,store_id:store_id},
        success:function(data){
            if(data.status == 1){
                $('#sname1').val(data.data.store_name);
                $('#stid1').val(data.data.alipay_store_id);
                $('#slink1').val(data.data.store_url);
                $('#sint1').val(data.data.store_desc);
                $('.modShopSave').one('click',function(){
                    window.sname = $('#sname1').val();
                    window.sint = $('#sint1').val();
                    if(sname.length == 0){return alertWMsg('店铺名称不能为空')}else if(!checkUser(sname)){return alertWMsg('店铺名称中不能包含特殊字符')};
                    if(sint.length == 0){return alertWMsg('店铺简介不能为空')}
                    $.ajax({
                        type:'post',
                        url:'/seller/modify_store',
                        data:{modify:'modify',seller_id:6,store_id:store_id,store_name:sname,store_desc:sint},
                        success:function(data){
                            if(data.status == 1){
                                alertRMsg(data.msg);
                                $('.showRBtn').one('click',function(){
                                    window.location.reload()
                                })
                            }else{
                                alertWMsg(data.msg)
                            }
                        },
                        error:function(){alertWMsg('连接超时,请稍后再试')}
                    })
                })
                $('.modShopDivMask').show();
                $('.modShopDiv').animate({top:'60px'})
                $('.modShopCancel,.modclose').one('click',function(){
                    $('.modShopDiv').animate({top:'-1000px'},function(){
                        $('.modShopDivMask').hide();
                    })
                })
            }else{
                alertWMsg(data.msg)
            }

        },
        error:function(){alertWMsg('连接超时,请稍后再试')}
    })
}
function delShop(Obj){
	localStorage.shopId = $(Obj).attr('shopId');
	var shopName = $(Obj).attr('shopName');
	alertCMsg('确定要删除店铺名为 "'+shopName+'" 的店铺吗?');
 }
$(document).on('click','.showCBtn',function() {
	$('.showC').animate({top:'-1000px'},200,'swing',function(){
		$('.mask').css('display','none');
		$.ajax({
			type:'get',
			url:'/seller/del_store',
			data:{seller_id:6,store_id:localStorage.shopId,modify:'modify'},
			success:function(data){
				if(data.status == 1){
					alertRMsg(data.msg);
					$('.showRBtn').one('click',function(){
						window.location.reload()
					})
				}else{
					alertWMsg(data.msg)
				}
			},
			error:function(){
				alertWMsg('连接超时,请稍后再试')
			}
		})
	})
})
