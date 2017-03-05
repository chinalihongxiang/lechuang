<?php
class LdApi {
  const API_URL = 'http://rest.ldtui.com';

  private $_appid;
  private $_apptoken;
  private $_apiid;

  protected $endpoint;

	/**
	 * 初始化亮盾接口
	 * @param $appid 应用ID
	 * @param $apptoken 应用Token
	 * @return object
	 */
	public function __construct($appid, $apptoken, $apiid, $endpoint) {
		$this->_appid = $appid;
		$this->_apptoken = $apptoken;
		$this->_apiid = $apiid;
		$this->endpoint = is_null($endpoint) ? self::API_URL : $endpoint;
	}

  public function get($entity, $params = array())
  {
    $url = $this->endpoint . '/' . $this->_apiid . '/' . $entity;
    if (!empty($params)) {
      $url .= '?' . http_build_query($params);
    }
    return $this->_exec('GET', $url);
  }

  public function post($entity, $params = array(), $buildQuery = true)
  {
    $url = $this->endpoint . '/' . $this->_apiid . '/' . $entity;
    return $this->_exec('POST', $url, $params, $buildQuery);
  }

  public function put($entity, $params = array(),  $buildQuery = true)
  {
    $url = $this->endpoint . '/' . $this->_apiid . '/' . $entity;
    return $this->_exec('PUT', $url, $params, $buildQuery);
  }

  public function del($entity, $params = array(),  $buildQuery = true)
  {
    $url = $this->endpoint . '/' . $this->_apiid . '/' . $entity;
    return $this->_exec('DELETE', $url, $params, $buildQuery);
  }

  private function _exec($method, $url, $params = array(), $buildQuery = true)
  {
    $ch = curl_init();
    switch ($method) {
      case 'GET':
        curl_setopt($ch, CURLOPT_HTTPGET, true);
        break;
      case 'POST':
      case 'PUT':
      case 'DELETE':
        if ($method == 'POST') {
          curl_setopt($ch, CURLOPT_POST, true);
        } else {
          curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        }
        if ($buildQuery) {
          curl_setopt($ch, CURLOPT_POSTFIELDS, preg_replace('/%5B[0-9]+%5D/simU', '', http_build_query($params)));
        } else {
          curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
        }
        break;
      default:
        curl_close($ch);
        return;
    }
    $headers = array(
      'appid: ' . $this->_appid,
      'key: ' . $this->_apptoken,
      'Content-Type: application/x-www-form-urlencoded',
    );
    curl_setopt_array($ch, array(
      CURLOPT_HTTPHEADER => $headers,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_AUTOREFERER => true,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_URL => $url,
    ));
    $response = curl_exec($ch);
    $httpInfo = curl_getinfo($ch);
    curl_close($ch);
    if ($response === false) {
      throw new Exception('无效请求', func_get_args());
    } else {
      $httpCode = $httpInfo['http_code'];
      $httpContentType = $httpInfo['content_type'];
      if ($httpContentType == 'application/json') {
        $response = json_decode($response);
      }
      return $response;
    }
  }
}

// @$ldapi = new LdApi('你的 appid', '你的 apptoken', '调用接口的apiid');
$appid = '你的 appid';
$apptoken = '你的 apptoken';

// 店铺黑名单
@$ldtuiBbsApi = new LdApi($appid, $apptoken, 'ldtui-bbs');
$result = $ldtuiBbsApi->get('getblackshop.php');

// QQ采集数据
@$qqDataApi = new LdApi($appid, $apptoken, 'qqdata');
// 获取商品分类
$result = $qqDataApi->get('api/getcategories');
// 获取商品列表
$result = $qqDataApi->get('api/getproducts' , array('page' => 1));
// 获取商品最近下架id
$result = $qqDataApi->get('api/getoffproducts');

// 亮盾短网址
@$ymbBzApi = new LdApi($appid, $apptoken, 'ymb-bz');
// 生成短网址
$result = $ymbBzApi->post('url', array('url' => 'http://www.taobao.com/'));
