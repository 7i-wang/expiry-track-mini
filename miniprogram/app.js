// app.js
App({
  onLaunch: function () {
    wx.hideTabBar()
    this.globalData = {
      env: "cloudbase-3g6jhne32a233bbd"
    };
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: this.globalData.env,
        traceUser: true,
      });
    }
  },
});
