<?php
namespace Home\Controller;

use Think\Controller;
use Home\Controller\IndexController;

class ItemDetailController extends IndexController {

	//商品详情，关键词查询页面
	public function page(){
		$this->display();
	}

	//按照天猫或者淘宝id查商品
	public function get_item_details_by_id(){

		$alipay_item_id = I('alipay_item_id') ? I('alipay_item_id') : $this->ajax_res(0,'请输入商品淘宝天猫id');

		//id条件
		$where = array('alipay_item_id'=>$alipay_item_id);

		//查找item表
		$item_info = M('item')->where($where)->find();
		if( !$item_info ) $this->ajax_res(0,'抱歉，没找到该商品');

		//参与活动天数
		$item_info['join_days'] = D('item')->get_item_join_time($item_info);

		//该商品所有优惠券已领券数
		$item_info['coupon_take_num'] = $item_info['take_num'];

		//该商品券转化率
		$item_info['coupon_roc'] = $item_info['roc'];

		//该商品优惠券列表
		$item_info['coupon_list'] = $this->coupon_list($alipay_item_id,$item_info['roc']);

		//该商品出现的采集群
		$item_info['group_list'] = $this->group_list($item_info);

		$this->ajax_res(1,'获得商品信息成功',$item_info);

	}

	//商品优惠券列表
	public function coupon_list($alipay_item_id,$roc){

		//获得该商品优惠券列表
		$item_coupons = D('item')->get_item_coupons($alipay_item_id);

		//循环
		foreach ($item_coupons as $key => $coupon) {
			//单券转化率
			$item_coupons[$key]['coupon_roc'] = $roc;
		}

		return $item_coupons;

	}

	//该商品出现的采集群
	public function group_list($item_info){

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

			//券价值
			$arr['price'] = M('coupon')->where(array('coupon_id'=>$value['coupon_id']))->getField('price');

			array_push($list, $arr);

		}

		return $list;

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
		$arr['max_ratio'] = M('item')
			->field('ratio,item_name,alipay_item_id,type')
			->where(array(
				'item_id' => array('in',$item_id_list)
			))
			->order('ratio desc')
			->limit(1)
			->select()[0];

		//最低佣金比例
		$arr['min_ratio'] = M('item')
			->where(array(
				'item_id' => array('in',$item_id_list)
			))
			->field('ratio,item_name,alipay_item_id,type')
			->order('ratio asc')
			->limit(1)
			->select()[0];

		//平均佣金比例
		$arr['avg_ratio'] = round(M('item')->where(array(
				'item_id' => array('in',$item_id_list)
			))->avg('ratio'),2);

		//最高价格
		$arr['max_price'] = M('item')->field('price,item_name,alipay_item_id,type')->where(array(
				'item_id' => array('in',$item_id_list)
			))->order('price desc')->limit(1)->select()[0];

		//最低价格
		$arr['min_price'] = M('item')->field('price,item_name,alipay_item_id,type')->where(array(
				'item_id' => array('in',$item_id_list)
			))->order('price asc')->limit(1)->select()[0];

		//平均转化率 avg_roc
		$arr['avg_roc'] = round(M('item')->where(array(
				'item_id' => array('in',$item_id_list)
			))->avg('roc'),2);

		//商品列表
		$arr['item_list'] = M('item')->where(array(
				'item_id' => array('in',$item_id_list),
				'take_num'=> array('gt',0),
				'sale'    => array('gt',0),
				'roc'     => array('gt',0)
			))->field('alipay_item_id,item_id,ratio,price,type,item_name,take_num,sale,roc')->select();

		//商品链接
		foreach ($arr['item_list'] as $key => $value) {
			$value['link'] = item_link($value['alipay_item_id'],$value['type']);
			$arr['item_list'][$key] = $value;
		}

		$this->ajax_res(1,'成功',$arr);

	}

}