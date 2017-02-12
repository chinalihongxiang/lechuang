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