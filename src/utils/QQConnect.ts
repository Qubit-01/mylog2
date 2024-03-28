const myQC = {}
myQC.APPID = '102099147 '
myQC.APPKey = 'RnwueATZXHm23pNh'

// 直接调的方法
// QC.Login.signOut() 登出
// QC.Login.check()	返回Boolean	检查是否已经登录
// QC.Login.getMe(func(openId, accessToken))	只能在用户登录授权后调用，建议总是在使用check方法并返回true的条件下，调用getMe方法
// openId：用户身份的唯一标识。建议保存在本地，以便用户下次登录时可对应到其之前的身份信息，不需要重新授权
// accessToken：表示当前用户在此网站/应用的登录状态与授权信息，建议保存在本地
// QC.Login.showPopup({addId:'APPID',redirectURI:'回调地址'})	 直接打开窗口


// https://graph.qq.com/oauth2.0/show?which=Login&display=pc&client_id=100490701&redirect_uri=https%3A%2F%2Fwww.zhihu.com%2Foauth%2Fcallback%2Fqqconn%3Faction%3Dlogin%26from%3D&response_type=code&scope=get_info%2Cget_user_info%2Cget_other_info%2Cadd_t%2Cadd_pic_t%2Cget_fanslist%2Cget_idollist%2Cadd_idol%2Cadd_share

// https://sicau.xyz/#/user#
// access_token=999C7469F6EB04273E89921CE76AB237 & 
// expires_in=7776000 & 
// state=wdnmd



// 总文档 https://wiki.connect.qq.com/js_sdk%e4%bd%bf%e7%94%a8%e8%af%b4%e6%98%8e


// 调用官方API
// 文档 https://wiki.connect.qq.com/api%e5%88%97%e8%a1%a8
// QC.api(api, paras, fmt, method)
// paras不用自己传access_token与openid

// 获取用户信息
myQC.getUserInfo = () => {
  QC.api('get_user_info', {
    // oauth_consumer_key: myQC.APPID,
    // access_token:'',
    // openid:'',
    // format:'json',
  }, fmt, method).success((res) => {
    console.log(res)
    // qqInfo.value = res.data
  })
}




