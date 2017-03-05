<?php
namespace Home\Controller;

use Think\Controller;
use Home\Controller\IndexController;

class WordsController extends IndexController {

	//好单分享页面地址
	public function page(){
		$this->display();
	}

	//我的留言页面
	public function myWordsPage(){
		$this->display();
	}

	//我的分享页面
	public function mySharePage(){
		$this->display();
	}

	//发布留言
	public function send(){

		$arr = [];

		//id
		$arr['user_id'] = I('promoter_id') ? I('promoter_id') : I('seller_id');
		if( !$arr['user_id'] ) $this->ajax_res(0,'无用户信息');

		//验证是否是用户
		if( !M('promoter')->find(I('promoter_id')) && !M('seller')->find(I('seller')) ) $this->ajax_res(0,'无用户信息');

		//类型
		$arr['type'] = I('promoter_id') ? 1 : 2;

		//私密/公开 1-私密 2-公开
		$arr['is_show'] = I('is_show');

		//留言内容
		$arr['words'] = I('words');

		//时间
		$arr['create_time'] = time();

		//存入
		$add = M('words')->add($arr);

		//返回结果
		if( $add ) $this->ajax_res(1,'成功发表留言');

		$this->ajax_res(1,'发表留言失败');

	}

	//留言展板
	public function show(){

		$p = I('p') ? I('p') : 1;
		$p_size = 10;

		//总数
		$count = M('words')->where(array('is_show'=>2))->count();

		//取出最新五条公开留言
		$list = M('words')->where(array('is_show'=>2))->order('create_time desc')->limit( ($p-1)*$p_size , $p_size )->select();

		//获得留言主人名称
		foreach ($list as $key => $value) {
			if( $value['type'] == 1 ) $value['user_name'] = M('promoter')->where(array('promoter_id'=>$value['user_id']))->getField('promoter_name');
			if( $value['type'] == 2 ) $value['user_name'] = M('seller')->where(array('seller_id'=>$value['user_id']))->getField('seller_name');
			$value['words'] = htmlspecialchars($value['words']);
			$value['create_time'] = intdate($value['create_time']);
			$list[$key] = $value;
		}

		$list = $list ? $list : [];

		//返回数据
		$this->ajax_res(1,'返回成功',$list);

	}

	//我的留言
	public function myWords(){

		//页码
		$p = I('p') ? I('p') : 1;

		//每页大小
		$p_size = 5;

		//淘客id商户id
		$user_id = I('promoter_id') ? I('promoter_id') : I('seller_id');
		//类型
		$user_type = I('promoter_id') ? 1 : 2;
		if( !$user_id ) $this->ajax_res(0,'无用户信息');

		//总数
		$count =  M('words')->where(array(
					'user_id'=>$user_id,
					'type'   =>$user_type
				))->count();

		//取出最新10条私密留言
		$list = M('words')
			->where(array(
					'user_id'=>$user_id,
					'type'   =>$user_type
				))
			->order('create_time desc')
			->limit(($p-1)*$p_size,$p_size)
			->select();
		foreach ($list as $key => $value) {
			$value['words'] = htmlspecialchars($value['words']);
			$value['create_time'] = intdate($value['create_time']);
			$list[$key] = $value;
		}

		//返回数据
		$this->ajax_res(1,'返回成功',array(
				'count' => $count,
				'list'  => $list ? $list : [],
				'p'     => $p,
				'p_size'=> $p_size
			));

	}

	//好单分享
	public function share(){

		$arr = [];

		//id
		$arr['user_id'] = I('promoter_id') ? I('promoter_id') : I('seller_id');
		if( !$arr['user_id'] ) $this->ajax_res(0,'无用户信息');

		//类型
		$arr['type'] = I('promoter_id') ? 1 : 2;

		//标题
		$arr['title'] = I('title');

		//分享内容
		$arr['content'] = I('content');

		//时间
		$arr['create_time'] = time();

		//存入
		$add = M('share')->add($arr);

		//返回结果
		if( $add ) $this->ajax_res(1,'分享成功');

		$this->ajax_res(1,'分享失败');

	}

