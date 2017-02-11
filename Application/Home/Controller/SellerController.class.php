<?php
namespace Home\Controller;

use Home\Controller\IndexController;

class SellerController extends IndexController{

	//商户主界面页面
	public function enter(){
		$this->display();
	}

	//商户主界面接口
	public function enter_info(){
		$this->ajax_res(1);
	}

	//商户个人中心页面
    public function info(){
        $this->display();
    }

    //商户店铺页面
    public function store_page(){
        $this->display();
    }

    //商户信息修改接口
    public function modify(){

        //商户信息
        $seller_info = D('Seller')->one_seller(I('seller_id'));
        if( !$seller_info ) $this->ajax_res(0,'找不到该商户');

        //修改商户信息
        if( I('modify') == 'modify' ){
            //数据验证
            $save_data = $this->check_seller_modify($seller_info,I('post.'));
            //保存
            $save_res = M('seller')->where(array('seller_id'=>I('seller_id')))->save($save_data);
            //返回结果
            if( (int)$save_res >= 0 ) $this->ajax_res(1,'恭喜您，修改成功');
            $this->ajax_res(0,'抱歉，失败修改');
        }

        //返回商户信息
        $this->ajax_res(1,'获得商户信息成功',$seller_info);
    }

    //验证商户修改信息
    public function check_seller_modify($old_info,$new_info){
        //名称
        if( !$new_info['name'] ) $this->ajax_res(0,'请填写用户名称');
        //手机号码格式
        if( $new_info['tel'] && !check_phone($new_info['tel']) ) $this->ajax_res(0,'手机号码格式错误');
        //手机号码是否更换 如果更换了 要验证是否已被使用
        if( ($new_info['tel'] && $new_info['tel'] != $old_info['seller_phone']) && !$this->is_new_phone($new_info['tel']) ) $this->ajax_res(0,'该手机号已被使用');
        //qq
        if( !$new_info['qq'] ) $this->ajax_res(0,'请填写联系QQ号码');
        //qq号码是否更换 如果更换了 要验证是否已被使用
        if( $new_info['qq'] != $old_info['seller_qq'] && !$this->is_new_qq($new_info['qq']) ) $this->ajax_res(0,'QQ号码已被使用');
        //邮箱
        if( !$new_info['email'] || !check_email($new_info['email']) ) $this->ajax_res(0,'请输入正确的邮箱');
        //邮箱是否更换 如果更换了 要验证是否已被使用
        if( $old_info['seller_email'] != $new_info['email'] && !$this->is_new_email($new_info['email']) ) $this->ajax_res(0,'邮箱已被使用');
        //邮箱是否更换 如果更换了 要验证验证码是否正确
        if( $old_info['seller_email'] != $new_info['email'] && $new_info['idCode'] != S($new_info['email']) ) $this->ajax_res(0,'验证码错误或过期，请重新发送');
        //入库数据
        $save_data = array(
                'seller_name'  => $new_info['name'],
                'seller_phone' => $new_info['tel'],
                'seller_qq'    => $new_info['qq'],
                'seller_email' => $new_info['email'],
                'seller_desc'  => $new_info['introduce'],
                'update_time'   => time(),
            );
        return $save_data;
    }

    //添加店铺接口
    public function add_store(){

    	//商户信息
    	$seller_info = D('Seller')->one_seller(I('seller_id'));
        if( !$seller_info ) $this->ajax_res(0,'找不到该商户');

        //店铺信息验证
        $store_info = $this->check_store_add(I('post.'));

        //店铺信息存入
        $store_id = M('store')->add($store_info);

        //店铺凭证上传

        //返回结果
        if( !$store_id ) $this->ajax_res(0,'保存失败');

        $this->ajax_res(1,'添加成功，请等待审核通过',$store_id);

    }

