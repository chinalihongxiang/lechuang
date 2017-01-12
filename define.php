<?php
//验证邮箱发送邮箱
$my_email         = 'lianzun2015@sina.com';
//验证邮箱服务器账号
$my_smtp_account  = 'lianzun2015@sina.com';
//验证邮箱服务器密码
$my_smtp_pass    = 'lianzun2015';
//验证邮箱发送smtp服务器
$email_smtp       = 'smtp.sina.com';
//验证邮箱发送smtp服务器端口
$email_smtp_port  = 25;

/************************************************/
define('MY_EMAIL', $my_email);
define('MY_SMTP_ACCOUNT', $my_smtp_account);
define('MY_SMTP_PASS', $my_smtp_pass);
define('EMAIL_SMTP', $email_smtp);
define('EMAIL_PORT', $email_smtp_port);