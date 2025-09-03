import Toast from '../../utils/toast'
import {
  formatDate
} from '../../utils/tool'
Component({
  properties: {
    isPopupShow: {
      type: Boolean,
      value: false
    }
  },
  data: {
    minDate: formatDate(new Date()),
    formData: {
      name: '',
      category: '',
      expiryDate: '',
      reminderTime: '',
      file:[]
    },
    categoryOptions: [{
        key: 'food',
        label: '食品',
        reminderTime: 7,
      },
      {
        key: 'cosmetics',
        label: '化妆品',
        reminderTime: 180,
      },
      {
        key: 'daily',
        label: '日用品',
        reminderTime: 180,
      },
      {
        key: 'medicine',
        label: '药品',
        reminderTime: 90,
      },
      {
        key: 'other',
        label: '其他',
        reminderTime: 30,
      }
    ],
    categoryIndex: null,
    reminderTimeOptions: [{
        id: 1,
        label: '一周',
        reminderTime: 7,
      },
      {
        id: 2,
        label: '一个月',
        reminderTime: 30,
      },
      {
        id: 3,
        label: '半年',
        reminderTime: 180,
      }
    ],
    reminderTimeIndex: null
  },
  methods: {
    // 图片上传
    fileChange({detail}) {
      let list = detail.fileIDs.map(item => item)
      this.setData({
        'formData.file': list
      })
    },
    handleOptionSelection(type, value) {
      const options = this.data[`${type}Options`];
      const selectedOption = options[value];
      const data = {
        [`${type}Index`]: value
      };

      // 两种类型都需要设置reminderTime
      data['formData.reminderTime'] = selectedOption.reminderTime;

      // 只有category类型需要额外设置category
      if (type === 'category') {
        data['formData.category'] = selectedOption;
      }

      return data;
    },
    onChange: function ({
      currentTarget,
      detail
    }) {
      const type = currentTarget.dataset.type;
      const value = detail.value;

      if (['category', 'reminderTime'].includes(type)) {
        this.setData(this.handleOptionSelection(type, value));
      } else {
        this.setData({
          [`formData.${type}`]: value
        });
      }
    },
    onCancel: function () {
      this.triggerEvent('cancel');
    },
    onAddItem: function () {
      let data = this.data.formData
      if (!data.name) {
        Toast('请输入名称')
        return
      }
      if (!data.category) {
        Toast('请选择分类')
        return
      }
      if (!data.expiryDate) {
        Toast('请填写保质期')
        return
      }
      if (data.file.length == 0) {
        Toast('请选择照片')
        return
      }
      data = {
        ...data,
        category: data.category.key,
        categoryText: data.category.label
      }
      this.triggerEvent('add', data);
      this.setData({
        formData: {
          name: '',
          category: '',
          expiryDate: '',
          reminderTime: '',
          file: []
        },
        categoryIndex: null,
        reminderTimeIndex: null
      })
      console.log(this.data.formData)
      this.triggerEvent('cancel');
    }
  }
})