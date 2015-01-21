class AppAction
  DomainCtrl = require "./../control/domainCtrl"
  WeiXinCtrl = require "./../control/weixinCtrl"
  async = require "async"
  @getDomain:(req,res,next) ->
    #domain = if req.hostname is "test.meitrip.net" or req.hostname is "mall.holidaycloud.cn"  then "www.meitrip.net" else req.hostname
    domain = "www.meitrip.net"
    DomainCtrl.getEnt domain,(err,result) ->
      if err?
        res.redirect "404"
      else
        res.locals.domain = result
        next()

  @weixinRedirect:(req,res,next) ->
    console.log "----------进入微信跳转逻辑----------"
    ent = res.locals.domain.ent
    isWeixin = req.headers['user-agent'].indexOf('MicroMessenger')>-1
    isLogined = req.session.user isnt null;
    isCode = req.query.code?
    if isWeixin and not isLogined and not isCode
      console.log "----------需要跳转----------",isWeixin,isLogined,isCode
      async.auto {
        getConf:(cb) ->
          WeiXinCtrl.config ent,(err,result) ->
            cb err,result
        createUrl:["getConf",(cb,results) ->
          conf = results.getConf
          url = encodeURIComponent "http://#{req.hostname}#{req.url}"
          if conf?
            cb null,"https://open.weixin.qq.com/connect/oauth2/authorize?appid=#{conf.appID}&redirect_uri=#{url}&response_type=code&scope=snsapi_userinfo&state=weixinLogin#wechat_redirect"
          else
            cb null,null
        ]
      },(err,results) ->
        if err?
          next()
        else
          url = results.createUrl
          if url? then res.redirect(url) else next()
    else
      console.log "----------不需要跳转----------",isWeixin,isLogined,isCode
      next()

  @weixinLogin:(req,res,next) ->
    console.log "----------进入微信自动登录逻辑----------"
    ent = res.locals.domain.ent
    isWeixin = req.headers['user-agent'].indexOf('MicroMessenger')>-1
    isLogined = req.session.user isnt null;
    isCode = req.query.code?
    if isWeixin and not isLogined and isCode
      console.log "----------需要登录----------",isWeixin,isLogined,isCode
      async.auto {
        getToken:(cb) ->
          WeiXinCtrl.codeAccessToken ent,req.query.code,"",(err,result) ->
            cb err,result
        getUserinfo:["getToken",(cb,results) ->
          tokenObj = results.getToken
          WeiXinCtrl.userinfo ent,tokenObj.openid,tokenObj.access_token,(err,result) ->
            cb err,result
        ]
      },(err,results) ->
        console.log err,results
        next()
    else
      console.log "----------不需要登录----------",isWeixin,isLogined,isCode
      next()

module.exports = AppAction