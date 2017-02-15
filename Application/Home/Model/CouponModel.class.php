<?php
namespace Home\Model;
use Think\Model;
class CouponModel extends Model{

	//获得某个时间点某个券的领券量
	public function get_coupon_time_take_num($coupon_info,$time){

		//更新id
		$coupon_update_id = $this->get_coupon_update_id_by_time($time);

		//获得本次更新的优惠券领券量
		$take_num = M('coupon_log')->where(array(
				'update_id' => array('elt',$coupon_update_id),
				'coupon_id'   => $coupon_info['coupon_id']
			))->limit(1)->order('coupon_log_id desc')->getField('value');

		//返回
		return $take_num;

	}

	//一段时间某张券的领券量
	public function start_end_one_take_num($coupon,$start,$end){

		//开始时间领券数
		$start_take = $this->get_coupon_time_take_num($coupon,$start);

		//结束时间领券数
		$end_take = $this->get_coupon_time_take_num($coupon,$end);

		return $end_take - $start_take;

	}

	//获得距离某时间最近的coupon_update_id
	public function get_coupon_update_id_by_time($time = 0){

		//时间点正好有对应
		$coupon_update_id = M('coupon_update')->where(array('time'=>$time))->getField('coupon_update_id');
		if( $coupon_update_id ) return $coupon_update_id;

		//查看距离该时间点最近的上一次更新
		$last = M('coupon_update')->where(array(
				'time' => array('lt',$time),
			))->order('time desc')->limit(1)->find();

		//查看两者时间差
		$last_ads = $last ? $time - $last['time'] : 0;

		//查看距离该时间点最近的下一次更新
		$next = M('coupon_update')->where(array(
				'time' => array('gt',$time),
			))->order('time asc')->limit(1)->find();

		//查看两者时间差
		$next_abs = $next ? $next['time'] - $time : 0;

		if( $last_ads == 0 || $next_abs == 0 ){
			//如果有一方为0 则取有值的
			$coupon_update_id = $next_abs == 0 ? $last['coupon_update_id'] : $next['coupon_update_id'];
		}else{
			//取时间差少的那次update的id值
			$coupon_update_id = abs($next_abs) > abs($last_ads) ? $last['coupon_update_id'] : $next['coupon_update_id'];
		}

		return $coupon_update_id;

	}

}