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
wx.ready(function () {
        wx.hideOptionMenu();
        wx.onMenuShareTimeline({
                title: 'test', // 分享标题
                link: 'http://test.meitrip.net/#!/detail?p=54a36ddbd62713a35a8e727e', // 分享链接
                imgUrl: 'http://holidaycloud.b0.upaiyun.com/582d29f881ea54667bc7a4a5d5b7b782.jpg', // 分享图标
                success: function () {
                        // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                        // 用户取消分享后执行的回调函数
                }
        });
        $$('#scanner').on('click', function (e) {
                wx.scanQRCode({
                        desc: '扫一扫',
                        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                        success: function (res) {
                                alert(res.resultStr);
                                var result = JSON.parse(res.resultStr);
                                var scanResult = result.scan_code.scan_result;
                                alert(scanResult);
                                mainView.router.loadPage("detail?p="+scanResult);
                        }
                });
        });
});

wx.error(function (res) {
        alert(res.errMsg);
});

