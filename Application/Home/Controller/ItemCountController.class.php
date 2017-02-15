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

		//条件
		$where = array(
				'item.status'   => 0,
				'coupon.status' => 0,
			);

		//字段
		$field = '
				item.item_name,
				item.sale,
				coupon.take_num,
				item.type,
				item.alipay_item_id,
				FORMAT((item.sale/coupon.take_num)*100,2) as roc
				';

		//联查
		$join = array(
                    'left join coupon on coupon.alipay_item_id = item.alipay_item_id',
                );

		//条数
		$limit = 20;

		//排序 销量
		if( I('type') == 'sale' ) $order = 'item.sale desc';

		//排序 领券量
		if( I('type') == 'take' ) $order = 'coupon.take_num desc';

		//排序 转化率
		if( I('type') == 'roc' )  $order = 'roc desc';

		//列表
		$list = M('item')
			->field($field)
			->join($join)
			->where($where)
			->limit($limit)
			->order($order)
			->having("coupon.take_num > item.sale")
			->select();

		//添加链接
		foreach ($list as $key => $value) {
			$list[$key]['link'] = item_link($value['alipay_item_id'],$value['type']);
		}

		$arr['item_list'] = $list;
		$arr['item_all_count'] = $this->all();

		//返回
		if( count($list) > 0 ) $this->ajax_res(1,'成功',$arr);

	}

	//商品数据总览
	public function all(){

		//券个数
		$arr['coupon_num'] = M('coupon')->where(array('status'=>0))->count();

		//商品数
		$arr['item_num'] = M('item')->where(array('status'=>0))->count();

		//总计销量
		$arr['item_sale_sum'] = M('item')->where(array('status'=>0))->sum('sale');

		//平均佣金比例
		$arr['item_ratio_avg'] = round(M('item')->where(array('status'=>0))->avg('ratio'),2);

		//平均转化率
		$arr['roc_avg'] = $this->get_roc_avg();

		return $arr;

	}

	//平均转化率
	public function get_roc_avg(){

		//条件
		$where = array(
				'item.status'   => 0,
				'coupon.status' => 0,
			);

		//字段
		$field = '
			item.sale,
			coupon.take_num,
			FORMAT((item.sale/coupon.take_num)*100,2) as roc
			';

		//联查
		$join = array(
                    'left join coupon on coupon.alipay_item_id = item.alipay_item_id',
                );

		//列表
		$list = M('item')
			->field($field)
			->join($join)
			->where($where)
			->having("coupon.take_num > item.sale")
			->select();

		//总数
		$count = count($list);

		//全部转化率相加
		$all_roc = 0;
		foreach ($list as $key => $value) {
			$all_roc = $all_roc + $value['roc'];
		}

		//转化率
		$roc = $all_roc/$count;

		return round($roc,2);

	}

}