    //添加店铺信息验证
    public function check_store_add($store_info){

    	$arr = [];

    	//店铺名称
    	$arr['store_name'] = $store_info['store_name'] ? $store_info['store_name'] : $this->ajax_res(0,'请填写店铺名称');

    	//店铺链接
    	$arr['store_url'] = $store_info['store_url'] ? $store_info['store_url'] : $this->ajax_res(0,'请填写店铺链接');

    	//店铺简介
    	$arr['store_desc'] = $store_info['store_desc'] ? $store_info['store_desc'] : $this->ajax_res(0,'请填写店铺简介');

    	//淘宝天猫店铺id
    	$arr['alipay_store_id'] = $arr['alipay_store_id'] ? $arr['alipay_store_id'] : D('store')->get_alipay_store_id($arr['store_url']);

    	//淘宝天猫店铺id是否唯一
    	if( !$this->is_new_store($arr['alipay_store_id']) ) $this->ajax_res(0,'该店铺已被注册');

    	//店铺类型
    	$arr['type'] = D('store')->get_store_type($arr['store_url']);

    	//创建时间
    	$arr['create_time'] = time();

    	//店铺状态 -2 待审核
    	$arr['status'] = 2;

    	return $arr;

    }

    //修改店铺信息接口
    public function modify_store(){

    	//商户信息
        $seller_info = D('Seller')->one_seller(I('seller_id'));
        if( !$seller_info ) $this->ajax_res(0,'找不到该商户');

        //店铺信息
        $store_info = D('Store')->one_store(I('store_id'));
        if( !$seller_info ) $this->ajax_res(0,'找不到该店铺');

        //修改接口
        if( I('modify') == 'modify' ){

        	//验证修改数据
        	$store_info = $this->check_store_modify(I('post.'));

        	//无修改数据
        	if( count($store_info) == 0 ) $this->ajax_res(1,'修改成功');

        	//保存
        	$save = M('store')->where(array(
        			'seller_id'=>I('seller_id')
        		))->save($store_info);

        	//修改成功
        	if( is_int($save) ) $this->ajax_res(1,'修改成功');

        	//修改失败
        	$this->ajax_res(0,'修改失败');

        }

        $this->ajax_res(1,'获得店铺信息成功',$store_info);

    }

    //验证修改数据
    public function check_store_modify($store_info){

    	$arr = [];

    	//名称
    	if( $store_info['store_name'] ) $arr['store_name'] = $store_info['store_name'];

    	//简介
    	if( $store_info['store_desc'] ) $arr['store_desc'] = $store_info['store_desc'];

    	return $arr;

    }

    //删除店铺接口
    public function del_store(){

    	//商户信息
        $seller_info = D('Seller')->one_seller(I('seller_id'));
        if( !$seller_info ) $this->ajax_res(0,'找不到该商户');

        //店铺信息
        $store_info = D('Store')->one_store(I('store_id'));
        if( !$seller_info ) $this->ajax_res(0,'找不到该店铺');

        //删除
        $del = M('store')->delete($store_info['store_id']);

        //返回结果
        if( $del ) $this->ajax_res(1,'删除成功');

        $this->ajax_res(0,'删除失败');

    }

    //商户已有店铺列表接口
    public function store_list(){

    	//商户信息
        $seller_info = D('Seller')->one_seller(I('seller_id'));
        if( !$seller_info ) $this->ajax_res(0,'找不到该商户');

        //条件
		$where = array(
				'seller_id' => $seller_info['seller_id'],
				'status'    => array('neq',4),
			);        

        //需要字段 id 名称 审核状态
        $field = 'store_id,store_name,status';

        //排序
        $order = 'create_time DESC';

        //总数
		$count = M('store')->where($where)->count();

		//分页
		$page = new Pagelist($count, 5);

		//查询
		$store_list = M('store')
			->where($where)
			->field($field)
			->order($order)
			->limit($page->firstRow, $page->listRows)
			->select();

		//空
		$store_list = $store_list ? $store_list : [];

		//返回数据
		$this->ajax_res(1,'获得店铺列表成功',$store_list);

    }

    /*店铺凭证图片保存接口
    * params
    * $files
    */
    public function store_img_upload(){

        $path = 'seller_store/';

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

        if (!$res) {
            //捕获上传异常
            $this->ajaxReturn(array(
                    'status' => 0,
                    'msg'    => $upload->getError()
                ));
        } else {
            //返回图片路径
            $this->ajaxReturn(array(
                    'status' => 1,
                    'url'    => "/Uploads"."/".$res['pic']['savepath'].$res['pic']['savename']
                ));
        }

    }

}