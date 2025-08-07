在views下创建一个文件夹，里面用于过期修改密码页面，如果code是210就返回到解锁页面。

1、过期修改密码页面输入框有账号密码、确认密码、修改密码页面格式参考解锁页面，背景颜色变成青色，验证码和右侧按钮（发送验证码）调用UNLOCKEXPIRATION_SEND_API接口请求参数：[FromQuery] string userNo
返回参数：
{
  "code": 200,
  "data": null
  "Message": "",
}，发送验证码按钮倒计时60秒，60秒后可以重新发送，修改密码时调用PwdExpirationUpdate接口，请求参数：{
  "userNo": "",
  "password": "",
  "verificationCode": ""
}，返回参数：
{
  "code": 200,
  "data": null
  "Message": "",
}，如果是200提示，然后3秒后跳转到登录页面，否则就提示错误信息，然后点击发送验证码之后账号输入框禁用，点击修改密码时账号、验证码、密码、确认密码输入框禁用（以上需求页面的路由写死，参考登录页面，i18n同样配置完整）。




