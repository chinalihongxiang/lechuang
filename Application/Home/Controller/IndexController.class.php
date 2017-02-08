<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {

	public function index(){
    }

    //检查优惠券更新是否正常
    public function coupon_err_check(){
    	$arr = [];
    	//最新一次更新时间
    	$new_update = M('coupon_update')->order('coupon_update_id DESC')->find();
    	array_push($arr,array(
    			'title'   => '最新一次更新时间',
    			'content' => date('Y-m-d H:i:s',$new_update['time']),
    		));
    	//本次应该更新多少优惠券
    	
    	//本次更新了多少个优惠券
    	$this_coupon_num = M('coupon')->where(array('coupon_update_id'=>$new_update['coupon_update_id']))->count();
    	array_push($arr,array(
    			'title'   => '本次更新了多少个优惠券',
    			'content' => $this_coupon_num,
    		));

    	//打印
    	foreach ($arr as $key => $value) {
    		echo $value['title']."：".$value['content']."<hr>";
    	}
    }

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

	/*查看店铺id是否已存在
	* params
	* 手机号码 $alipay_store_id
	*/
	public function is_new_store($alipay_store_id){
	    //表
        $store   = M('store');
		$res = $store->where(array('alipay_store_id'=>$alipay_store_id))->count() > 0 ;
		if( $res ) return false;
		return true;
	}
}