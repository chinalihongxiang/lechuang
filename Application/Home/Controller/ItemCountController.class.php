<?php
namespace Home\Controller;

use Think\Controller;
use Home\Controller\IndexController;

class ItemCountController extends IndexController {

	//按领券量排行 一段时间内十条商品
	public function search(){

		if( !I('type') ) ajax_res(0,'请传入时间类型');

		//统计开始时间
		$start = get_start_time(I('type'));

		//统计结束时间
		$end = get_end_time(I('type'));

		//统计商品id数组
		$item_id_list = M('item')->where(array('status'=>0))->getField('item_id',true);

	}

}