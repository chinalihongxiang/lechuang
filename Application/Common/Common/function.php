<?php
// 引入常量定义文件
require './define.php';

/*发送邮件 发邮件 邮箱 邮箱验证
* params 
* 邮件标题 $mailtitle
* 邮件内容 $mailcontent
* 接收邮箱 $smtpemailto
*/
function send_email($mailtitle,$mailcontent,$smtpemailto){
    require_once "./vendor/email.class.php";
    //smtp服务器
    $smtpserver     = EMAIL_SMTP;
    //SMTP服务器端口
    $smtpserverport = EMAIL_PORT;
    //SMTP服务器的用户邮箱
    $smtpusermail   = MY_EMAIL;
    //SMTP服务器的用户帐号
    $smtpuser       = MY_SMTP_ACCOUNT;
    //SMTP服务器的用户密码
    $smtppass       = MY_SMTP_PASS;
    //邮件格式（HTML/TXT）,TXT为文本邮件
    $mailtype = "TXT";
    //这里面的一个true是表示使用身份验证,否则不使用身份验证
    $smtp = new \smtp($smtpserver,$smtpserverport,true,$smtpuser,$smtppass);
    //是否显示发送的调试信息
    $smtp->debug = false;
    //发送
    $res = $smtp->sendmail($smtpemailto, $smtpusermail, $mailtitle, $mailcontent, $mailtype);
    if( $res ) return 1;
    return 0;
}

/*手机正则验证
* params
* $phone
*/
function check_phone($phone){
    if(preg_match("/^1[34578]\d{9}$/", $phone)) return true;
    return false;
}

/*邮箱正则验证
* params
* $email
*/
function check_email($email){
    if (preg_match("/^([0-9A-Za-z\\-_\\.]+)@([0-9a-z]+\\.[a-z]{2,3}(\\.[a-z]{2})?)$/i",$email)) return true;
    return false;
}

//int转标准时间
function intdate($int){
    return date('Y-m-d H:i:s',$int);
}

 /**
 * 取得上个周一
 * @return string
 */
function getLastMonday()
{
    if (date('l',time()) == 'Monday') return strtotime('last monday');

    return strtotime('-1 week last monday');
}

/**
 * 取得上个周日
 * @return string
 */
function getLastSunday()
{
    return strtotime('last sunday');
}

//根据type返回开始时间
function get_start_time($type){

    //type = 1 今日
    if( $type == 1 ) return strtotime(date('Y-m-d', time()));

    //type = 2 昨天
    if( $type == 2 ) return strtotime(date('Y-m-d', time())) - 24*60*60;

    //type = 3 上周
    if( $type == 3 ) return getLastMonday();

}

//根据type返回结束时间
function get_end_time($type){

    //type = 1 今日
    if( $type == 1 ) return time();

    //type = 2 昨天
    if( $type == 2 ) return strtotime(date('Y-m-d', time()));

    //type = 3 上周
    if( $type == 3 ) return getLastSunday();

}

//根据天猫淘宝id返回商品链接
function item_link($alipay_item_id,$type){

    if( $type == 1 )  return 'https://detail.tmall.com/item.htm?id='.$alipay_item_id;

    if( $type == 2 )  return 'https://item.taobao.com/item.htm?id='.$alipay_item_id;
    
}

//根据天猫淘宝id返回优惠券链接
function coupon_link($alipay_coupon_id,$alipay_seller_id){

    return "https://shop.m.taobao.com/shop/coupon.htm?sellerId=".$alipay_seller_id."&activityId=".$alipay_coupon_id."&v=0";
    
}