<?php
namespace Home\Model;
use Think\Model;
class PromoterModel extends Model{

    //该淘客所接商品id数组
    public function item_list($promoter_id){

        $where = $promoter_id ? array('promoter_id'=>$promoter_id) : false;

        if( !$where ) return false;

        //return M('promoter_log')->where($where)->getField('item_id',true);
        return M('group_log')->where($where)->getField('item_id',true);

    }

    //淘客排行榜
    public function item_count_list($type){

        //类型 type : 接单个数-item_sum 总领券量-take_sum 总计销量-sale_sum 转化率-roc_avg

        //条件
        $where = array(
                'roc_avg'  => array('gt',0),
                'sale_num' => array('gt',0),
                'take_num' => array('gt',0)
            );

        //排序
        if( $type == 'item_sum' ){
            $order = 'coupon_sum desc';
        }

        if( $type == 'take_sum' ){
            $order = 'take_num desc';
        }

        if( $type == 'sale_sum' ){
            $order = 'sale_num desc';
        }

        if( $type == 'roc_avg' ){
            $order = 'roc_avg desc';
        }

        //字段
        $field = 'promoter_id,promoter_name,coupon_sum as item_sum,take_num as take_sum,sale_num as sale_sum,roc_avg';

        //选出排行榜淘客
        $promoter_list = M('promoter')->field($field)->where($where)->limit(20)->order($order)->select();

        //获得淘客qq
        foreach ($promoter_list as $key => $value) {
            $value['promoter_qq'] = M('promoter_qq')->where(array('promoter_id'=>$value['promoter_id']))->getField('qq');
            $value['promoter_qq'] = substr_replace($value['promoter_qq'],'****', -4);
            $promoter_list[$key] = $value;
        }

        return $promoter_list;

    }

}