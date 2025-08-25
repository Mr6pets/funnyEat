// components/filter/filter.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否显示筛选器
    show: {
      type: Boolean,
      value: false
    },
    
    // 标题
    title: {
      type: String,
      value: '筛选条件'
    },
    
    // 位置：bottom, top, left, right
    position: {
      type: String,
      value: 'bottom'
    },
    
    // 主题：light, dark
    theme: {
      type: String,
      value: 'light'
    },
    
    // 是否显示遮罩
    showMask: {
      type: Boolean,
      value: true
    },
    
    // 是否显示头部
    showHeader: {
      type: Boolean,
      value: true
    },
    
    // 是否显示底部操作栏
    showFooter: {
      type: Boolean,
      value: true
    },
    
    // 是否可滚动
    scrollable: {
      type: Boolean,
      value: true
    },
    
    // 分类选项
    categories: {
      type: Array,
      value: []
    },
    
    // 难度选项
    difficulties: {
      type: Array,
      value: []
    },
    
    // 时间选项
    times: {
      type: Array,
      value: []
    },
    
    // 口味选项
    tastes: {
      type: Array,
      value: []
    },
    
    // 自定义筛选项
    customFilters: {
      type: Array,
      value: []
    },
    
    // 是否支持多选
    multiple: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectedCount: 0,
    originalData: {} // 保存原始数据用于重置
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 标签点击事件
     */
    onTagTap(e) {
      const { type, id } = e.currentTarget.dataset
      const multiple = this.properties.multiple
      
      // 获取对应的数据数组
      let dataKey = ''
      switch (type) {
        case 'category':
          dataKey = 'categories'
          break
        case 'difficulty':
          dataKey = 'difficulties'
          break
        case 'time':
          dataKey = 'times'
          break
        case 'taste':
          dataKey = 'tastes'
          break
        default:
          // 处理自定义筛选项
          this.handleCustomFilterTap(type, id, multiple)
          return
      }
      
      // 更新选中状态
      const items = this.properties[dataKey]
      const updatedItems = items.map(item => {
        if (item.id === id) {
          return { ...item, selected: !item.selected }
        } else if (!multiple) {
          // 单选模式下取消其他选项
          return { ...item, selected: false }
        }
        return item
      })
      
      // 更新数据
      this.setData({
        [dataKey]: updatedItems
      })
      
      this.updateSelectedCount()
      
      // 触发选择事件
      this.triggerEvent('select', {
        type,
        id,
        selected: updatedItems.find(item => item.id === id).selected,
        items: updatedItems
      })
    },
    
    /**
     * 处理自定义筛选项点击
     */
    handleCustomFilterTap(type, id, multiple) {
      const customFilters = this.properties.customFilters
      const updatedFilters = customFilters.map(section => {
        if (section.key === type) {
          const updatedOptions = section.options.map(option => {
            if (option.id === id) {
              return { ...option, selected: !option.selected }
            } else if (!multiple) {
              return { ...option, selected: false }
            }
            return option
          })
          return { ...section, options: updatedOptions }
        }
        return section
      })
      
      this.setData({
        customFilters: updatedFilters
      })
      
      this.updateSelectedCount()
      
      // 触发选择事件
      const selectedOption = updatedFilters
        .find(section => section.key === type)
        .options.find(option => option.id === id)
      
      this.triggerEvent('select', {
        type,
        id,
        selected: selectedOption.selected,
        section: updatedFilters.find(section => section.key === type)
      })
    },
    
    /**
     * 更新选中数量
     */
    updateSelectedCount() {
      let count = 0
      
      // 统计各类选中项
      const { categories, difficulties, times, tastes, customFilters } = this.properties
      
      count += categories.filter(item => item.selected).length
      count += difficulties.filter(item => item.selected).length
      count += times.filter(item => item.selected).length
      count += tastes.filter(item => item.selected).length
      
      customFilters.forEach(section => {
        count += section.options.filter(option => option.selected).length
      })
      
      this.setData({ selectedCount: count })
    },
    
    /**
     * 重置筛选条件
     */
    onReset() {
      // 重置所有选项
      const resetData = {}
      
      if (this.properties.categories.length > 0) {
        resetData.categories = this.properties.categories.map(item => ({ ...item, selected: false }))
      }
      
      if (this.properties.difficulties.length > 0) {
        resetData.difficulties = this.properties.difficulties.map(item => ({ ...item, selected: false }))
      }
      
      if (this.properties.times.length > 0) {
        resetData.times = this.properties.times.map(item => ({ ...item, selected: false }))
      }
      
      if (this.properties.tastes.length > 0) {
        resetData.tastes = this.properties.tastes.map(item => ({ ...item, selected: false }))
      }
      
      if (this.properties.customFilters.length > 0) {
        resetData.customFilters = this.properties.customFilters.map(section => ({
          ...section,
          options: section.options.map(option => ({ ...option, selected: false }))
        }))
      }
      
      resetData.selectedCount = 0
      
      this.setData(resetData)
      
      // 触发重置事件
      this.triggerEvent('reset', {
        timestamp: Date.now()
      })
      
      console.log('筛选条件已重置')
    },
    
    /**
     * 确认筛选
     */
    onConfirm() {
      // 收集所有选中的筛选条件
      const selectedFilters = this.getSelectedFilters()
      
      // 触发确认事件
      this.triggerEvent('confirm', {
        filters: selectedFilters,
        count: this.data.selectedCount
      })
      
      // 隐藏筛选器
      this.hideFilter()
      
      console.log('筛选确认', selectedFilters)
    },
    
    /**
     * 获取选中的筛选条件
     */
    getSelectedFilters() {
      const filters = {}
      
      // 收集各类选中项
      const selectedCategories = this.properties.categories.filter(item => item.selected)
      if (selectedCategories.length > 0) {
        filters.categories = selectedCategories
      }
      
      const selectedDifficulties = this.properties.difficulties.filter(item => item.selected)
      if (selectedDifficulties.length > 0) {
        filters.difficulties = selectedDifficulties
      }
      
      const selectedTimes = this.properties.times.filter(item => item.selected)
      if (selectedTimes.length > 0) {
        filters.times = selectedTimes
      }
      
      const selectedTastes = this.properties.tastes.filter(item => item.selected)
      if (selectedTastes.length > 0) {
        filters.tastes = selectedTastes
      }
      
      // 收集自定义筛选项
      this.properties.customFilters.forEach(section => {
        const selectedOptions = section.options.filter(option => option.selected)
        if (selectedOptions.length > 0) {
          filters[section.key] = selectedOptions
        }
      })
      
      return filters
    },
    
    /**
     * 遮罩点击事件
     */
    onMaskTap() {
      this.hideFilter()
    },
    
    /**
     * 显示筛选器
     */
    showFilter(options = {}) {
      // 保存原始数据
      this.setData({
        originalData: {
          categories: JSON.parse(JSON.stringify(this.properties.categories)),
          difficulties: JSON.parse(JSON.stringify(this.properties.difficulties)),
          times: JSON.parse(JSON.stringify(this.properties.times)),
          tastes: JSON.parse(JSON.stringify(this.properties.tastes)),
          customFilters: JSON.parse(JSON.stringify(this.properties.customFilters))
        }
      })
      
      // 更新配置
      if (options.title) this.setData({ title: options.title })
      if (options.position) this.setData({ position: options.position })
      
      this.setData({ show: true })
      this.updateSelectedCount()
    },
    
    /**
     * 隐藏筛选器
     */
    hideFilter() {
      this.setData({ show: false })
      
      // 触发关闭事件
      this.triggerEvent('close', {
        timestamp: Date.now()
      })
    }
  },
  
  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      console.log('筛选器组件已挂载')
      this.updateSelectedCount()
    },
    
    detached() {
      console.log('筛选器组件已卸载')
    }
  },
  
  /**
   * 数据监听器
   */
  observers: {
    'categories, difficulties, times, tastes, customFilters': function() {
      this.updateSelectedCount()
    }
  }
})