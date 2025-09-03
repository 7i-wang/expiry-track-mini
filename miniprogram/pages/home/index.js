const db = wx.cloud.database()
Page({
  data: {
    goodsList: [],
    expiryList: [],
    showList: [],
    showPopup: false,
    tabChoose: 'food'
  },

  onLoad() {
    // 页面加载时获取商品列表
    this.getGoodsList();
  },

  onShow() {
    // 页面显示时刷新商品列表
    this.getGoodsList();
  },

  // 加载商品列表
  getGoodsList() {
    db.collection('hoard_goods').get()
      .then(async res => {
        const goodsList = this.calcExpirationTime(res.data)
        for (let item of goodsList) {
          if (item.file && item.file.length > 0) {
            // 获取所有图片的临时URL
            const tempFileURLRes = await wx.cloud.getTempFileURL({
              fileList: item.file
            });

            // 将临时URL添加到物品对象中
            item.imageUrls = tempFileURLRes.fileList.map(file => file.tempFileURL);
          }
        }
        let expiryList = goodsList.filter(item => item.status == 'warning')
        console.log({
          goodsList,
          expiryList
        })
        this.setData({
          goodsList,
          expiryList
        })
        this.onTabChange({
          detail: {
            key: this.data.tabChoose
          }
        })
      })
      .catch(err => {
        console.error('获取失败', err)
      })
  },

  // 计算过期时间
  calcExpirationTime(data) {
    return data.map(item => {
      const today = new Date();
      const expiryDate = new Date(item.expiryDate);
      const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

      let status, statusText;
      if (daysLeft <= 0) {
        status = 'expired';
        statusText = '已过期';
      } else if (daysLeft <= 7) {
        status = 'warning';
        statusText = `剩余${daysLeft}天`;
      } else {
        status = 'normal';
        statusText = `剩余${daysLeft}天`;
      }

      return {
        ...item,
        status,
        statusText
      };
    });
  },

  handleAdd() {
    this.setData({
      showPopup: true
    });
  },

  onPopupCancel: function () {
    this.setData({
      showPopup: false
    });
  },

  onAddItem: function (e) {
    db.collection('hoard_goods').add({
      data: e.detail,
      success: res => {
        this.getGoodsList()
      },
      fail: err => {
        console.error('添加失败', err)
      }
    })
  },

  onTabChange({
    detail
  }) {
    let showList = this.data.goodsList.filter(item => item.category == detail.key)
    this.setData({
      showList,
      tabChoose: detail.key
    })
  }
});