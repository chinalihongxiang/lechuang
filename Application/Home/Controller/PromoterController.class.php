<?php
namespace Home\Controller;

use Home\Controller\IndexController;

class PromoterController extends IndexController{

	//淘客个人中心
    public function info(){
        $this->display;
    }

    //淘客信息修改接口
    public function modify(){

        //淘客信息
        $promoter_info = M('promoter')->where(array('promoter_id'=>I('promoter_id')))->find();
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