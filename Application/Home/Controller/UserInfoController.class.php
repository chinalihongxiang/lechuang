<?php
namespace Home\Controller;
use Think\Controller;
class UserInfoController extends Controller {

	//注册选择身份页面
	public function choose(){
        $seller = M('seller');
        $arr = array(
                'seller_name' => 'li'
            );
        $seller -> add($arr);
		$this->display();
	}

	//商户注册接口
    public function seller_register(){
        $this->display();
    }

    //淘客注册接口
    public function promoter_register(){
    	$this->display();
    }
}