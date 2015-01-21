// Initialize app
var myApp = new Framework7({
        pushState:true,
        swipePanel:"left"
});


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
        // Because we want to use dynamic navbar, we need to enable it for this view:
        dynamicNavbar: true
});

$$(document).on('pageInit', function (e) {

});

wx.ready(function () {
        $$(document).on('click', '.scanner', function (e) {
                wx.scanQRCode({
                        desc: '扫一扫',
                        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                        success: function (res) {
                                var result = JSON.parse(res.resultStr);
                                var scanResult = result.scan_code.scan_result;
                                mainView.router.loadPage("detail?p="+scanResult);
                        }
                });
        });
});

wx.error(function (res) {
        alert(res.errMsg);
});


