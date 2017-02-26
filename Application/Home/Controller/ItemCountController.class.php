<?php
namespace Home\Controller;

use Think\Controller;
use Home\Controller\IndexController;

class ItemCountController extends IndexController {

	//页面
	public function page(){
		$this->display();
	}

	//商品列表
	public function search(){
		set_time_limit(0);

		//条数
		$limit = 20;

		//类型
		if( I('date_type') == 'week' ){
			//取周增量
			$field = '
				item.item_name,
				item.week_sale_add,
				coupon.week_take_add,
				item.type,
				item.alipay_item_id,
				roc
			';
			//排序 销量
			if( I('type') == 'sale' ) $order = 'item.week_sale_add desc ,item.create_time desc';
			//排序 领券量
			if( I('type') == 'take' ) $order = 'coupon.week_take_add desc ,item.create_time desc';
			//排序 转化率
			if( I('type') == 'roc' )  $order = 'roc desc,item.create_time desc';
			//只取领券数增量大于商品销量的
			$having = "coupon.week_take_add > item.week_sale_add";
		}else{
			//取日增量
			$field = '
				item.item_name,
				item.day_sale_add,
				coupon.day_take_add,
				item.type,
				item.alipay_item_id,
				roc
			';
			//排序 销量
			if( I('type') == 'sale' ) $order = 'item.day_sale_add desc,item.create_time desc';
			//排序 领券量
			if( I('type') == 'take' ) $order = 'coupon.day_take_add desc,item.create_time desc';
			//排序 转化率
			if( I('type') == 'roc' )  $order = 'roc desc,item.create_time desc';
			//只取领券数增量大于商品销量的
			$having = "coupon.day_take_add >= item.day_sale_add";
		}

		//条件
		$where = array(
				'item.status'   => 0,
				'coupon.status' => 0,
				'coupon.coupon_update_id' => array('gt',0),
				'item.item_update_id'=>array('gt',0)
			);

		//联查
		$join = array(
                    'join coupon on coupon.alipay_item_id = item.alipay_item_id',
                );

		//列表
		$list = M('item')
			->field($field)
			->join($join)
			->where($where)
			->limit($limit)
			->order($order)
			->having($having)
			->select();

		//添加链接
		foreach ($list as $key => $value) {
			$list[$key]['link'] = item_link($value['alipay_item_id'],$value['type']);
		}

		//返回
		if( count($list) > 0 ) $this->ajax_res(1,'成功',$list);

	}

	//商品数据总览
	public function all(){

		//券个数
		$arr['coupon_num'] = M('coupon')->where(array('status'=>0))->count();

		//商品数
		$arr['item_num'] = D('Item')->effective_count('all_num');

		//总计销量
		$arr['item_sale_sum'] = D('Item')->effective_count('all_sale');

		//平均佣金比例
		$arr['item_ratio_avg'] = round(D('Item')->effective_count('ratio_avg'),2);

		//平均转化率
		$arr['roc_avg'] = round(D('Item')->effective_count('roc_avg'),2);

		return $arr;

	}

}