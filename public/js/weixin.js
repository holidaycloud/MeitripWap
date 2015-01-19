/**
 * Created by zzy on 2015/1/19.
 */
wx.ready(function () {
    wx.checkJsApi({
        jsApiList: [
            'getNetworkType',
            'previewImage'
        ],
        success: function (res) {
            alert(JSON.stringify(res));
        }
    });
});

wx.error(function (res) {
    alert(res.errMsg);
});
