<?php
namespace app\UserInfo\Controller;

use think\Controller;

class Seller extends Controller{

	//商户注册页面
	public function register_view(){
		$this->ajaxReturn(array());
		$this->display();
	}

}