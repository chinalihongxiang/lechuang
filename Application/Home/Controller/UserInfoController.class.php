<?php
namespace Home\Controller;
use Think\Controller;
class UserInfoController extends Controller {

	//注册选择身份页面
	public function choose(){
		$this->display();
	}

	//商户注册接口
    public function seller_register(){
        $this->display();
    }

    //淘客注册接口
    public function promoter_register(){
    	$this->display();
    }

    //验证邮件发送接口
    public function send_email(){
        set_time_limit(0);
        require_once "./vendor/email.class.php";
        //smtp服务器
        $smtpserver = "smtp.sina.com";
        //SMTP服务器端口
        $smtpserverport = 25;
        //SMTP服务器的用户邮箱
        $smtpusermail = "lianzun2015@sina.com";
        //SMTP服务器的用户帐号
        $smtpuser = "lianzun2015@sina.com";
        //SMTP服务器的用户密码
        $smtppass = "lianzun2015";
        //邮件主题
        $mailtitle = '测试邮件';
        //邮件内容
        $mailcontent = "测试邮件内容";
        //邮件格式（HTML/TXT）,TXT为文本邮件
        $mailtype = "TXT";
        //发送给谁
        $smtpemailto = '332513532@qq.com';
        //这里面的一个true是表示使用身份验证,否则不使用身份验证
        $smtp = new \smtp($smtpserver,$smtpserverport,true,$smtpuser,$smtppass);
        //是否显示发送的调试信息
        $smtp->debug = true;
        //发送
        $res = $smtp->sendmail($smtpemailto, $smtpusermail, $mailtitle, $mailcontent, $mailtype);

        dump($res);

    }

}