<?php
namespace Home\Controller;

use Think\Controller;
use Home\Controller\IndexController;

class ItemDetailController extends IndexController {

	//按照天猫或者淘宝id查商品
	public function get_item_details_by_id(){

		$alipay_item_id = I('alipay_item_id') ? I('alipay_item_id') : $this->ajax_res(0,'请输入商品淘宝天猫id');

		//id条件
		$where = array('alipay_item_id'=>$alipay_item_id);

		//查找item表
		$item_info = M('item')->where($where)->find();
		if( !$item_info ) ajax_res(0,'抱歉，没找到该商品');

		//参与活动天数
		$item_info['join_days'] = D('item')->get_item_join_time($item_info);

		//该商品所有优惠券已领券数
		$item_info['coupon_take_num'] = D('item')->get_item_coupon_take_num($item_info);

		//该商品券转化率
		$item_info['coupon_roc'] = D('item')->get_item_coupon_roc($item_info);

		$this->ajax_res(1,'获得商品信息成功',$item_info);

	}

	//商品优惠券列表
	public function coupon_list(){

		$alipay_item_id = I('alipay_item_id') ? I('alipay_item_id') : $this->ajax_res(0,'请输入商品淘宝天猫id');

		//id条件
		$where = array('alipay_item_id'=>$alipay_item_id);

		//查找item表
		$item_info = M('item')->where($where)->find();
		if( !$item_info ) ajax_res(0,'抱歉，没找到该商品');

		//获得该商品优惠券列表
		$item_coupons = D('item')->get_item_coupons($alipay_item_id);

		//循环
		foreach ($item_coupons as $key => $coupon) {
			//单券转化率
			$item_coupons[$key]['coupon_roc'] = D('item')->get_one_coupon_roc($item_info,$coupon);
		}

		$this->ajax_res(1,'成功',$item_coupons);

	}

	//该商品出现的采集群
	public function group_list(){

		$alipay_item_id = I('alipay_item_id') ? I('alipay_item_id') : $this->ajax_res(0,'请输入商品淘宝天猫id');

		//id条件
		$where = array('alipay_item_id'=>$alipay_item_id);

		//查找item表
		$item_info = M('item')->where($where)->find();
		if( !$item_info ) ajax_res(0,'抱歉，没找到该商品');		

		//获得该商品出现的采集群
		$group_list = M('group_log')->where(array(
				'item_id' => $item_info['item_id']
			))->select();

		//获得需要的信息
		$list = [];
		foreach ($group_list as $key => $value) {
			
			//群名称
			$arr['group_name'] = M('group')->where(array('group_id'=>$value['group_id']))->getField('group_name');

			//时间
			$arr['time'] = intdate($value['create_time']);

			//券id
			$arr['alipay_coupon_id'] = M('coupon')->where(array('coupon_id'=>$value['coupon_id']))->getField('alipay_coupon_id');

			array_push($list, $arr);

		}

		$this->ajax_res(1,'成功',$list);

	}

	//关键词查询详情
	public function keywords(){

		//关键词
		$keywords = I('keywords') ? I('keywords') : $this->ajax_res(0,'请输入关键词');

		//关键词下商品
		$item_id_list = M('item')->where(array(
				'item_name' => array('like',"%$keywords%")
			))->getField('item_id',true);

		//无商品
		if( !$item_id_list || count($item_id_list) <= 0 ) $this->ajax_res(0,'对不起，没有找到关键词下的商品');

		//最高佣金比例
		$arr['max_ratio'] = M('item')->where(array(
				'item_id' => array('in',$item_id_list)
			))->order('ratio desc')->getField('ratio');

		//最低佣金比例
		$arr['min_ratio'] = M('item')->where(array(
				'item_id' => array('in',$item_id_list)
			))->order('ratio asc')->getField('ratio');

		//平均佣金比例
		$arr['avg_ratio'] = M('item')->where(array(
				'item_id' => array('in',$item_id_list)
			))->avg('ratio');

		//最高价格
		$arr['max_price'] = M('item')->where(array(
				'item_id' => array('in',$item_id_list)
			))->order('price desc')->getField('price');

		//最低价格
		$arr['min_price'] = M('item')->where(array(
				'item_id' => array('in',$item_id_list)
			))->order('price asc')->getField('price');

		//平均价格
		$arr['avg_price'] = M('item')->where(array(
				'item_id' => array('in',$item_id_list)
			))->avg('price');

		//商品列表
		$arr['item_list'] = M('item')->where(array(
				'item_id' => array('in',$item_id_list)
			))->filed('alipay_item_id,item_id,ratio,price')->select();

		$this->ajax_res(1,'成功',$arr);

	}

}