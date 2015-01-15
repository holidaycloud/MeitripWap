class AppAction
  DomainCtrl = require "./../control/domainCtrl"

  @getDomain:(req,res,next) ->
    #domain = if req.hostname is "test.meitrip.net" or req.hostname is "mall.holidaycloud.cn"  then "www.meitrip.net" else req.hostname
    domain = "www.meitrip.net"
    DomainCtrl.getEnt domain,(err,result) ->
      if err?
        res.redirect "404"
      else
        res.locals.domain = result
        next()

module.exports = AppAction