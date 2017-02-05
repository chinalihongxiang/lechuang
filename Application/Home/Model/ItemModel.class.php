<?php
namespace Home\Model;
use Think\Model;
class ItemModel extends Model{

    //参与活动天数
	public function get_item_join_time($item_info){

		//获得此商品第一次出现的时间
		$appear_time = $item_info['create_time'];

		//获得此商品最后一次更新的时间
		$end_time = M('item_update')->where(array('item_update_id'=>$item_info['item_update_id']))->getField('time');

		//计算已参加活动多少天
		$days = ($end_time - $appear_time) / 86400;

		//处理
		if( (int)$days == 0 ) $days = 1;

		//返回
		return (int) $days;

	}

	//获得某商品所有优惠券
	public function get_item_coupons($alipay_item_id){

		return M('coupon')->where(array('alipay_item_id'=>$alipay_item_id))->select();

	}

	//该商品所有优惠券已领券数
	public function get_item_coupon_take_num($item_info){

		//获得该商品所有优惠券
		$coupons = $this->get_item_coupons($item_info['alipay_item_id']);

		//获得这些优惠券所有已领券数
		$take_num = 0;
		foreach ($coupons as $key => $value) {
			//单张优惠券当前已领券数
			$the_num = (int)$value['take_num'];
			//求和
			$take_num = $take_num + $the_num;
		}

		return $take_num;

	}

	//该商品一段时间内的券转化率
	public function get_item_coupon_roc($item_info,$start = 0,$end = 0){

		//开始时间
		$start = $start ? $start : $item_info['create_time'];
		dump(date('Y-m-d H:i:s',$start));

		//结束时间
		$end   = $end ? $end : time();
		dump(date('Y-m-d H:i:s',$end));

		//开始时间商品销量
		$start_sale = $this->get_item_one_time_sale($item_info,$start);
		dump($start_sale);

		//结束时间商品销量
		$end_sale = $this->get_item_one_time_sale($item_info,$end);
		dump($end_sale);

		//开始时间优惠券领券数
		$start_coupon_take_num = $this->get_item_coupons_take_num($item_info,$start);
		dump($start_coupon_take_num);

		//结束时间优惠券领券数
		$end_coupon_take_num = $this->get_item_coupons_take_num($item_info,$end);
		dump($end_coupon_take_num);

		//转化率
		if( $end_coupon_take_num == $start_coupon_take_num ){
			$roc = ( $end_sale - $start_sale ) / $end_coupon_take_num;
		}else{
			$roc = ( $end_sale - $start_sale ) / ( $end_coupon_take_num - $start_coupon_take_num );
		}

		//四位小数
		$roc = round($roc,4)*100;

		return $roc;

	}

	//获得某时间点商品销量
	public function get_item_one_time_sale($item_info,$time){

		//查看该时间点是否有更新记录
		$update = M('item_update')->where(array('time'=>$time))->find();
		if( $update ){
			$sale = M('item_log')->where(array(
				'update_id' => $update['item_update_id'],
				'item_id'   => $item_info['item_id']
			))->getField('value');
			return $sale;
		}

		//查看距离该时间点最近的上一次更新的时间
		$last = M('item_update')->where(array(
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
			$item_update_id = $next_abs == 0 ? $last['item_update_id'] : $next['item_update_id'];
		}else{
			//取时间差少的那次update的id值
			$item_update_id = abs($next_abs) > abs($last_ads) ? $last['item_update_id'] : $next['item_update_id'];
		}

		//获得本次更新的商品销量
		$sale = M('item_log')->where(array(
				'update_id' => $item_update_id,
				'item_id'   => $item_info['item_id']
			))->getField('value');

		//如果没有这次更新 则取当前销量
		if( !$sale ) $sale = $item_info['sale'];

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

}