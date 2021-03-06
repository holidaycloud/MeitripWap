// Generated by CoffeeScript 1.8.0
(function() {
  var PageAction;

  PageAction = (function() {
    var ProductCtrl, WeixinCtrl, async;

    function PageAction() {}

    async = require("async");

    ProductCtrl = require("./../control/productCtrl");

    WeixinCtrl = require("./../control/weixinCtrl");

    PageAction.home = function(req, res) {
      var ent;
      ent = res.locals.domain.ent;
      return async.auto({
        getHot: function(cb) {
          return ProductCtrl.hotList(ent, function(err, result) {
            return cb(err, result);
          });
        },
        getRecommend: function(cb) {
          return ProductCtrl.recommendList(ent, function(err, result) {
            return cb(err, result);
          });
        },
        getWeixinApiSign: function(cb) {
          var url;
          url = "http://" + req.hostname + req.url;
          console.log(url);
          return WeixinCtrl.jsapiSign(ent, url, function(err, result) {
            return cb(err, result);
          });
        }
      }, function(err, results) {
        return res.render("index", {
          title: res.locals.domain.title,
          hot: results.getHot.data,
          recommend: results.getRecommend.data,
          weixin: results.getWeixinApiSign.data != null ? results.getWeixinApiSign.data : {}
        });
      });
    };

    PageAction.list = function(req, res) {
      var ent, id, page, pageSize;
      id = req.query.c;
      page = req.query.page || 0;
      pageSize = req.query.pageSize || 0;
      ent = res.locals.domain.ent;
      return ProductCtrl.classifyList(page, pageSize, ent, id, function(err, result) {
        var classify;
        classify = {
          _id: "default",
          name: "所有产品"
        };
        res.locals.domain.classify.forEach(function(c) {
          if (c._id.toString() === id) {
            return classify = c;
          }
        });
        return res.render("list", {
          title: classify.name,
          product: result.data,
          classify: classify,
          page: parseInt(page),
          totalPage: Math.ceil(result.data.totalSize / pageSize)
        });
      });
    };

    PageAction.detail = function(req, res) {
      var id;
      id = req.query.p;
      return ProductCtrl.detail(id, function(err, result) {
        return res.render("detail", {
          title: result.product.name,
          product: result
        });
      });
    };

    return PageAction;

  })();

  module.exports = PageAction;

}).call(this);
