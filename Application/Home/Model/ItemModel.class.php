<?php
namespace Home\Model;
use Think\Model;
class ItemModel extends Model{

	//商品库有效商品个数
	public function effective_count($type){

		//条件
		$where = array(
				'item.status'   => 0,
				'coupon.status' => 0,
				'coupon.coupon_update_id' => array('gt',0),
				'item.item_update_id'=> array('gt',0)
			);

		//联查
		$join = array(
                    'join coupon on coupon.alipay_item_id = item.alipay_item_id',
                );

		//有效商品总数
		if( $type == 'all_num' ) return  M('item')->join($join)->where($where)->count();

		//总计销量
		if( $type == 'all_sale' ) return  M('item')->join($join)->where($where)->sum('sale');

		//平均佣金比例
		if( $type == 'ratio_avg' ) return  M('item')->join($join)->where($where)->avg('ratio');

		//平均转化率
		$where['roc'] = array('neq',0);
		if( $type == 'roc_avg' ) return  M('item')->join($join)->where($where)->avg('roc');

	}

    //参与活动天数
	public function get_item_join_time($item_info){

		//获得此商品第一次出现的时间
		$appear_time = $item_info['create_time'];

		//获得此商品最后一次更新的时间
		$end_time = M('item_update')->where(array('item_update_id'=>$item_info['item_update_id']))->getField('time');

		//计算已参加活动多少天
		$days = ($end_time - $appear_time) / 86400;

		//处理
		if( (int)$days <= 0 ) $days = 1;

		//返回
		return (int) $days;

	}

	//获得某商品所有优惠券
	public function get_item_coupons($alipay_item_id){

		return M('coupon')->where(array('alipay_item_id'=>$alipay_item_id))->select();

	}

	//该商品所有优惠券已领券数
	public function get_item_coupon_take_num($item_info){

		$take_num = M('coupon')->where(array(
				'alipay_item_id' => $item_info['alipay_item_id']
			))->sum('take_num');

		return $take_num;

	}

	//获得某时间点商品销量
	public function get_item_one_time_sale($item_id,$time){

		//获得时间点item_update_id
		$item_update_id = $this->get_item_update_id_by_time($time);

		//获得本次更新的商品销量
		$sale = M('item_log')->where(array(
				'update_id' => array('elt',$item_update_id),
				'item_id'   => $item_id
			))->limit(1)->order('item_log_id desc')->getField('value');

		//返回
		return $sale;

	}

	//获得某时间点某商品所有优惠券领券数
	public function get_item_coupons_take_num($item_info,$time){

		//获得该商品所有优惠券
		$item_coupons = $this->get_item_coupons($item_info['alipay_item_id']);

		//该时间点所有优惠券领券数求和
		$all_take_num = 0;
		foreach ($item_coupons as $key => $value) {
			
			//单张优惠券该时间点的领券数
			$coupon_time_take_num = D('coupon')->get_coupon_time_take_num($value,$time);

			$all_take_num = $all_take_num + $coupon_time_take_num;

		}

		//返回
		return $all_take_num;

	}

	//获得距离某时间最近的item_update_id
	public function get_item_update_id_by_time($time = 0){

		//时间点正好有对应
		$item_update_id = M('item_update')->where(array('time'=>$time))->getField('item_update_id');
		if( $item_update_id ) return $item_update_id;

		//查看距离该时间点最近的上一次更新
		$last = M('item_update')->where(array(
				'time' => array('elt',$time),
			))->order('time desc')->limit(1)->find();

		//查看两者时间差
		$last_ads = $last ? $time - $last['time'] : 0;

		//查看距离该时间点最近的下一次更新
		$next = M('item_update')->where(array(
				'time' => array('gt',$time),
			))->order('time asc')->limit(1)->find();

		//查看两者时间差
		$next_abs = $next ? $next['time'] - $time : 0;

		if( $last_ads == 0 || $next_abs == 0 ){
			//如果有一方为0 则取有值的
			$item_update_id = $next_abs == 0 ? $last['item_update_id'] : $next['item_update_id'];
		}else{
			//取时间差少的那次update的id值
			$item_update_id = abs($next_abs) > abs($last_ads) ? $last['item_update_id'] : $next['item_update_id'];
		}

		return $item_update_id;

	}

}