Component({
  properties: {
    // 浮动球尺寸
    size: {
      type: Number,
      value: 60
    },
    // 图标路径
    iconPath: {
      type: String,
      value: ''
    },
    // 自定义样式
    customStyle: {
      type: String,
      value: ''
    },
    // 是否启用磁吸效果
    magnetic: {
      type: Boolean,
      value: true
    },
    // 吸附边缘的阈值
    adsorbThreshold: {
      type: Number,
      value: 30
    }
  },

  data: {
    x: 0,
    y: 0,
    windowWidth: 0,
    windowHeight: 0,
    animationData: null,
    isDragging: false,
    opacity: 1,
    disabled: false,
    lastPosition: {
      x: 0,
      y: 0
    }
  },

  lifetimes: {
    attached() {
      this.initComponent();
    }
  },

  methods: {
    // 初始化组件
    initComponent() {
      const sysInfo = wx.getSystemInfoSync();
      const {
        windowWidth,
        windowHeight
      } = sysInfo;

      this.setData({
        windowWidth,
        windowHeight
      }, () => {
        this.initBallPosition(this.properties.initPosition);
      });
    },

    // 初始化位置
    initBallPosition(position) {
      const {
        windowWidth,
        windowHeight
      } = this.data;
      const {
        size,
        adsorbThreshold
      } = this.properties;

      const x = windowWidth - size - adsorbThreshold;
      const y = windowHeight - size - adsorbThreshold;

      this.setData({
        x,
        y,
        lastPosition: {
          x,
          y
        }
      });
    },

    // 触摸开始
    onTouchStart(e) {
      this.setData({
        isDragging: true,
        opacity: 0.9,
        disabled: false
      });

      this.startTime = Date.now();
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
      this.lastPosition = {
        ...this.data.lastPosition
      };
    },

    // 触摸移动
    onTouchMove(e) {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;

      const deltaX = currentX - this.startX;
      const deltaY = currentY - this.startY;

      this.setData({
        x: this.lastPosition.x + deltaX - this.data.size / 2,
        y: this.lastPosition.y + deltaY - this.data.size / 2
      });
    },

    // 拖拽事件
    onChange(e) {
      this.currentX = e.detail.x;
      this.currentY = e.detail.y;
    },

    // 拖拽结束
    onTouchEnd(e) {
      const endTime = Date.now();
      const dragDuration = endTime - this.startTime;

      this.setData({
        isDragging: false,
        opacity: 1,
        disabled: true
      });

      if (dragDuration < 200) {
        setTimeout(() => {
          this.setData({
            disabled: false
          });
        }, 100);
        return;
      }

      this.adsorbToEdge();
    },

    // 吸附到边缘
    adsorbToEdge() {
      const {
        windowWidth,
        windowHeight
      } = this.data;
      const {
        size,
        magnetic,
        adsorbThreshold
      } = this.properties;

      const currentX = this.currentX || this.data.x;
      const currentY = this.currentY || this.data.y;

      // 判断靠近哪个边缘
      const centerX = windowWidth / 2;
      const isLeft = currentX < centerX;

      // 计算目标位置
      let targetX = isLeft ? adsorbThreshold : windowWidth - size - adsorbThreshold;
      let targetY = currentY;

      // 限制Y轴范围
      const minY = adsorbThreshold;
      const maxY = windowHeight - size - adsorbThreshold;

      if (targetY < minY) targetY = minY;
      if (targetY > maxY) targetY = maxY;

      // 添加磁吸效果
      if (magnetic) {
        this.playMagneticAnimation();
      }

      // 平滑移动到目标位置
      this.setData({
        x: targetX,
        y: targetY,
        lastPosition: {
          x: targetX,
          y: targetY
        }
      });

      setTimeout(() => {
        this.setData({
          disabled: false
        });
      }, 300);
    },

    // 播放磁吸动画
    playMagneticAnimation() {
      this.setData({
        animationData: true
      });

      setTimeout(() => {
        this.setData({
          animationData: false
        });
      }, 300);
    },

    // 点击事件
    onTap() {
      if (!this.data.isDragging && Date.now() - this.startTime > 200) {
        this.animateBall();
        this.triggerEvent('click');
      }
    },

    // 浮动球动画
    animateBall() {
      this.setData({
        animationData: true
      });

      setTimeout(() => {
        this.setData({
          animationData: false
        });
      }, 400);
    }
  }
})