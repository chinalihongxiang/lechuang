<?php
namespace Home\Controller;

use Think\Controller;
use Home\Controller\IndexController;

class GroupController extends IndexController {

	//软件端群采集记录接收接口
	public function get_log(){
		//来源淘客id
		$promoter_id = I('promoter_id') ? I('promoter_id') : $this->ajax_res(0,'无来源淘客id');
		//数组判空
		$list = !is_array(I('list')) ? json_decode(I('list'),true) : I('list');
		$request_num = count($list);
		if( $request_num == 0 ) $this->ajax_res(0,'无数据');
		//处理
		$group_log_id_arr = [];
		foreach ( $list as $key => $log ) {
			//判空
			if( !$log['GroupID']  ) continue;
			if( !$log['CouponID'] ) continue;
			if( !$log['ItemID']   ) continue;
			if( !$log['SellerID'] ) continue;
			if( !$log['IsTmail']  ) continue;
			if( !$log['TimeID']   ) continue;
			//统一入库时间
			$create_time = $log['TimeID'];
			//采集群
			$group_id = $this->get_log_group($log['GroupID']);
			if( !$group_id ) continue;
			//优惠券
			$coupon_id = $this->get_log_coupon(
					$log['CouponID'],
					$log['ItemID'],
					$log['SellerID'],
					$log['IsTmail'],
					$create_time
				);
			if( !$coupon_id ) continue;
			//商品
			$item_id = $this->get_log_item(
					$log['ItemID'],
					$log['SellerID'],
					$log['IsTmail'],
					$create_time
				);
			if( !$item_id ) continue;
			//采集记录
			$group_log_id = $this->get_log_id(
					$group_id,
					$coupon_id,
					$item_id,
					$log['IsTmail'],
					$promoter_id,
					$create_time
				);
			if( $group_log_id ) array_push($group_log_id_arr, $group_log_id);
		}
		if( count($group_log_id_arr) != $request_num ) file_put_contents('get_log_err.txt',print_r($list,true),FILE_APPEND);
		$this->ajax_res(1);
	}

	//软件端群采集记录 采集群
	public function get_log_group($group_qq){
		//条件
		$where = array('group_qq'=>$group_qq);
		//查询是否已有
		$group_id = M('group')->where($where)->getField('group_id');
		//已有直接返回id  没有添加后返回id
		return $group_id ? $group_id : M('group')->add($where);
	}

	//软件端群采集记录 优惠券
	public function get_log_coupon($alipay_coupon_id,$alipay_item_id,$alipay_seller_id,$type,$create_time){
		//条件
		$where = array(
				'alipay_coupon_id' => $alipay_coupon_id,
				'alipay_item_id'   => $alipay_item_id,
				'alipay_seller_id' => $alipay_seller_id,
				'type'             => $type,
			);
		//查询是否已有
		$coupon_id = M('coupon')->where($where)->getField('coupon_id');
		//没有添加后返回id
		if( !$coupon_id ){
			$where['create_time'] = $create_time;
			return M('coupon')->add($where);
		}
		//已有直接返回id
		return $coupon_id;
	}

	//软件端群采集记录 商品
	public function get_log_item($alipay_item_id,$alipay_seller_id,$type,$create_time){
		//条件
		$where = array(
				'alipay_item_id'   => $alipay_item_id,
				'alipay_seller_id' => $alipay_seller_id,
				'type'             => $type,
			);
		//查询是否已有
		$item_id = M('item')->where($where)->getField('item_id');
		//没有添加后返回id
		if( !$item_id ){
			$where['create_time'] = $create_time;
			return M('item')->add($where);
		}
		//已有直接返回id
		return $item_id;
	}

	//软件端群采集记录 记录id
	public function get_log_id($group_id,$coupon_id,$item_id,$type,$promoter_id,$create_time){
		//条件
		$add = array(
				'group_id'    => $group_id,
				'coupon_id'   => $coupon_id,
				'item_id'     => $item_id,
				'type' 		  => $type,
				'promoter_id' => $promoter_id,
				'create_time' => $create_time,
			);
		return M('group_log')->add($add);
	}

	//软件端淘客设置采集群接口
	public function add_group(){
		//数据判空
		if( !I('GroupID') || !I('GroupName') ) $this->ajax_res(0,'数据有误');
		//判断是否存在
		$group_id = M('group')->where(array('group_qq'=>I('GroupID')))->getField('group_id');
		//如果存在 更新群名称
		if( $group_id ){
			M('group')->where(array('group_qq'=>I('GroupID')))->save(array('group_name'=>I('GroupName')));
			$this->ajax_res(1);
		}
		//如果不存在 添加
		if( M('group')->add(array('group_qq'=>I('GroupID'),'group_name'=>I('GroupName'))) ) $this->ajax_res(1);
		$this->ajax_res(0,'添加失败');
	}

}