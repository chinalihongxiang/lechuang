<?php
return array(

	//数据库配置
	'DB_TYPE'   => 'mysqli',       // 数据库类型
    'DB_PORT'   => '3306',         // 端口
    'DB_PREFIX' => '',             // 数据库表前缀
    'DB_HOST'   => '60.205.202.8', // 服务器地址
    'DB_USER'   => 'root',         // 用户名
    'DB_PWD'    => '',             // 密码
    'DB_NAME'   => 'lechuang',     // 数据库名

	//前端模板路径配置
	'TMPL_PARSE_STRING' => array(
			//js路径
			'__JS__'     => '/Public/js',
			//css路径
	        '__CSS__'    => '/Public/css',
	        //图片路径
	        '__IMG__'    => '/Public/img',
		),
);