// components/empty-state/empty-state.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否显示空状态
    show: {
      type: Boolean,
      value: true
    },
    
    // 图标（emoji或字符）
    icon: {
      type: String,
      value: '📝'
    },
    
    // 图片路径
    image: {
      type: String,
      value: ''
    },
    
    // 标题
    title: {
      type: String,
      value: '暂无数据'
    },
    
    // 描述文字
    description: {
      type: String,
      value: ''
    },
    
    // 是否显示按钮
    showButton: {
      type: Boolean,
      value: false
    },
    
    // 按钮文字
    buttonText: {
      type: String,
      value: '重新加载'
    },
    
    // 按钮类型：primary, secondary, ghost
    buttonType: {
      type: String,
      value: 'primary'
    },
    
    // 尺寸：small, normal, large
    size: {
      type: String,
      value: 'normal'
    },
    
    // 主题：light, gray, transparent
    theme: {
      type: String,
      value: 'transparent'
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
     * 按钮点击事件
     */
    onButtonTap() {
      // 触发父组件事件
      this.triggerEvent('buttontap', {
        timestamp: Date.now()
      })
      
      console.log('空状态按钮点击')
    },
    
    /**
     * 显示空状态
     */
    showEmpty(options = {}) {
      const { icon, title, description, showButton, buttonText } = options
      
      this.setData({
        show: true,
        icon: icon || this.properties.icon,
        title: title || this.properties.title,
        description: description || this.properties.description,
        showButton: showButton !== undefined ? showButton : this.properties.showButton,
        buttonText: buttonText || this.properties.buttonText
      })
    },
    
    /**
     * 隐藏空状态
     */
    hideEmpty() {
      this.setData({
        show: false
      })
    }
  },
  
  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      console.log('空状态组件已挂载')
    },
    
    detached() {
      console.log('空状态组件已卸载')
    }
  },
  
  /**
   * 数据监听器
   */
  observers: {
    'show': function(show) {
      if (show) {
        console.log('空状态显示')
      } else {
        console.log('空状态隐藏')
      }
    }
  }
})