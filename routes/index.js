// Generated by CoffeeScript 1.8.0
(function() {
  var PageAction, express, router;

  express = require("express");

  router = express.Router();

  PageAction = require("./../action/pageAction");

  router.get("/", PageAction.home);

  router.get("/list", PageAction.list);

  router.get("/detail", PageAction.detail);

  module.exports = router;

}).call(this);
