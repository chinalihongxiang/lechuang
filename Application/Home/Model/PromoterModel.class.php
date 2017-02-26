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

        //淘客所接单
        $promoter_item_count = M('');

        //选出排行榜淘客
        $promoter_list = M('promoter')->field('promoter_id,promoter_name,123 as promoter_qq')->where(1,1)->select();

        //循环处理
        if( $type == 'item_sum' ){
            foreach ($promoter_list as $key => $promoter) {
                //接单个数
                $promoter_list[$key]['item_sum'] = 1;
                //领券量
                $promoter_list[$key]['take_sum'] = 1;
                //销量
                $promoter_list[$key]['sale_sum'] = 1;
                //转化率
                $promoter_list[$key]['roc_avg'] = 10.11;
            }
            return $promoter_list;
        }

        if( $type == 'take_sum' ){
            foreach ($promoter_list as $key => $promoter) {
                //接单个数
                $promoter_list[$key]['item_sum'] = 2;
                //领券量
                $promoter_list[$key]['take_sum'] = 2;
                //销量
                $promoter_list[$key]['sale_sum'] = 2;
                //转化率
                $promoter_list[$key]['roc_avg'] = 10.12;
            }
            return $promoter_list;
        }

        if( $type == 'sale_sum' ){
            foreach ($promoter_list as $key => $promoter) {
                //接单个数
                $promoter_list[$key]['item_sum'] = 3;
                //领券量
                $promoter_list[$key]['take_sum'] = 3;
                //销量
                $promoter_list[$key]['sale_sum'] = 3;
                //转化率
                $promoter_list[$key]['roc_avg'] = 10.13;
            }
            return $promoter_list;
        }

        if( $type == 'roc_avg' ){
            foreach ($promoter_list as $key => $promoter) {
                //接单个数
                $promoter_list[$key]['item_sum'] = 4;
                //领券量
                $promoter_list[$key]['take_sum'] = 4;
                //销量
                $promoter_list[$key]['sale_sum'] = 4;
                //转化率
                $promoter_list[$key]['roc_avg'] = 10.14;
            }
            return $promoter_list;
        }

    }

}