// components/uploadImage/index.js
import Toast from '../../utils/toast'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    fileList: {
      type: Array,
      value: []
    },
    count: {
      type: Number,
      value: 9
    },
    mediaType: {
      type: Array,
      value: ['image']
    },
    sourceType: {
      type: Array,
      value: ['album', 'camera']
    },
    // 图片压缩
    sizeType: {
      type: Array,
      value: ['compressed']
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    innerFileList: [],
    fileIDs: []
  },
  attached() {
    console.log(1)
    this.setData({
      innerFileList: this.data.fileList
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    uploadImage() {
      const {
        count,
        mediaType,
        sourceType,
        sizeType
      } = this.data
      wx.chooseMedia({
        count,
        mediaType,
        sourceType,
        sizeType,
        success: (res) => {
          const tempFile = res.tempFiles[0];
          let list = [...this.data.innerFileList, tempFile.tempFilePath]
          this.cloudUpload(tempFile.tempFilePath, list)
        },
        fail: (err) => {
          Toast('选择图片失败')
        }
      })
    },
    hanldeDelete({
      currentTarget
    }) {
      let file = currentTarget.dataset.file
      let list = this.data.innerFileList.filter(item => item != file)
      let index = this.data.innerFileList.findIndex(item => item == file)
      let newFileIds = this.data.fileIDs.filter((item, CIndex) => CIndex != index)
      wx.cloud.deleteFile({
        fileList: [this.data.fileIDs[index]]
      }).then(res => {
        console.log('删除成功', res);
        this.setData({
          innerFileList: list,
          fileIDs: newFileIds
        })
        this.triggerEvent('fileChange', {
          file: list,
          fileIDs: newFileIds
        })
      }).catch(error => {
        console.error('删除失败', error);
      });
    },
    cloudUpload(filePath, list) {
      const uploadTask = wx.cloud.uploadFile({
        cloudPath: 'images/' + Date.now() + '-' + Math.random(),
        filePath
      });
      uploadTask.then(uploadRes => {
        // 存储fileID用于后续提交
        this.setData({
          innerFileList: list,
          fileIDs: [...this.data.fileIDs, uploadRes.fileID]
        });
        this.triggerEvent('fileChange', {
          file: list,
          fileIDs: this.data.fileIDs
        })
      }).catch(error => {
        Toast('上传失败')
      });
    }
  }
})