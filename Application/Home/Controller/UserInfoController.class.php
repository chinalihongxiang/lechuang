<?php
namespace Home\Controller;

use Think\Controller;
use Home\Controller\IndexController;

class UserInfoController extends IndexController {

	//注册选择身份页面
	public function choose(){
		$this->display();
	}

	//商户注册页面
    public function seller_register(){
        //注册接口
        if( IS_POST ){
            //数据验证
            $data = $this->deal_seller_info(I('post.'));
            //生成商户
            $seller_id = M('seller')->add($data);
            //成功返回
            if($seller_id) $this->ajax_res(1,'注册成功',array('seller_id'=>$seller_id));
            //失败返回
            $this->ajax_res(0,'注册失败');
        }
        $this->display();
    }

    //注册商户数据验证
    public function deal_seller_info(){
        //姓名
        if( !I('name') ) $this->ajax_res(0,'请输入用户名');
        //手机号
        if( I('tel') && !check_phone(I('tel')) ) $this->ajax_res(0,'请输入正确的手机号码');
        //手机号是否已被使用
        if( I('tel') && !$this->is_new_phone(I('tel')) ) $this->ajax_res(0,'手机号码已被使用');
        //qq
        if( !I('qq') ) $this->ajax_res(0,'请输入正确的qq号码');
        //qq是否已被注册
        if( !$this->is_new_qq(I('qq')) ) $this->ajax_res(0,'qq号码已被使用，请输入正确qq号码');
        //邮箱
        if( !check_email(I('email')) ) $this->ajax_res(0,'请输入正确的邮箱');
        //验证码
        if( I('idCode') != S(I('email')) ) $this->ajax_res(0,'验证码错误或过期，请重新发送');
        //邮箱是否已被注册
        if( !$this->is_new_email(I('email')) ) $this->ajax_res(0,'该邮箱已被注册');
        //密码
        if( !I('pwd') ) $this->ajax_res(0,'请输入密码');
        //商户简介 introduce

        //入库数据
        $save_data = array(
                'seller_name'  => I('name'),
                'seller_phone' => I('tel'),
                'seller_qq'    => I('qq'),
                'seller_pass'  => I('pwd'),
                'seller_email' => I('email'),
                'seller_desc'  => I('introduce'),
                'creat_time'   => time(),
            );
        return $save_data;
    }

    //淘客注册页面
    public function promoter_register(){
        //注册接口
        if( IS_POST ){
            //数据验证
            $data = $this->deal_promoter_info(I('post.'));
            //生成淘客
            $promoter_id = M('promoter')->add($data);
            //成功返回
            if($promoter_id){
                //存入qq
                $save_qq = M('promoter_qq')->add(array('promoter_id'=>$promoter_id,'qq'=>I('qq')));
                if($save_qq&&$promoter_id) $this->ajax_res(1,'注册成功',array('promoter_id'=>$promoter_id));
                //失败返回
                $this->ajax_res(0,'注册成功，添加qq号码失败');
            }
            //失败返回
            $this->ajax_res(0,'注册失败');
        }
    	$this->display();
    }

    //注册淘客数据验证
    public function deal_promoter_info(){
        //姓名
        if( !I('name') ) $this->ajax_res(0,'请输入用户名');
        //手机号
        if( I('tel') && !check_phone(I('tel')) ) $this->ajax_res(0,'请输入正确的手机号码');
        //手机号是否已被使用
        if( I('tel') && !$this->is_new_phone(I('tel')) ) $this->ajax_res(0,'手机号码已被使用');
        //qq
        if( !I('qq') ) $this->ajax_res(0,'请输入正确的qq号码');
        //qq是否已被注册
        if( !$this->is_new_qq(I('qq')) ) $this->ajax_res(0,'qq号码已被使用');
        //邮箱
        if( !check_email(I('email')) ) $this->ajax_res(0,'请输入正确的邮箱');
        //验证码
        if( I('idCode') != S(I('email')) ) $this->ajax_res(0,'验证码错误或过期，请重新发送');
        //邮箱是否已被注册
        if( !$this->is_new_email(I('email')) ) $this->ajax_res(0,'该邮箱已被注册');
        //密码
        if( !I('pwd') ) $this->ajax_res(0,'请输入密码');
        //淘客简介 introduce

        //入库数据
        $save_data = array(
                'promoter_name'  => I('name'),
                'promoter_phone' => I('tel'),
                'promoter_pass'  => I('pwd'),
                'promoter_email' => I('email'),
                'promoter_desc'  => I('introduce'),
                'creat_time'   => time(),
            );
        return $save_data;
    }

    //验证邮箱 发送邮箱验证码 接口
    public function send_code(){

        //发送邮箱
        $send_to = I('email') ? I('email') : $this->ajax_res(0,'请填写您的邮箱');
        //邮箱是否已被注册
        if( !$this->is_new_email(I('email')) ) $this->ajax_res(0,'该邮箱已被注册');
        //验证码
        $num     = mt_rand(1000,9999);
        //邮件标题
        $title   = '淘友记邮箱验证';
        //邮件内容
        $content = '【淘友记】请在五分钟内输入验证码：'.$num;
        //发送
        $res = send_email($title,$content,$send_to);

        //发送成功
        if( $res > 0 ){
            //缓存内存入该邮箱验证码
            S($send_to,$num);
            //返回结果
            $this->ajax_res(1);
        }

        //发送失败
        $this->ajax_res(0,'发送失败');
    }

