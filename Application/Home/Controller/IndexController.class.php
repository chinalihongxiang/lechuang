<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {

	/*异步返回
	* params
	* 状态     $status 0-错误 1-正确
	* 文字信息 $msg 
	* 数据     $data
	*/
	public function ajax_res($status,$msg = '',$data = ''){
		//有数据
		if( $data ){
			$this->ajaxReturn(array(
				'status' => $status,
				'msg'    => $msg,
				'data'   => $data
			));
		}else{
			//没有数据
			$this->ajaxReturn(array(
				'status' => $status,
				'msg'    => $msg,
			));
		}
	}

	/*查看注册邮箱是否已存在
	* params
	* 邮箱 $email
	*/
	public function is_new_email($email){
	    //表
        $seller   = M('seller');
        $promoter = M('promoter');
		$res = $seller->where(array('seller_email'=>$email))->count() > 0 || $promoter->where(array('promoter_email'=>$email))->count() > 0;
		if( $res ) return false;
		return true;
	}

	/*查看qq是否已存在
	* params
	* qq $qq
	*/
	public function is_new_qq($qq){
	    //表
        $seller      = M('seller');
        $promoter_qq = M('promoter_qq');
		$res = $seller->where(array('seller_qq'=>$qq))->count() > 0 || $promoter_qq->where(array('qq'=>$qq))->count() > 0;
		if( $res ) return false;
		return true;
	}

	/*查看手机号是否已存在
	* params
	* 手机号码 $phone
	*/
	public function is_new_phone($phone){
	    //表
        $seller   = M('seller');
        $promoter = M('promoter');
		$res = $seller->where(array('seller_phone'=>$phone))->count() > 0 || $promoter->where(array('promoter_phone'=>$phone))->count() > 0;
		if( $res ) return false;
		return true;
	}

    public function index(){
    }
}