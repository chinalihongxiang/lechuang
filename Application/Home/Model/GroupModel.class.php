<?php
namespace Home\Model;
use Think\Model;
class GroupModel extends Model{

	//获得群过去24小时采集到的所有券id
	public function newCoupon($group_id){

		$where = [];

		$where['create_time'] = array('gt',time()-60*24*60);

		$where['group_id'] = $group_id;

		$log_list = M('group_log')->where($where)->select();

		return $log_list;

	}

}