    //登录接口
    public function login(){
        //账号
        $account = I('account') ? I('account') : $this->ajax_res(0,'请输入手机号码或邮箱');
        //密码
        $the_pass = I('pass') ? I('pass') : $this->ajax_res(0,'请输入密码');
        //格式
        if( !check_email($account) && !check_phone($account) ) $this->ajax_res(0,'请输入正确的手机号码或邮箱');
        //手机登录
        if( check_phone($account) ){
            $seller = M('seller')->where(array('seller_phone'=>$account))->find();
            //商户登录
            if( $seller ){
                if( $seller['seller_pass'] != $the_pass ) $this->ajax_res(0,'密码错误，请重新输入');
                $this->ajax_res(1,'登陆成功',array('type'=>'seller','seller_id'=>$seller['seller_id'],'url'=>''));
            }
            //淘客登录
            $promoter = M('promoter')->where(array('promoter_phone'=>$account))->find();
            if( $promoter ){
                if( $promoter['promoter_pass'] != $the_pass ) $this->ajax_res(0,'密码错误，请重新输入');
                $this->ajax_res(1,'登陆成功',array('type'=>'promoter','promoter_id'=>$promoter['promoter_id'],'url'=>''));
            }
            $this->ajax_res(0,'该用户不存在');
        }
        //邮箱登录
        if( check_email($account) ){
            $seller = M('seller')->where(array('seller_email'=>$account))->find();
            //商户登录
            if( $seller ){
                if( $seller['seller_pass'] != $the_pass ) $this->ajax_res(0,'密码错误，请重新输入');
                $this->ajax_res(1,'登陆成功',array('type'=>'seller','seller_id'=>$seller['seller_id'],'url'=>''));
            }
            //淘客登录
            $promoter = M('promoter')->where(array('promoter_email'=>$account))->find();
            if( $promoter ){
                if( $promoter['promoter_pass'] != $the_pass ) $this->ajax_res(0,'密码错误，请重新输入');
                $this->ajax_res(1,'登陆成功',array('type'=>'promoter','promoter_id'=>$promoter['promoter_id'],'url'=>''));
            }
            $this->ajax_res(0,'该用户不存在');
        }

    }

    //商户个人中心
    public function seller_info(){
        $this->display;
    }

    //淘客个人中心
    public function promoter_info(){
        $this->display;
    }

    //商户信息修改接口
    public function seller_modify(){

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
            if( is_int($save_res) ) $this->ajax_res(1,'恭喜您，修改成功');
            $this->ajax_res(0,'抱歉，失败修改');
        }

        //返回商户信息
        $this->ajax_res(1,'获得商户信息成功',$seller_info);
    }

    //淘客信息修改接口
    public function promoter_modify(){

        //淘客信息
        $promoter_info = D('promoter')->one_promoter(I('promoter_id'));
        if( !$promoter_info ) $this->ajax_res(0,'找不到该淘客');

        //修改淘客信息
        if( I('modify') == 'modify' ){
            //数据验证
            $save_data = $this->check_promoter_modify($promoter_info,I('post.'));
            //保存
            $save_res = M('promoter')->where(array('promoter_id'=>I('promoter_id')))->save();
            //保存淘客QQ
            if( !is_array(I('promoter_qq')) || count(I('promoter_qq')) == 0 ) $this->ajax_res(0,'请输入至少一个联系QQ');
            foreach (I('promoter_qq') as $key => $value) {
                $index = $key+1;
                //判空
                if( !$value['qq'] ) $this->ajax_res(0,'请填写您的第'.$index.'个QQ号码');
                //查看该QQ该淘客是否已添加
                $had_add = M('promoter_qq')->where(array(
                        'promoter_id' => I('promoter_id'),
                        'qq'          => $value['qq'],
                    ))->find();
                if( $had_add ) continue;
                //是否已被使用
                if( !$this->is_new_qq($value['qq']) ) $this->ajax_res(0,'您添加的第'.$index.'个QQ号码已被使用');
                //入库
                $add_promoter_qq['qq']          = $value['qq'];
                $add_promoter_qq['desc']        = $value['desc'];
                $add_promoter_qq['promoter_id'] = I('promoter_id');
                M('promoter_qq')->add($add_promoter_qq);
            }
            //返回结果
            if( is_int($save_res) ) $this->ajax_res(1,'恭喜您，修改成功');
            $this->ajax_res(0,'抱歉，失败修改');
        }

        //返回淘客信息
        $this->ajax_res(1,'获得淘客信息成功',$promoter_info);
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

    //验证淘客修改信息
    public function check_promoter_modify($old_info,$new_info){
        //名称
        if( !$new_info['name'] ) $this->ajax_res(0,'请填写用户名称');
        //手机号码格式
        if( $new_info['tel'] && !check_phone($new_info['tel']) ) $this->ajax_res(0,'手机号码格式错误');
        //手机号码是否更换 如果更换了 要验证是否已被使用
        if( ($new_info['tel'] && $new_info['tel'] != $old_info['promoter_phone']) && !$this->is_new_phone($new_info['tel']) ) $this->ajax_res(0,'该手机号已被使用');
        //邮箱
        if( !$new_info['email'] || !check_email($new_info['email']) ) $this->ajax_res(0,'请输入正确的邮箱');
        //邮箱是否更换 如果更换了 要验证是否已被使用
        if( $old_info['promoter_email'] != $new_info['email'] && !$this->is_new_email($new_info['email']) ) $this->ajax_res(0,'邮箱已被使用');
        //邮箱是否更换 如果更换了 要验证验证码是否正确
        if( $old_info['promoter_email'] != $new_info['email'] && $new_info['idCode'] != S($new_info['email']) ) $this->ajax_res(0,'验证码错误或过期，请重新发送');
        //入库数据
        $save_data = array(
                'promoter_name'  => $new_info['name'],
                'promoter_phone' => $new_info['tel'],
                'promoter_email' => $new_info['email'],
                'promoter_desc'  => $new_info['introduce'],
                'update_time'   => time(),
            );
        return $save_data;
    }

}