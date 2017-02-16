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

        //条件
        $where['promoter.promoter_id'] = 6;

        //字段
        $field = '*';

        //联查
        $join = array(
                'left join group_log on group_log.promoter_id = promoter.promoter_id',
                // 'left join item on item.item_id = promoter_log.item_id',
                // 'left join coupon on coupon.alipay_item_id = item.alipay_item_id'
            );

        //条数
        $limit = 10;

        //查询
        $list = M('promoter')->field($field)->where($where)->join($join)->limit($limit)->select();

    }

}