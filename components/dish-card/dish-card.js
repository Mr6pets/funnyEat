// components/dish-card/dish-card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 菜品数据
    dish: {
      type: Object,
      value: {}
    },
    
    // 卡片尺寸：small, medium, large, horizontal
    size: {
      type: String,
      value: 'medium'
    },
    
    // 是否显示收藏按钮
    showFavorite: {
      type: Boolean,
      value: true
    },
    
    // 是否显示评分
    showRating: {
      type: Boolean,
      value: false
    },
    
    // 是否显示时间
    showTime: {
      type: Boolean,
      value: false
    },
    
    // 是否显示描述
    showDescription: {
      type: Boolean,
      value: true
    },
    
    // 是否显示标签
    showTags: {
      type: Boolean,
      value: true
    },
    
    // 是否显示元信息
    showMeta: {
      type: Boolean,
      value: true
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
     * 卡片点击事件
     */
    onCardTap() {
      const { dish } = this.properties
      
      if (!dish || !dish.id) {
        console.warn('菜品数据不完整')
        return
      }
      
      // 触发父组件事件
      this.triggerEvent('cardtap', {
        dish: dish
      })
      
      console.log('菜品卡片点击:', dish.name)
    },
    
    /**
     * 收藏按钮点击事件
     */
    onFavoriteTap() {
      const { dish } = this.properties
      
      if (!dish || !dish.id) {
        console.warn('菜品数据不完整')
        return
      }
      
      // 触发父组件事件
      this.triggerEvent('favoritetap', {
        dish: dish,
        isFavorite: dish.isFavorite
      })
      
      console.log('收藏按钮点击:', dish.name, dish.isFavorite ? '取消收藏' : '添加收藏')
    },
    
    /**
     * 阻止事件冒泡
     */
    stopPropagation() {
      // 阻止事件冒泡到父元素
    },


  },
  
  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      console.log('菜品卡片组件已挂载')
    },
    
    detached() {
      console.log('菜品卡片组件已卸载')
    }
  },
  
  /**
   * 组件所在页面的生命周期
   */
  pageLifetimes: {
    show() {
      // 页面被展示
    },
    
    hide() {
      // 页面被隐藏
    }
  },
  
  /**
   * 数据监听器
   */
  observers: {
    'dish': function(dish) {
      if (dish && !dish.id) {
        console.warn('菜品数据缺少ID字段')
      }
    }
  }
})