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

    //淘客跑单记录接收接口
    public function get_log(){

        set_time_limit(0);

        //来源淘客id
        $promoter_id = I('promoter_id') ? I('promoter_id') : $this->ajax_res(0,'无来源淘客id');

        //来源淘客是否存在
        if( M('promoter')->where(array('promoter_id'=>$promoter_id))->count() != 1 ) $this->ajax_res(0,'来源淘客非法');

        //json处理
        $json = str_replace('&quot;','"',I('list'));

        //数组判空
        $list = json_decode($json,true);
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

        //如果有错记录日志
        if( count($group_log_id_arr) != $request_num ) file_put_contents('get_log_err.txt',print_r($list,true),FILE_APPEND);

        //返回正常
        $this->ajax_res(1);

    }

    //采集群
    public function get_log_group($group_qq){

        //条件
        $where = array('group_qq'=>$group_qq);

        //查询是否已有
        $group_id = M('group')->where($where)->getField('group_id');

        //已有直接返回id  没有添加后返回id
        return $group_id ? $group_id : M('group')->add($where);

    }

    //优惠券
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

    //商品
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

    //记录id
    public function get_log_id($group_id,$coupon_id,$item_id,$type,$promoter_id,$create_time){

        //条件
        $add = array(
                'group_id'    => $group_id,
                'coupon_id'   => $coupon_id,
                'item_id'     => $item_id,
                'type'        => $type,
                'promoter_id' => $promoter_id,
                'create_time' => $create_time,
            );

        return M('promoter_log')->add($add);

    }

}