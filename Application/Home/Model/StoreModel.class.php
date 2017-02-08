<?php
namespace Home\Model;
use Think\Model;
class StoreModel extends Model{

    /*获得单个店铺信息
    * 店铺本地id   $store_id
    * 所需字段     $field
    * 店铺搜索条件 $where
    */
    public function one_store($store_id = '',$field = '*',$where = []){
        //按id查
        if(  $store_id > 0 ) return D('store')->field($field)->find($store_id);
        //按条件查
        if( is_array($where) && count($where) > 0 ) return D('store')->field($field)->where($where)->find();
    }

    /*通过店铺链接获得淘宝店铺id
    * 店铺链接   $store_url
    */
    public function get_alipay_store_id($store_url){
        return '';
    }

    /*通过店铺链接获得店铺类型
    * 店铺链接   $store_url
    */
    public function get_store_type($store_url){
        return 0;
    }

}