<?php
namespace Home\Controller;

use Think\Controller;
use Home\Controller\IndexController;

class CronController extends Controller {

	//更新脚本页面
	public function updateAllPage(){

		$this->display();

	}

	//更新group表所有
	public function updateAll(){
		set_time_limit(0);

		$group_id_list = M('group')->getField('group_id',true);

		foreach ($group_id_list as $key => $value) {
			$this->updateGroup($value);
		}

		$miao = ($time_s-time())/1000;

		file_put_contents('GroupUpdateLog.txt',intdate(time()).PHP_EOL,FILE_APPEND);

	}

	//更新group
	public function updateGroup($group_id){

		//获得这10个群过去24小时的所有发券记录
		$all_coupon_log = D('Group')->newCoupon($group_id);

		//优惠券id数组
		$all_coupon_id_arr = [];
		foreach ($all_coupon_log as $key => $value) {
			array_push($all_coupon_id_arr,$value['coupon_id']);
		}

		//今天无重复优惠券id数组
		$new_coupon_id_arr = array_unique($all_coupon_id_arr);

		//今天新单个数
		$arr['today_new_coupon_num'] = count($new_coupon_id_arr);

		//今日重复单数
		$arr['today_repeat_coupon_num'] = count($all_coupon_id_arr) - $arr['today_new_coupon_num'];

		//无重复商品id数组
		$new_item_id_arr = [];
		foreach ($all_coupon_log as $key => $value) {
			array_push($new_item_id_arr,$value['item_id']);
		}
		$new_item_id_arr = array_unique($new_item_id_arr);

		//今日总领取数增量
		$where = array(
				'status' 		   => 0,
				'coupon_id' 	   => array('in',$new_coupon_id_arr),
				'coupon_update_id' => array('gt',0),
				'take_num'         => array('gt',0)
			);
		$arr['today_all_take'] = $new_coupon_id_arr ? M('coupon')->where($where)->sum('take_num') : 0;

		//今日总销量增量
		$where = array(
				'status' 		 => 0,
				'item_id'   	 => array('in',$new_item_id_arr),
				'item_update_id' => array('gt',0),
				'sale'       	 => array('gt',0)
			);
		$arr['today_all_sale'] = $new_item_id_arr ? M('item')->where($where)->sum('sale') : 0;

		//今日平均转化率
		$arr['today_roc_avg'] = ( $arr['today_all_sale'] / $arr['today_all_take'] ) * 100;

		//更新数据到group表
		M('group')->where(array('group_id'=>$group_id))->save($arr);

	}

	//更新商品
	public function allItemUpdate(){
		set_time_limit();

		//取得需要更新总次数
		$all_count = M('item')->where(array('status'=>0))->count();

		//一次更新100条看需要更新多少次
		$once = 100;

		$times = ceil( $all_count / $once );

		//缓存查看当前更新第几次
		$index_s = S('allItemUpdate_index') ? S('allItemUpdate_index') : 1;

		//取得需要更新的商品id数组
		$item_id_list = M('item')->limit(($index_s-1)*$once,$once)->where(array('status'=>0))->getField('item_id',true);

		foreach ($item_id_list as $key => $value) {
			$this->itemUpdate($value);
		}

		//更新页数
		$index_s++;

		//缓存记录
		S('allItemUpdate_index',$index_s);
		file_put_contents('allItemUpdate.txt','index_s:'.$index_s.' '.intdate(time()).PHP_EOL,FILE_APPEND);

	}

	//商品领券量 转化率更新
	public function itemUpdate($item_id){

		//取得商品信息
		$info = M('item')->where(array('item_id'=>$item_id))->find();

		//取得商品总领券量
		$arr['take_num'] = M('coupon')->where(array(
				'alipay_item_id'   => $info['alipay_item_id'],
				'status'           => 0,
				'coupon_update_id' => array('gt',0)
			))->sum('take_num');

		//取得商品转化率
		$arr['roc'] = $arr['take_num'] ? ($info['sale'] / $arr['take_num'])*100 : 0;

		//更新该商品
		M('item')->where(array('item_id'=>$item_id))->save($arr);

	}

}