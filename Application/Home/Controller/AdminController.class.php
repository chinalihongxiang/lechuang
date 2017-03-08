<?php
namespace Home\Controller;

use Think\Controller;
use Home\Controller\IndexController;

class AdminController extends IndexController {

	//登录页面
	public function index(){
		session('user',null);
		//if( session('user') ) $this->redirect('/Admin/checkShare');
		$this->display();
	}

	//登录接口
	public function login(){

		//验证
		if( I('pass') != ADMIN_PASS ){
			echo '密码错误';
			exit;
		}

		//登录成功验证
		session('user',ADMIN_PASS,60*60);

		//跳转审核页面
		$this->redirect('/Admin/checkShare');

	}

	//审核页面
	public function checkShare(){

		$this->display();

	}

	//审核列表
	public function shareList(){

		//页码
		$p = I('p') ? I('p') : 1;

		//分页大小
		$p_size = 5;

		//排序
		$order = 'status asc,create_time asc';

		//总数
		$count = M('share')->count();

		//条件
		$list = M('share')
			->order($order)
			->limit(($p-1)*$p_size,$p_size)
			->select();

		foreach ($list as $key => $value) {
			if( $value['type'] == 1 ) $value['user_name'] = M('promoter')->where(array('promoter_id'=>$value['user_id']))->getField('promoter_name');
			if( $value['type'] == 2 ) $value['user_name'] = M('seller')->where(array('seller_id'=>$value['user_id']))->getField('seller_name');
			$value['create_time'] = intdate($value['create_time']);

			$value['content'] = htmlspecialchars($value['content']);

			$value['content'] = str_replace(array("\r\n", "\r", "\n"), "<br>", $value['content']);

			if( strpos($value['content'],'img') != 8 ){
				$value['content'] = substr($value['content'], strpos($value['content'],'img') - 8);
			}

			$list[$key] = $value;
		}

		$this->ajax_res(1,'成功',array(
				'count' => $count,
				'p'     => $p,
				'list'  => $list,
				'p_size'=> $p_size
			));

	}

	//审核接口
	public function dealShare(){

		//1-已读2-加精
		$save['status'] = I('status');

		$where = array(
				'share_id' => I('share_id')
			);

		$save['check_time'] = time();

		$save = M('share')->where($where)->save($save);

		if( $save ) $this->ajax_res(1,'操作成功');

		$this->ajax_res(0,'操作失败');

	}

	//群列表
	public function groupList(){

		$p = I('p') ? I('p') : 1;
		$p_size = 10;

		//总数
		$count = M('promoter_group')->count();

		$list = M('promoter_group')->order('create_time desc')->limit( ($p-1)*$p_size , $p_size )->select();

		$list = $list ? $list : [];

		//返回数据
		$this->ajax_res(1,'返回成功',$list);

	}

	//网站列表
	public function webList(){

		$p = I('p') ? I('p') : 1;
		$p_size = 10;

		//总数
		$count = M('promoter_web')->count();

		$list = M('promoter_web')->order('create_time desc')->limit( ($p-1)*$p_size , $p_size )->select();

		$list = $list ? $list : [];

		//返回数据
		$this->ajax_res(1,'返回成功',$list);

	}

	//店铺审核列表
	public function storeList(){

		$p = I('p') ? I('p') : 1;
		$p_size = 10;

		$where = array(
				'status' => 2
			);

		//总数
		$count = M('store')->where($where)->count();

		//取出最新五条公开留言
		$list = M('store')->where($where)->order('create_time desc')->limit( ($p-1)*$p_size , $p_size )->select();

		foreach ($list as $key => $value) {
			$value['pics'] = M('store_voucher')->where(array(
					'store_id' => $value['store_id']
				))->select();
			$list[$key] = $value;
		}

		$list = $list ? $list : [];

		//返回数据
		$this->ajax_res(1,'返回成功',$list);

	}

	//审核通过接口
	public function storeVoucher(){

		if( !I('store_id') || !M('store')->find(I('store_id')) ) $this->ajax_res(0,'店铺非法');

		M('store')->where(array(
				'store_id' => I('store_id')
			))->save(array(
				'status' => I('status')
			));

		$this->ajax_res(1,'审核成功');

	}

}