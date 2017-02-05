<?php
namespace Home\Model;
use Think\Model;
class CouponModel extends Model{

	//获得某个时间点某个券的领券量
	public function get_coupon_time_take_num($coupon_info,$time){

		//查看该时间点是否有更新记录
		$update = M('coupon_update')->where(array('time'=>$time))->find();
		if( $update ){
			$take_num = M('coupon_log')->where(array(
				'update_id'   => $update['coupon_update_id'],
				'coupon_id'   => $coupon_info['coupon_id']
			))->getField('value');
			return $take_num;
		}

		//查看距离该时间点最近的上一次更新的时间
		$last = M('coupon_update')->where(array(
				'time' => array('elt',$time),
			))->order('time desc')->limit(1)->find();

		//查看两者时间差
		$last_ads = $last ? $time - $last['time'] : 0;

		//查看距离该时间点最近的下一次更新的时间
		$next = M('item_update')->where(array(
				'time' => array('gt',$time),
			))->order('time asc')->limit(1)->find();

		//查看两者时间差
		$next_abs = $next ? $next_time - $next['time'] : 0;

		if( $last_ads == 0 || $next_abs == 0 ){
			//如果有一方为0 则取有值的
			$coupon_update_id = $next_abs == 0 ? $last['coupon_update_id'] : $next['coupon_update_id'];
		}else{
			//取时间差少的那次update的id值
			$coupon_update_id = abs($next_abs) > abs($last_ads) ? $last['coupon_update_id'] : $next['coupon_update_id'];
		}

		//获得本次更新的优惠券领券量
		$take_num = M('coupon_log')->where(array(
				'update_id'   => $coupon_update_id,
				'coupon_id'   => $coupon_info['coupon_id']
			))->getField('value');

		//如果没有这次更新 则取当前领券量
		if( !$take_num ) $take_num = $coupon_info['take_num'];

		//返回
		return $take_num;

	}

}