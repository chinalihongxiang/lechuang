<?php
namespace Home\Model;
use Think\Model;
class SellerModel extends Model{

    /*获得单个商户信息
    * 商户本地id   $seller_id
    * 所需字段     $field
    * 商户搜索条件 $where
    */
    public function one_seller($seller_id = '',$field = '*',$where = []){
        //按id查
        if(  $seller_id > 0 ) return D('Seller')->field($field)->find();
        //按条件查
        if( is_array($where) count($where) > 0 ) return D('Seller')->field($field)->where($where)->find();
    }

}