	//好单分享列表
	public function shareList(){

		//页码
		$p = I('p') ? I('p') : 1;

		//分页大小
		$p_size = 5;

		//排序
		$order = 'create_time desc';

		$where = [];
		//我的分享
		if( I('my_share') ){
			$where['user_id'] = I('seller_id') ? I('seller_id') : I('promoter_id');
			if( !$where['user_id'] ) $this->ajax_res(0,'无用户信息');
			$where['type'] = I('seller_id') ? 2 : 1;
		}else{
			$where['status'] = 1;
			//$where['check_time'] = array('gt',time()-24*60*60);
		}

		//总数
		$count = M('share')->where($where)->count();

		//列表
		$list = M('share')
			->order($order)
			->where($where)
			->limit(($p-1)*$p_size,$p_size)
			->select();

		//处理
		foreach ($list as $key => $value) {
			if( $value['type'] == 1 ) $value['user_name'] = M('promoter')->where(array('promoter_id'=>$value['user_id']))->getField('promoter_name');
			if( $value['type'] == 2 ) $value['user_name'] = M('seller')->where(array('seller_id'=>$value['user_id']))->getField('seller_name');
			$value['create_time'] = intdate($value['create_time']);
			$value['is_like'] = M('share_user')->where(array(
					'share_id' => $value['share_id'],
					'user_id'  => $value['user_id'],
					'user_type'=> $value['type'],
					'type'     => 'like_num',
				))->count();
			$value['is_dislike'] = M('share_user')->where(array(
					'share_id' => $value['share_id'],
					'user_id'  => $value['user_id'],
					'user_type'=> $value['type'],
					'type'     => 'dislike_num',
				))->count();
			
			$value['content'] = htmlspecialchars($value['content']);

			$value['content'] = str_replace(array("\r\n", "\r", "\n"), "<br>", $value['content']);

			if( strpos($value['content'],'img') != 8 ){
				$value['content'] = substr($value['content'], strpos($value['content'],'img') - 8);
			}

			$value['content'] = str_replace("lt;a", "lt;span", $value['content']);

			$list[$key] = $value;
		}

		$this->ajax_res(1,'成功',array(
				'count' => $count,
				'p'     => $p,
				'list'  => $list,
				'p_size'=> $p_size
			));

	}

	//一键复制 点赞 差评
	public function changePoint(){

		//分享id
		$arr['share_id'] = I('share_id');
		if( !$arr['share_id'] || !M('share')->find($arr['share_id']) ) $this->ajax_res(0,'无分享信息');

		//用户信息
		$arr['user_id'] = I('seller_id') ? I('seller_id') : I('promoter_id');
		if( !$arr['user_id'] ) $this->ajax_res(0,'无用户信息');

		//用户类型
		$arr['user_type'] = I('seller_id') ? 2 : 1;

		//修改类型  like_num dislike_num copy_num
		$arr['type'] = I('type');
		if( !$arr['type'] ) $this->ajax_res(0,'无修改类型');

		//记录日志
		if( (int)M('share_user')->where($arr)->count() > 0 ) $this->ajax_res(0,'已进行过此类操作');
		$arr['create_time'] = time();
		M('share_user')->add($arr);

		//更新分享表
		$save = M('share')->where(array('share_id'=>$arr['share_id']))->setInc($arr['type']);

		if( $save ) $this->ajax_res(1,'操作成功');

		$this->ajax_res(0,'操作失败');

	}

	/*店铺凭证图片保存接口
    * params
    * $files
    */
    public function img_upload(){

        $path = 'words/';

        //实例化
        $upload = new \Think\Upload();
        //图片大小，最大为1M
        $upload->maxSize = 1*1024*1024;
        //禁止子目录创建
        $upload->autoSub = true;
        //图片类型
        $upload->allowExts = array('jpg','png','gif');
        //路径
        $upload->savePath = $path;

        //上传
        $res = $upload->upload();

        //设置返回格式
        header('Content-type: text/html');

        if (!$res) {
            //捕获上传异常
            echo json_encode(array(
                    'status' => 0,
                    'msg'    => $upload->getError()
                ));
        } else {
            //返回图片路径
            echo json_encode(array(
            		'state'    => 'SUCCESS',
            		'url'      => "/Uploads"."/".$res['upfile']['savepath'].$res['upfile']['savename'],
            		'title'    => $res['upfile']['savename'],
            		'original' => $res['upfile']['savename']
            	));
        }

    }

}