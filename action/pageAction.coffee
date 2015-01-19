class PageAction
  async = require "async"
  ProductCtrl = require "./../control/productCtrl"
  WeixinCtrl = require "./../control/weixinCtrl"
  @home:(req,res) ->
    ent = res.locals.domain.ent
    async.auto {
      getHot:(cb) ->
        ProductCtrl.hotList ent,(err,result) ->
          cb err,result
      getRecommend:(cb) ->
        ProductCtrl.recommendList ent,(err,result) ->
          cb err,result
      getWeixinApiSign:(cb) ->
        url = "http://#{req.hostname}#{req.url}"
        console.log url
        WeixinCtrl.jsapiSign ent,url,(err,result) ->
          cb err,result
    },(err,results) ->
      console.log err,results.getWeixinApiSign
      res.render "index",{title:res.locals.domain.title,hot:results.getHot.data,recommend:results.getRecommend.data,weixin:if results.getWeixinApiSign.data? then results.getWeixinApiSign.data else {}}

  @list:(req,res) ->
    id = req.query.c
    page = req.query.page or 0
    pageSize = req.query.pageSize or 0
    ent = res.locals.domain.ent
    ProductCtrl.classifyList page,pageSize,ent,id,(err,result) ->
      classify ={_id:"default",name:"所有产品"};
      res.locals.domain.classify.forEach (c) ->
        if c._id.toString() is id
          classify = c
      res.render "list",{title:classify.name,product:result.data,classify:classify,page:parseInt(page),totalPage:Math.ceil(result.data.totalSize/pageSize)};

  @detail:(req,res) ->
    id=req.query.p
    ProductCtrl.detail id,(err,result) ->
      res.render "detail",{title:result.product.name,product:result}

module.exports = PageAction