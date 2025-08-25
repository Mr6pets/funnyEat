// components/loading/loading.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否显示加载器
    show: {
      type: Boolean,
      value: false
    },
    
    // 加载器类型：spinner, circle, wave, pulse
    type: {
      type: String,
      value: 'spinner'
    },
    
    // 加载文字
    text: {
      type: String,
      value: ''
    },
    
    // 尺寸：small, normal, large
    size: {
      type: String,
      value: 'normal'
    },
    
    // 是否为遮罩模式
    overlay: {
      type: Boolean,
      value: false
    },
    
    // 遮罩主题：light, dark
    theme: {
      type: String,
      value: 'light'
    },
    
    // 是否为内联模式
    inline: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 显示加载器
     */
    showLoading(options = {}) {
      const { text, type, overlay } = options
      
      this.setData({
        show: true,
        text: text || this.properties.text,
        type: type || this.properties.type,
        overlay: overlay !== undefined ? overlay : this.properties.overlay
      })
    },
    
    /**
     * 隐藏加载器
     */
    hideLoading() {
      this.setData({
        show: false
      })
    },
    
    /**
     * 切换加载器显示状态
     */
    toggleLoading() {
      this.setData({
        show: !this.data.show
      })
    }
  },
  
  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      console.log('加载组件已挂载')
    },
    
    detached() {
      console.log('加载组件已卸载')
    }
  },
  
  /**
   * 数据监听器
   */
  observers: {
    'show': function(show) {
      if (show) {
        console.log('加载器显示')
      } else {
        console.log('加载器隐藏')
      }
    }
  }
})