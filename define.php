<?php

/***********************************邮箱验证配置*********************************/

//验证邮箱发送邮箱
$my_email         = 'postmaster@tkcaiji.com';
//验证邮箱服务器账号
$my_smtp_account  = 'postmaster@tkcaiji.com';
//验证邮箱服务器密码
$my_smtp_pass     = 'Lianzun2015';
//验证邮箱发送smtp服务器
$email_smtp       = 'smtp.hichina.com';
//验证邮箱发送smtp服务器端口
$email_smtp_port  = 80;

/***********************************邮箱验证配置结束*********************************/




/***********************************后台登录密码*********************************/

$adminPass  = 'Lianzun2015';

/***********************************后台登录密码结束*********************************/





/************************************************/
define('MY_EMAIL', $my_email);
define('MY_SMTP_ACCOUNT', $my_smtp_account);
define('MY_SMTP_PASS', $my_smtp_pass);
define('EMAIL_SMTP', $email_smtp);
define('EMAIL_PORT', $email_smtp_port);
define('ADMIN_PASS', $adminPass);