<?php
namespace Home\Controller;

use Think\Controller;
use Home\Controller\IndexController;

class ItemDetailController extends IndexController {

	//按照天猫或者淘宝id查商品
	public function get_item_details_by_id(){

		$alipay_item_id = 542943969287;

		//id条件
		$where = array('alipay_item_id'=>$alipay_item_id);

		//查找item表
		$item_info = M('item')->where($where)->find();
		if( !$item_info ) return false;

		//参与活动天数
		$item_info['join_days'] = D('item')->get_item_join_time($item_info);

		//该商品所有优惠券已领券数
		$item_info['coupon_take_num'] = D('item')->get_item_coupon_take_num($item_info);

		//该商品券转化率
		$item_info['coupon_roc'] = D('item')->get_item_coupon_roc($item_info);
		exit;

		//

		dump($item_info);exit;

	}

}