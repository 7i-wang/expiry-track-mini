const Toast = (title, icon = 'none', duration = 2000) => {
  wx.showToast({
    title,
    icon,
    duration,
    mask: false
  });
};

export default Toast