Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [{
          key: 'food',
          name: '食品',
          icon: "/images/icons/food.svg",
          selectedIcon: "/images/icons/food-selected.svg"
        },
        {
          key: 'cosmetics',
          name: '化妆品',
          icon: '/images/icons/cosmetics.svg',
          selectedIcon: "/images/icons/cosmetics-selected.svg"
        },
        {
          key: 'daily',
          name: '日用品',
          icon: '/images/icons/daily.svg',
          selectedIcon: "/images/icons/daily-selected.svg"
        },
        {
          key: 'medicine',
          name: '药品',
          icon: '/images/icons/medicine.svg',
          selectedIcon: "/images/icons/medicine-selected.svg"
        },
        {
          key: 'other',
          name: '其他',
          icon: '/images/icons/other.svg',
          selectedIcon: "/images/icons/other-selected.svg"
        }
      ]
    },
    defaultKey: {
      type: String,
      value: ''
    },
    // 激活指示器颜色
    activeColor: {
      type: String,
      value: '#67C090'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentKey: ''
  },
  lifetimes: {
    attached: function () {
      // 初始化选中状态
      if (this.data.defaultKey && this.data.list.length > 0) {
        this.setData({
          currentKey: this.data.defaultKey
        });
      }
      if(!this.data.defaultKey){
        this.setData({
          currentKey: this.data.list[0].key
        });
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击选项卡切换
    handleClick(e) {
      const data = e.currentTarget.dataset;
      const key = data.key
      if (this.data.currentKey === key) return;

      // 更新选中状态
      this.setData({
        currentKey: key
      });

      this.triggerEvent('change', {
        key
      });
    }
  }
})