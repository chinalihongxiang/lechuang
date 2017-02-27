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

		//条数
		$limit = 20;

		//类型
		if( I('date_type') == 'week' ){
			//取周增量
			$field = '
				item_name,
				week_sale_add,
				type,
				alipay_item_id,
				roc,
				take_num
			';
			//排序 销量
			if( I('type') == 'sale' ) $order = 'week_sale_add desc';
			//排序 领券量
			if( I('type') == 'take' ) $order = 'create_time desc';
			//排序 转化率
			if( I('type') == 'roc' )  $order = 'roc desc';
		}else{
			//取日增量
			$field = '
				item_name,
				day_sale_add,
				type,
				alipay_item_id,
				roc,
				take_num
			';
			//排序 销量
			if( I('type') == 'sale' ) $order = 'day_sale_add desc';
			//排序 领券量
			if( I('type') == 'take' ) $order = 'create_time desc';
			//排序 转化率
			if( I('type') == 'roc' )  $order = 'roc desc';
			$order = 'create_time desc';
		}

		//条件
		$where = array(
				'status'   => 0,
				'item_update_id'=>array('gt',0)
			);

		//列表
		$list = M('item')
			->field($field)
			->where($where)
			->order($order)
			->limit($limit)
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

		$this->ajax_res(1,'成功',$arr);

	}

}