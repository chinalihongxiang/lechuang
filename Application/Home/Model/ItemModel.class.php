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

	//该商品某张单券转化率
	public function get_one_coupon_roc($item_info,$coupon,$start = 0,$end = 0){

		//开始时间
		$start = $start ? $start : $item_info['create_time'];

		//结束时间
		$end   = $end ? $end : time();

		//销量变化
		$start_end_sale = $this->start_end_sale($item_info,$start,$end);

		//优惠券领券数变化
		$start_end_one_take_num = D('coupon')->start_end_one_take_num($coupon,$time,$end);

		//转化率为0
		if( (int)$start_end_one_take_num == 0 ) return 0;

		//转化率不为0
		$roc = $start_end_sale/$start_end_one_take_num;

		//四位小数
		$roc = round($roc,4)*100;

		return $roc;

	}

	//商品一段时间内的券转化率
	public function get_item_coupon_roc($item_info,$start = 0,$end = 0){

		//开始时间
		$start = $start ? $start : $item_info['create_time'];

		//结束时间
		$end   = $end ? $end : time();

		//商品销量变化
		$start_end_sale = $this->start_end_sale($item_info,$start,$end);

		//商品领券数变化
		$start_end_take_num = $this->start_end_take_num($item_info,$start,$end);

		//转化率为零
		if( (int)$start_end_take_num == 0 ) return 0;

		//转化率不为零
		$roc = $start_end_sale / $start_end_take_num;

		//四位小数
		$roc = round($roc,4)*100;

		return $roc;

	}

	//商品销量变化
	public function start_end_sale($item_info,$start,$end){

		//开始时间商品销量
		$start_sale = $this->get_item_one_time_sale($item_info['item_id'],$start);

		//结束时间商品销量
		$end_sale = $this->get_item_one_time_sale($item_info['item_id'],$end);

		return $end_sale - $start_sale;

	}

	//商品领券数变化
	public function start_end_take_num($item,$start,$end){

		//开始时间领券数
		$start_take = $this->get_item_coupons_take_num($item,$start);

		//结束时间领券数
		$end_take = $this->get_item_coupons_take_num($item,$end);

		return $end_take - $start_take;

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